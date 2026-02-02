"use client";

import React, { useEffect, useState } from 'react';
import { getDispatchBoard, getDrivers, assignDriver, updateBookingStatus, ActionResponse } from '@/app/actions/booking';
import styles from './Dashboard.module.css';
import { createClient } from '@/lib/supabase/client';
import LiveMap from '../LiveMap/LiveMap';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showMap, setShowMap] = useState(false);
    const [trackedDrivers, setTrackedDrivers] = useState<any[]>([]);
    const supabase = createClient();

    const refreshData = async () => {
        const [bookRes, driveRes] = await Promise.all([getDispatchBoard(), getDrivers()]);
        if (bookRes.success) setBookings(bookRes.data || []);
        if (driveRes.success) setDrivers(driveRes.data || []);
        setLoading(false);
    };

    useEffect(() => {
        refreshData();

        const channel = supabase
            .channel('admin-dispatch-sync')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                () => refreshData()
            )
            .subscribe();

        // Listen for Fleet Live GPS via Supabase Presence
        const locationChannel = supabase.channel('global-positioning');

        locationChannel
            .on('presence', { event: 'sync' }, () => {
                const state = locationChannel.presenceState();
                const driversPositions = Object.values(state).flat();
                setTrackedDrivers(driversPositions);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            supabase.removeChannel(locationChannel);
        };
    }, []);

    const handleAssign = async (bookingId: string, formData: FormData) => {
        const driverId = formData.get('driverId') as string;
        if (!driverId) return;
        const res = await assignDriver(bookingId, driverId);
        if (res.success) refreshData();
    };

    const handleStatusUpdate = async (bookingId: string, status: 'completed' | 'cancelled') => {
        const res = await updateBookingStatus(bookingId, status);
        if (res.success) refreshData();
    };

    if (loading) return <div className={styles.loading}>Booting Dispatch Systems...</div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Dispatch Board</h1>
                <div className={styles.actions}>
                    <button
                        onClick={() => setShowMap(!showMap)}
                        className={styles.refreshBtn}
                        style={{ marginRight: '10px', background: showMap ? 'var(--primary-blue)' : 'transparent' }}
                    >
                        {showMap ? '📊 Hide Map' : '🗺️ Fleet View'}
                    </button>
                    <button onClick={refreshData} className={styles.refreshBtn}>🔄 Sync</button>
                </div>
            </header>

            {showMap && (
                <div style={{ marginBottom: '30px' }}>
                    <LiveMap drivers={trackedDrivers} />
                </div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Status/Driver</th>
                            <th>Trip</th>
                            <th>Passenger</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>
                                    <div className={`${styles.badge} ${styles[booking.status]}`}>
                                        {booking.status.replace('_', ' ').toUpperCase()}
                                    </div>
                                    {booking.driver && <div className={styles.driverName}>👮 {booking.driver.full_name}</div>}
                                </td>
                                <td>
                                    <strong>{booking.service_type.toUpperCase()}</strong>
                                    <div className={styles.route}>{booking.pickup_details.pickup} ➔ {booking.pickup_details.destination}</div>
                                </td>
                                <td>
                                    <div>{booking.passenger?.full_name || 'Guest'}</div>
                                    <div className={styles.subText}>{booking.passenger?.phone}</div>
                                </td>
                                <td>
                                    {booking.status === 'pending' && (
                                        <form action={(fd) => handleAssign(booking.id, fd)} className={styles.assignForm}>
                                            <select name="driverId" required className={styles.select}>
                                                <option value="">Select Driver</option>
                                                {drivers.map(d => (
                                                    <option key={d.id} value={d.id}>{d.full_name}</option>
                                                ))}
                                            </select>
                                            <button className={styles.btnAction}>Assign</button>
                                        </form>
                                    )}
                                    {booking.status === 'driver_accepted' && (
                                        <button onClick={() => handleStatusUpdate(booking.id, 'completed')} className={styles.btnComplete}>Complete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
