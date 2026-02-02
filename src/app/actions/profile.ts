'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ensureRole } from '@/lib/auth-guard'

export type ActionResponse<T> = {
    success: boolean
    data?: T
    error?: string
}

/**
 * Job: Chauffeur Only - Toggle Duty Status (Available/Busy/Offline)
 */
export async function updateDriverStatus(status: 'available' | 'busy' | 'offline'): Promise<ActionResponse<any>> {
    try {
        const { user } = await ensureRole('driver')
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('profiles')
            .update({ driver_status: status })
            .eq('id', user.id)
            .select()
            .single()

        if (error) {
            console.error('Update Driver Status Error:', error)
            return { success: false, error: 'Failed to update status.' }
        }

        revalidatePath('/dashboard/driver')
        return { success: true, data }
    } catch (err: any) {
        return { success: false, error: err.message }
    }
}
