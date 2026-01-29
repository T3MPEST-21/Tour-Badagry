
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { getDispatchBoard, getDrivers, assignDriver, updateBookingStatus } from '@/app/actions/booking';
import { redirect } from 'next/navigation';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        return <div className={styles.error}>403 - Dispatch Access Only</div>;
    }

    const { data: bookings } = await getDispatchBoard();
    const { data: drivers } = await getDrivers();

    return (
        <div className={styles.adminContainer}>
            <header className={styles.header}>
                <h1>Dispatch Board</h1>
                <p>Operator: {profile.full_name || 'Admin'}</p>
            </header>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Status/Driver</th>
                            <th>Trip Details</th>
                            <th>Passenger</th>
                            <th>Dispatch Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings?.map((booking) => (
                            <tr key={booking.id}>
                                <td>
                                    <div className={`${styles.badge} ${styles[booking.status]}`}>
                                        {booking.status.replace('_', ' ').toUpperCase()}
                                    </div>
                                    {booking.driver && (
                                        <div className={styles.driverInfo}>
                                            👮 {booking.driver.full_name}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <strong>{booking.service_type.toUpperCase()}</strong>
                                    <div className={styles.subText}>{booking.service_id}</div>
                                    <div className={styles.date}>{new Date(booking.date).toDateString()}</div>
                                    <div className={styles.route}>
                                        📍 {booking.pickup_details.pickup} <br/>
                                        🏁 {booking.pickup_details.destination}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.passenger}>
                                        {booking.passenger?.full_name || 'Guest'}
                                    </div>
                                    <a href={`tel:${booking.passenger?.phone}`} className={styles.contactLink}>
                                        📞 {booking.passenger?.phone}
                                    </a>
                                </td>
                                <td>
                                    {booking.status === 'pending' && (
                                        <form action={async (formData) => {
                                            'use server'
                                            const driverId = formData.get('driverId') as string;
                                            if(driverId) await assignDriver(booking.id, driverId);
                                        }} className={styles.assignForm}>
                                            <select name="driverId" required className={styles.driverSelect}>
                                                <option value="">Select Driver...</option>
                                                {drivers?.map(d => (
                                                    <option key={d.id} value={d.id}>{d.full_name} ({d.driver_status})</option>
                                                ))}
                                            </select>
                                            <button className={styles.btnAssign}>Assign</button>
                                        </form>
                                    )}
                                    
                                    {booking.status === 'assigned' && (
                                        <div className={styles.statusInfo}>Waiting for Driver Acceptance...</div>
                                    )}

                                    {booking.status === 'driver_accepted' && (
                                        <form action={async () => {
                                            'use server'
                                            await updateBookingStatus(booking.id, 'completed')
                                        }}>
                                            <button className={styles.btnComplete}>Mark Completed</button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
