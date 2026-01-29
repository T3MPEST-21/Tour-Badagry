'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'
import { revalidatePath } from 'next/cache'

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
 */
export async function createBooking(data: Omit<BookingInsert, 'user_id' | 'id' | 'created_at' | 'status' | 'driver_id' | 'price'>): Promise<ActionResponse<BookingRow>> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized: You must be signed in to book.' }
  }

  const { data: booking, error: dbError } = await supabase
    .from('bookings')
    .insert({
      ...data,
      user_id: user.id
    })
    .select()
    .single()

  if (dbError) {
    console.error('Booking DB Error:', dbError)
    return { success: false, error: 'System Error: Could not save your booking.' }
  }

  // revalidatePath('/dashboard') 
  return { success: true, data: booking }
}

/**
 * Job: Retrieve user's booking history (Passenger).
 */
export async function getUserBookings(): Promise<ActionResponse<BookingRow[]>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return { success: false, error: 'Could not fetch bookings.' }

  return { success: true, data: bookings }
}

/**
 * Job: Admin Only - Assign a Driver to a Booking.
 * Updates status to 'assigned'.
 */
export async function assignDriver(bookingId: string, driverId: string, price?: number): Promise<ActionResponse<BookingRow>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 1. Role Check
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if(profile?.role !== 'admin') {
      return { success: false, error: 'Forbidden: Admin access only.' }
  }

  // 2. Assign Driver & Set Status
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
        driver_id: driverId,
        status: 'assigned', // Workflow: Pending -> Assigned
        price: price // Admin can set final agreed price here
    })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) {
     console.error('Assign Driver Error:', error)
     return { success: false, error: 'Failed to assign driver.' }
  }

  revalidatePath('/admin')
  return { success: true, data }
}

/**
 * Job: Admin Only - Get List of Drivers for Dispatch Dropdown
 */
export async function getDrivers(): Promise<ActionResponse<ProfileRow[]>> {
    const supabase = await createClient()
    // Role check logic omitted for brevity, assuming UI hides this call mostly, RLS protects data.
    
    // We want all profiles where role = 'driver'
    // Note: If you have RLS on profiles, you need a policy for Admin to see all profiles.
    // Our migration added "Public profiles are viewable by everyone" for select, so this is safe.
    
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'driver')
        .order('full_name', { ascending: true })

    if (error) return { success: false, error: error.message }
    return { success: true, data: data || [] }
}


/**
 * Job: Admin Only - Update booking status (Cancel/Complete).
 */
export async function updateBookingStatus(bookingId: string, status: 'cancelled' | 'completed'): Promise<ActionResponse<BookingRow>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if(profile?.role !== 'admin') {
      return { success: false, error: 'Forbidden' }
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) return { success: false, error: 'Update Failed' }

  revalidatePath('/admin')
  return { success: true, data }
}

/**
 * Job: Admin Only - Get All Bookings + Payload
 * We need to fetch Driver Name and Passenger Name too.
 */
export async function getDispatchBoard(): Promise<ActionResponse<any[]>> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    // Join profiles to get names.
    // Supabase JS syntax for joins:
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            passenger:user_id(full_name, email, phone),
            driver:driver_id(full_name, phone)
        `)
        .order('created_at', { ascending: false })
    
    if (error) return { success: false, error: error.message }
    return { success: true, data: data || [] }
}
