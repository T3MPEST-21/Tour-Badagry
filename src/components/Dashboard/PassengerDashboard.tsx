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
                <div>
                    <h1>Welcome Back, Travelers</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Where would you like to go today?</p>
                </div>
            </header>

            {/* Search Bar (Floating Glow) */}
            <div className={styles.searchContainer}>
                <div className={styles.searchInner}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input type="text" placeholder="Where to?" className={styles.searchInput} disabled />
                    <button className={styles.mapBtn}>🗺️</button>
                </div>
            </div>

            <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--white)' }}>Quick Actions</h3>
            <div style={{ position: 'relative' }}>
                <div className={styles.quickActions}>
                    <Link href="/booking" className={styles.actionBtn}>
                        <div className={styles.actionIcon}>🚖</div>
                        <span>Book Taxi</span>
                    </Link>
                    <Link href="/booking?type=tour" className={styles.actionBtn}>
                        <div className={styles.actionIcon}>🗺️</div>
                        <span>Plan Tour</span>
                    </Link>
                    <Link href="/booking?type=airport" className={styles.actionBtn}>
                        <div className={styles.actionIcon}>✈️</div>
                        <span>Airport</span>
                    </Link>
                    <Link href="/booking?type=airport" className={styles.actionBtn}>
                        <div className={styles.actionIcon}>💬</div>
                        <span>Support</span>
                    </Link>
                    {/* Fake items to demonstrate scroll */}
                    <div className={styles.actionBtn} style={{ opacity: 0.5 }}>
                        <div className={styles.actionIcon}>🍱</div>
                        <span>Food</span>
                    </div>
                </div>
                {/* Scroll Hint Overlay */}
                <div className={styles.scrollHint}>
                    <span className={styles.chevron}>›</span>
                </div>
            </div>

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

            {/* Logic Separation */}
            {(() => {
                const upcomingTrip = bookings.find(b => ['pending', 'assigned', 'driver_accepted', 'en_route'].includes(b.status));
                const pastTrips = bookings.filter(b => !['pending', 'assigned', 'driver_accepted', 'en_route'].includes(b.status)).slice(0, 5);
                // Mock Saved Places (Empty for demo as per request)
                const savedPlaces: any[] = [];

                return (
                    <>
                        {/* Featured Upcoming Trip */}
                        {upcomingTrip && (
                            <div className={styles.featuredCard}>
                                <span className={styles.featuredTag}>Upcoming Mission</span>
                                <h2 className={styles.featuredTitle}>{upcomingTrip.service_type}</h2>
                                <div className={styles.featuredMeta}>
                                    <span>🗓️ {new Date(upcomingTrip.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>📍 {upcomingTrip.pickup_details.pickup.split(',')[0]}</span>
                                </div>
                                <button className={styles.featuredBtn} onClick={() => alert('Viewing Mission Details...')}>
                                    View Mission Details
                                </button>

                                {/* Quick visual indicator if map is tracking */}
                                {['assigned', 'driver_accepted', 'en_route'].includes(upcomingTrip.status) && (
                                    <div style={{ marginTop: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 5px #22c55e' }}></div>
                                        <span style={{ fontSize: '0.9rem' }}>Live Tracking Active</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Recent Trips Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Trips</h2>
                            <button style={{ background: 'none', border: 'none', color: 'var(--primary-neon)', cursor: 'pointer' }}>See all</button>
                        </div>

                        {/* Recent Trips List */}
                        <div className={styles.tripList}>
                            {pastTrips.length === 0 && !upcomingTrip ? (
                                <div className={styles.emptyState}>
                                    <p>Your journey log is empty. Start your first adventure.</p>
                                </div>
                            ) : (
                                pastTrips.map(trip => (
                                    <div key={trip.id} className={styles.tripRow}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className={styles.tripIcon}>🕒</div>
                                            <div className={styles.tripInfo}>
                                                <h4>{trip.pickup_details.destination.split(',')[0]}</h4>
                                                <p>{new Date(trip.created_at).toLocaleDateString()} • {trip.service_type}</p>
                                            </div>
                                        </div>
                                        <div className={styles.tripStatus}>
                                            {/* Mock price from trip data or fixed */}
                                            <span className={styles.tripPrice}>₦{Math.floor(Math.random() * 5000) + 2000}</span>
                                            <span className={styles.tripState}>{trip.status.replace('driver_accepted', 'Active').toUpperCase()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Saved Places */}
                        <div className={styles.savedSection}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--white)' }}>Saved Places</h3>

                            {savedPlaces.length > 0 ? (
                                <div className={styles.savedGrid}>
                                    {savedPlaces.map((place, i) => (
                                        <div key={i} className={styles.savedCard}>
                                            <div className={styles.savedIcon}>📍</div>
                                            <span className={styles.savedLabel}>{place.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.savedEmpty}>
                                    <h4>No Saved Locations</h4>
                                    <p>Save your favorite destinations for faster booking.</p>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <button className={styles.addSavedBtn} onClick={() => alert('Opening Map Selector...')}>📍 Select on Map</button>
                                        <button className={styles.addSavedBtn} onClick={() => alert('Opening Address Form...')}>✏️ Enter Address</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                );
            })()}
        </div>
    );
};

export default PassengerDashboard;
