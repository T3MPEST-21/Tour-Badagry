'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'
import { revalidatePath } from 'next/cache'
import { ensureAuthenticated, ensureRole } from '@/lib/auth-guard'

type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingRow = Database['public']['Tables']['bookings']['Row']
type ProfileRow = Database['public']['Tables']['profiles']['Row']

export type ActionResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Job: Securely insert booking into DB (Passenger).
 * One Job: Create the record. Guard handles the entry requirements.
 */
export async function createBooking(
  data: Omit<BookingInsert, 'user_id' | 'id' | 'created_at' | 'status' | 'driver_id' | 'price'>,
  idempotencyKey: string
): Promise<ActionResponse<BookingRow>> {
  try {
    const user = await ensureAuthenticated()
    const supabase = await createClient()

    // Database UNIQUE constraint handles duplication, 
    // but we can be explicit here if needed.
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert({
        ...data,
        user_id: user.id,
        idempotency_key: idempotencyKey as any // Casting as any since types might not be updated yet
      })
      .select()
      .single()

    if (dbError) {
      if (dbError.code === '23505') { // Postgres error for unique violation
        return { success: false, error: 'Request already processed.' }
      }
      console.error('Booking DB Error:', dbError)
      return { success: false, error: 'System Error: Could not save your booking.' }
    }

    return { success: true, data: booking }
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error' }
  }
}

/**
 * Job: Retrieve user's booking history (Passenger).
 */
export async function getUserBookings(): Promise<ActionResponse<BookingRow[]>> {
  try {
    const user = await ensureAuthenticated()
    const supabase = await createClient()

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return { success: false, error: 'Could not fetch bookings.' }
    return { success: true, data: bookings }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Job: Admin Only - Assign a Driver to a Booking.
 */
export async function assignDriver(bookingId: string, driverId: string): Promise<ActionResponse<BookingRow>> {
  try {
    await ensureRole('admin')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('bookings')
      .update({
        driver_id: driverId,
        status: 'assigned'
      })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) {
      console.error('Assign Driver Error:', error)
      return { success: false, error: 'Failed to assign driver.' }
    }

    // Apollo Logistics: Auto-switch chauffeur to BUSY
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ driver_status: 'busy' })
      .eq('id', driverId)

    if (profileError) console.error('Auto-status busy failed:', profileError)

    revalidatePath('/admin')
    revalidatePath('/dashboard/driver')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Job: Admin Only - Get List of Drivers for Dispatch Dropdown
 */
export async function getDrivers(): Promise<ActionResponse<ProfileRow[]>> {
  try {
    await ensureRole('admin')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'driver')
      .eq('driver_status', 'available')
      .order('full_name', { ascending: true })

    if (error) return { success: false, error: error.message }
    return { success: true, data: data || [] }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Job: Admin Only - Update booking status (Cancel/Complete).
 */
export async function updateBookingStatus(bookingId: string, status: 'cancelled' | 'completed'): Promise<ActionResponse<BookingRow>> {
  try {
    await ensureRole('admin')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single()

    if (error) return { success: false, error: 'Update Failed' }

    if (status === 'completed' || status === 'cancelled') {
      // Apollo Logistics: Revert chauffeur to AVAILABLE
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ driver_status: 'available' })
        .eq('id', data.driver_id)

      if (profileError) console.error('Auto-status available failed:', profileError)
    }

    revalidatePath('/admin')
    revalidatePath('/dashboard/driver')
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Job: Admin Only - Get All Bookings + Payload
 */
export async function getDispatchBoard(): Promise<ActionResponse<any[]>> {
  try {
    await ensureRole('admin')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('bookings')
      .select(`
                *,
                passenger:user_id(full_name, email, phone),
                driver:driver_id(full_name, phone)
            `)
      .order('created_at', { ascending: false })

    return { success: true, data: data || [] }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

/**
 * Job: Passenger Only - Cancel their OWN booking.
 * Logic: Can only cancel if status is 'pending' or 'assigned'.
 * If a driver was assigned, release them.
 */
export async function cancelMyBooking(bookingId: string): Promise<ActionResponse<BookingRow>> {
  try {
    const user = await ensureAuthenticated()
    const supabase = await createClient()

    // 1. Get current booking to check status and driver
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id) // Security: Must own the booking
      .single()

    if (fetchError || !booking) return { success: false, error: 'Booking not found.' }

    if (['completed', 'cancelled', 'en_route'].includes(booking.status)) {
      return { success: false, error: 'Cannot cancel a trip already in progress or completed.' }
    }

    // 2. Update status to cancelled
    const { data: updatedBookings, error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .select()

    if (updateError) {
      console.error('Cancellation Failed DB Error:', updateError);
      return { success: false, error: updateError.message }
    }

    if (!updatedBookings || updatedBookings.length === 0) {
      return { success: false, error: 'Permission Denied: Please enable UPDATE permissions for Users in Supabase RLS policies.' }
    }

    const updatedBooking = updatedBookings[0];

    // 3. Apollo Logistics: Release Chauffeur if assigned
    if (booking.driver_id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ driver_status: 'available' })
        .eq('id', booking.driver_id)

      if (profileError) console.error('Release driver failed:', profileError)
    }

    revalidatePath('/dashboard/passenger')
    revalidatePath('/admin')
    return { success: true, data: updatedBooking }

  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
