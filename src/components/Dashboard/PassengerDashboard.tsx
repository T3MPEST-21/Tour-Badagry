"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import styles from './Dashboard.module.css';
import Link from 'next/link';
import LiveMap from '../LiveMap/LiveMap';
import { cancelMyBooking } from '@/app/actions/booking';
import MissionDebrief from '../MissionDebrief/MissionDebrief';

const PassengerDashboard = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [trackedDrivers, setTrackedDrivers] = useState<any[]>([]);
    const [debriefBooking, setDebriefBooking] = useState<any | null>(null);
    const supabase = createClient();

    const fetchBookings = async (userId: string) => {
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error) {
            setBookings(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchBookings(session.user.id);

                // Realtime Sync for this specific user's bookings
                const channel = supabase
                    .channel(`passenger-sync-${session.user.id}`)
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'bookings',
                            filter: `user_id=eq.${session.user.id}`
                        },
                        () => fetchBookings(session.user.id)
                    )
                    .subscribe();

                // Listen for Live GPS via Supabase Presence
                const locationChannel = supabase.channel('global-positioning');

                locationChannel
                    .on('presence', { event: 'sync' }, () => {
                        const state = locationChannel.presenceState();
                        const drivers = Object.values(state).flat();
                        setTrackedDrivers(drivers);
                    })
                    .subscribe();

                return () => {
                    supabase.removeChannel(channel);
                    supabase.removeChannel(locationChannel);
                };
            }
        };
        init();
    }, []);

    const handleCancel = async (bookingId: string) => {
        if (!confirm('Are you sure you want to abort this mission?')) return;

        const res = await cancelMyBooking(bookingId);
        if (res.success) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) fetchBookings(session.user.id);
        } else {
            alert(res.error || 'Failed to cancel.');
        }
    };

    const handleDebrief = (booking: any) => {
        setDebriefBooking(booking);
    };

    const handleDebriefSuccess = () => {
        setDebriefBooking(null);
        alert('Debrief received. Fleet optimization in progress.');
    };

    const handleShare = (shareToken: string) => {
        if (!shareToken) return;
        const url = `${window.location.origin}/track/${shareToken}`;
        navigator.clipboard.writeText(url);
        alert('📡 Uplink Secure. Tracking URL copied to clipboard.');
    };

    if (loading) return <div className={styles.loading}>Initializing Mission Control...</div>;

    // Filter drivers to show only the ones assigned to active bookings
    const activeDriverIds = bookings
        .filter((b: any) => ['assigned', 'driver_accepted', 'en_route'].includes(b.status))
        .map((b: any) => b.driver_id);

    const relevantDrivers = trackedDrivers.filter((d: any) => activeDriverIds.includes(d.id));

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>My Journeys</h1>
                <Link href="/booking" className={styles.bookBtn}>Book New Ride</Link>
            </header>

            {debriefBooking && (
                <MissionDebrief
                    bookingId={debriefBooking.id}
                    driverId={debriefBooking.driver_id}
                    onClose={() => setDebriefBooking(null)}
                    onSuccess={handleDebriefSuccess}
                />
            )}

            {relevantDrivers.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Live Mission Track</h2>
                    <LiveMap drivers={relevantDrivers} />
                </div>
            )}

            {bookings.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No active missions found. Ready for your first trip?</p>
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
                            </div>

                            <div className={styles.cardFooter} style={{ marginTop: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                {['pending', 'assigned', 'driver_accepted'].includes(booking.status) && (
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        className={styles.linkBtn}
                                        style={{ color: '#ff4d4f', fontSize: '0.85rem', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}
                                    >
                                        🛑 Cancel Request
                                    </button>
                                )}

                                {['assigned', 'driver_accepted', 'en_route'].includes(booking.status) && booking.share_token && (
                                    <button
                                        onClick={() => handleShare(booking.share_token)}
                                        className={styles.linkBtn}
                                        style={{ color: 'var(--primary-blue)', fontSize: '0.85rem', background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        📡 Share Uplink
                                    </button>
                                )}

                                {booking.status === 'completed' && (
                                    <button
                                        onClick={() => handleDebrief(booking)}
                                        className={styles.linkBtn}
                                        style={{ color: '#fbbf24', fontSize: '0.9rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        ⭐ Mission Debrief
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PassengerDashboard;
