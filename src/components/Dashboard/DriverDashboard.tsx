"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateBookingStatus, ActionResponse } from '@/app/actions/booking';
import { updateDriverStatus } from '@/app/actions/profile';
import LiveMap from '../LiveMap/LiveMap';
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

            {/* 1. Status Segmented Control */}
            <div className={styles.segmentedControl}>
                <button
                    className={`${styles.segmentBtn} ${driverStatus === 'available' ? styles.active + ' ' + styles.online : ''}`}
                    onClick={() => handleStatusChange('available')}
                >
                    ONLINE
                </button>
                <button
                    className={`${styles.segmentBtn} ${driverStatus === 'busy' ? styles.active + ' ' + styles.busy : ''}`}
                    onClick={() => handleStatusChange('busy')}
                >
                    BUSY
                </button>
                <button
                    className={`${styles.segmentBtn} ${driverStatus === 'offline' ? styles.active + ' ' + styles.offline : ''}`}
                    onClick={() => handleStatusChange('offline')}
                >
                    OFFLINE
                </button>
            </div>

            {/* 2. Stats Row */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Earnings</span>
                    <span className={styles.statValue} style={{ color: '#38bdf8' }}>₦12,500</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Trips</span>
                    <span className={styles.statValue}>8</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statLabel}>Rating</span>
                    <span className={styles.statValue} style={{ color: '#fbbf24' }}>4.9 ★</span>
                </div>
            </div>

            {/* 3. Map Area (Visual Overlay) */}
            <div className={styles.driverMapContainer}>
                {/* Real Live Map if available, else visual placeholder */}
                {driverStatus !== 'offline' ? (
                    <LiveMap drivers={user ? [{ id: user.id, lat: 6.4, lng: 2.9, full_name: 'Me' }] : []} />
                ) : (
                    <div className={styles.mapPlaceholder} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                        <p>Map Offline</p>
                    </div>
                )}

                <div className={styles.mapFloatingSearch}>
                    <span style={{ color: 'var(--primary-neon)' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Find high demand areas..."
                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                        disabled
                    />
                </div>
            </div>

            {/* 4. Bottom Sheet (Requests) */}
            <div className={styles.bottomSheet}>
                <div className={styles.sheetHandle}></div>
                <div className={styles.sheetHeader}>
                    <span className={styles.sheetTitle}>Upcoming Requests</span>
                    <span className={styles.nearbyBadge}>{bookings.filter(b => b.status === 'assigned').length} NEARBY</span>
                </div>

                {bookings.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                        <p>No active requests in your sector.</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Stay online to receive mission data.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {bookings.map((booking) => (
                            <div key={booking.id} className={booking.status === 'assigned' ? styles.requestCard : styles.card}>
                                {booking.status === 'assigned' ? (
                                    /* New Request Card Style (Inspiration) */
                                    <>
                                        <div className={styles.reqHeader}>
                                            <div className={styles.passengerInfo}>
                                                <div className={styles.avatar}>
                                                    {booking.passenger?.full_name?.charAt(0) || 'G'}
                                                </div>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{booking.passenger?.full_name || 'Guest User'}</h3>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>4.8 Rating • {booking.service_type}</div>
                                                </div>
                                            </div>
                                            <div className={styles.distanceBadge}>5 min</div>
                                        </div>

                                        <div className={styles.timeline}>
                                            <div className={`${styles.stop} ${styles.pickup}`}>
                                                <div style={{ fontWeight: 600 }}>{booking.pickup_details.pickup}</div>
                                            </div>
                                            <div className={`${styles.stop} ${styles.dropoff}`}>
                                                <div style={{ fontWeight: 600 }}>{booking.pickup_details.destination}</div>
                                            </div>
                                        </div>

                                        <div className={styles.actionRow}>
                                            <button className={styles.btnDecline} onClick={() => { /* Alert decline */ alert('Declining request...') }}>Decline</button>
                                            <button className={styles.btnAccept} onClick={() => handleStatusChange('busy')}>Accept Request</button>
                                        </div>
                                    </>
                                ) : (
                                    /* Standard Card for Active Missions */
                                    <>
                                        <div className={styles.cardHeader}>
                                            <span className={`${styles.status} ${styles[booking.status]}`}>
                                                {booking.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className={styles.date}>MISSION #{booking.id.slice(0, 6)}</span>
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
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverDashboard;
