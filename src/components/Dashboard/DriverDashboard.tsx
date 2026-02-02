"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateBookingStatus, ActionResponse } from '@/app/actions/booking';
import { updateDriverStatus } from '@/app/actions/profile';
import styles from './Dashboard.module.css';

const DriverDashboard = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [driverStatus, setDriverStatus] = useState<'available' | 'busy' | 'offline'>('offline');
    const supabase = createClient();

    const fetchAssignedBookings = async (userId: string) => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('driver_id', userId)
            .in('status', ['assigned', 'driver_accepted', 'en_route'])
            .order('created_at', { ascending: false });

        if (!error) {
            setBookings(data || []);
        }
    };

    const fetchDriverProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('driver_status')
            .eq('id', userId)
            .single();

        if (!error && data) {
            setDriverStatus(data.driver_status || 'offline');
        }
    };

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                await Promise.all([
                    fetchAssignedBookings(session.user.id),
                    fetchDriverProfile(session.user.id)
                ]);
                setLoading(false);

                // Realtime Sync for new assignments
                const channel = supabase
                    .channel(`driver-missions-${session.user.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'bookings',
                            filter: `driver_id=eq.${session.user.id}`
                        },
                        () => fetchAssignedBookings(session.user.id)
                    )
                    .subscribe();

                return () => {
                    supabase.removeChannel(channel);
                };
            }
        };
        init();
    }, []);

    // Effect for GPS Tracking based on status
    useEffect(() => {
        if (!user || driverStatus === 'offline') return;

        const locationChannel = supabase.channel('global-positioning', {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        let watchId: number;

        locationChannel.subscribe(async (status) => {
            if (status !== 'SUBSCRIBED') return;

            if ('geolocation' in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        locationChannel.track({
                            id: user.id,
                            full_name: user.user_metadata?.full_name || 'Fleet Chauffeur',
                            status: driverStatus, // Send status with GPS
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            online_at: new Date().toISOString(),
                        });
                    },
                    (error) => console.error('GPS Error:', error),
                    { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
                );
            }
        });

        return () => {
            supabase.removeChannel(locationChannel);
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [user, driverStatus]);

    const handleStatusChange = async (newStatus: 'available' | 'busy' | 'offline') => {
        setDriverStatus(newStatus);
        await updateDriverStatus(newStatus);
    };

    const handleComplete = async (bookingId: string) => {
        const res = await updateBookingStatus(bookingId, 'completed');
        if (res.success) {
            setBookings(prev => prev.filter(b => b.id !== bookingId));
        }
    };

    if (loading) return <div className={styles.loading}>Incoming Mission Data...</div>;

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <div>
                    <h1 style={{ marginBottom: '5px' }}>Captain's Log: Missions</h1>
                    <div className={styles.statusControl}>
                        <button
                            onClick={() => handleStatusChange('available')}
                            className={`${styles.statusToggle} ${driverStatus === 'available' ? styles.statusActive : ''}`}
                            data-status="available"
                        >
                            ● Available
                        </button>
                        <button
                            onClick={() => handleStatusChange('busy')}
                            className={`${styles.statusToggle} ${driverStatus === 'busy' ? styles.statusBusy : ''}`}
                            data-status="busy"
                        >
                            ● Busy
                        </button>
                        <button
                            onClick={() => handleStatusChange('offline')}
                            className={`${styles.statusToggle} ${driverStatus === 'offline' ? styles.statusOffline : ''}`}
                            data-status="offline"
                        >
                            ● Offline
                        </button>
                    </div>
                </div>
            </header>

            {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No active missions assigned. Standing by for dispatch...</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {bookings.map((booking) => (
                        <div key={booking.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={`${styles.status} ${styles[booking.status]}`}>
                                    {booking.status.replace('_', ' ').toUpperCase()}
                                </span>
                                <span className={styles.date}>{new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.cardBody}>
                                <h3>{booking.service_type.toUpperCase()}</h3>
                                <p>📍 {booking.pickup_details.pickup}</p>
                                <p>🏁 {booking.pickup_details.destination}</p>
                                <p>📞 {booking.contact_info.phone}</p>
                            </div>
                            <div className={styles.cardFooter} style={{ marginTop: '20px' }}>
                                <button
                                    onClick={() => handleComplete(booking.id)}
                                    className={styles.btnAction}
                                    style={{ width: '100%', background: 'var(--whatsapp-green)' }}
                                >
                                    Finish Mission
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;
