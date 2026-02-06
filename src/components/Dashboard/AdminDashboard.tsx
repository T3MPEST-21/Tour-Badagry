"use client";

import React, { useEffect, useState } from 'react';
import { getDispatchBoard, getDrivers, assignDriver, updateBookingStatus, ActionResponse } from '@/app/actions/booking';
import styles from './Dashboard.module.css';
import { createClient } from '@/lib/supabase/client';
import LiveMap from '../LiveMap/LiveMap';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

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

        // Realtime Sync via Sockets
        const channel = supabase
            .channel('admin-dispatch-sync')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'bookings' },
                () => refreshData()
            )
            .subscribe();

        // Apollo Heartbeat: Poll every 15s to ensure data consistency
        // This acts as a fallback for socket packet loss.
        const heartbeat = setInterval(() => {
            refreshData();
        }, 15000);

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
            clearInterval(heartbeat);
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

    if (loading) return <div className={styles.loading}> <LoadingSpinner /></div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1>Tour Badagry Admin</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Fleet Command</p>
                </div>
                <div>
                    <button className={styles.refreshBtn} onClick={refreshData}>🔔</button>
                    {/* Map Toggle logic can be added later if needed */}
                </div>
            </header>

            {/* 1. Admin Stats Row */}
            <div className={styles.adminStats}>
                <div className={styles.statCard} style={{ background: '#1e293b' }}>
                    <span className={styles.statLabel}>ACTIVE DRIVERS</span>
                    <span className={styles.statValue} style={{ color: '#fff' }}>{drivers.filter(d => d.driver_status !== 'offline').length}</span>
                    <span className={styles.statTrend} style={{ color: '#22c55e' }}>+5%</span>
                </div>
                <div className={styles.statCard} style={{ background: '#1e293b' }}>
                    <span className={styles.statLabel}>PENDING</span>
                    <span className={styles.statValue} style={{ color: '#fff' }}>{bookings.filter(b => b.status === 'pending').length}</span>
                    <span className={styles.statTrend} style={{ color: '#f43f5e' }}>-2%</span>
                </div>
                <div className={styles.statCard} style={{ background: '#1e293b' }}>
                    <span className={styles.statLabel}>REVENUE</span>
                    <span className={styles.statValue} style={{ color: '#fff' }}>₦150k</span>
                    <span className={styles.statTrend} style={{ color: '#22c55e' }}>+10%</span>
                </div>
            </div>

            {/* 2. Quick Actions */}
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--white)' }}>Quick Actions</h3>
            <div className={styles.adminQuickActions}>
                <div className={styles.adminActionCard} onClick={() => alert('Assign Driver Flow')}>
                    <div style={{ fontSize: '2rem', color: '#38bdf8' }}>👤+</div>
                    <span style={{ fontWeight: 600 }}>Assign Driver</span>
                </div>
                <div className={styles.adminActionCard} onClick={() => alert('Add Tour Flow')}>
                    <div style={{ fontSize: '2rem', color: '#38bdf8' }}>🗺️</div>
                    <span style={{ fontWeight: 600 }}>Add Tour</span>
                </div>
                <div className={styles.adminActionCard} onClick={() => alert('Broadcast Message')}>
                    <div style={{ fontSize: '2rem', color: '#38bdf8' }}>📢</div>
                    <span style={{ fontWeight: 600 }}>Broadcast</span>
                </div>
            </div>

            {/* 3. Fleet Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Fleet Status</h3>
                <span style={{ color: '#38bdf8', fontSize: '0.9rem', cursor: 'pointer' }}>View All</span>
            </div>

            <div className={styles.fleetList}>
                {drivers.slice(0, 3).map(driver => (
                    <div key={driver.id} className={styles.fleetCard}>
                        <div className={styles.carIconBox}>🚘</div>
                        <div className={styles.fleetInfo}>
                            <h4>{driver.full_name || 'Unknown Driver'}</h4>
                            <p>{driver.driver_status === 'busy' ? 'On Tour: Point of No Return' : 'Standby - Badagry Marina'}</p>
                        </div>
                        <span className={`${styles.fleetBadge} ${driver.driver_status === 'busy' ? styles.active : styles.available}`}>
                            {driver.driver_status === 'busy' ? 'ACTIVE' : 'AVAILABLE'}
                        </span>
                    </div>
                ))}
                {drivers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No drivers found.</p>}
            </div>

            {/* 4. Recent Bookings List */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '30px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Bookings</h3>
                <span style={{ color: '#38bdf8', fontSize: '0.9rem', cursor: 'pointer' }}>Today</span>
            </div>

            <div style={{ marginBottom: '80px' }}>
                {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className={styles.recentBookingRow}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={styles.userAvatar}>
                                {booking.passenger?.full_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{booking.passenger?.full_name || 'Guest User'}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.service_type}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className={`${styles.status} ${styles[booking.status]}`} style={{ display: 'inline-block', marginBottom: '4px', fontSize: '0.7rem' }}>
                                {booking.status.toUpperCase()}
                            </span>
                            <div style={{ fontWeight: 700 }}>₦{['tour', 'airport'].includes(booking.service_type) ? '12,500' : '5,500'}</div>
                        </div>
                    </div>
                ))}
                {bookings.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No bookings today.</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;
