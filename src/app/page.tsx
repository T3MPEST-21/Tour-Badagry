import { createClient } from '@/lib/supabase/server';
import LandingView from '@/components/LandingView/LandingView';
import PassengerDashboard from '@/components/Dashboard/PassengerDashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import DriverDashboard from '@/components/Dashboard/DriverDashboard';

/**
 * Apollo Rule #1: What is this system supposed to do?
 * Root Route (/) is the entry point. It must be smart.
 */
export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, show the Landing Mission (Marketing)
  if (!user) {
    return <LandingView />;
  }

  // If logged in, detect role and show appropriate Dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (profile?.role === 'driver') {
    return <DriverDashboard />;
  }

  // Default to Passenger Dashboard for all other logged-in users
  return <PassengerDashboard />;
}
