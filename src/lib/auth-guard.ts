import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/types/database.types'

type UserRole = Database['public']['Tables']['profiles']['Row']['role']

/**
 * Apollo Rule #3: One function = one job.
 * This guard handles authorization exclusively.
 */

/**
 * Ensures a user is authenticated.
 * If not, redirects to login. 
 */
export async function ensureAuthenticated() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login?error=Authentication Required')
    }

    return user
}

/**
 * Ensures a user has a specific role.
 * If not, throws a 403 error.
 */
export async function ensureRole(allowedRoles: UserRole | UserRole[]) {
    const user = await ensureAuthenticated()
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

    if (!profile || !roles.includes(profile.role)) {
        // We redirect instead of just throwing to keep the UI predictable
        redirect('/admin?error=Unauthorized Access')
    }

    return { user, profile }
}
