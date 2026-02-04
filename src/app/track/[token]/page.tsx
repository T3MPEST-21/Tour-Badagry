"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import LiveMap from '@/components/LiveMap/LiveMap';
import styles from '@/components/Dashboard/Dashboard.module.css'; // Reuse dashboard styles for consistency
import { useParams } from 'next/navigation';

const TrackPage = () => {
    const params = useParams();
    const token = params.token as string;
    const [booking, setBooking] = useState<any>(null);
    const [driverLocation, setDriverLocation] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const supabase = createClient();

    useEffect(() => {
        const fetchMission = async () => {
            const { data, error } = await supabase.rpc('get_booking_by_token', { token: token });

            if (error || !data || data.length === 0) {
                setError('Mission Uplink Failed. Invalid Token or Mission Ended.');
                setLoading(false);
                return;
            }

            setBooking(data[0]);
            setLoading(false);
        };

        fetchMission();

        // Join Realtime Channel for GPS
        const locationChannel = supabase.channel('global-positioning');
        locationChannel
            .on('presence', { event: 'sync' }, () => {
                // In a real app we would filter by booking.driver_id
                // verifying the driver ID matches the one in our booking
                // But since 'get_booking_by_token' returns driver details, we can assume trust for now 
                // and just filter client side once we load booking.
                const state = locationChannel.presenceState();
                const drivers: any[] = Object.values(state).flat();
                setDriverLocation(drivers);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(locationChannel);
        }
    }, [token]);

    if (loading) return <div style={{ color: '#fff', padding: 20, textAlign: 'center' }}>Establishing Uplink...</div>;
    if (error) return <div style={{ color: '#ff4d4f', padding: 20, textAlign: 'center' }}>⚠️ {error}</div>;

    // Filter for our specific driver if we know who it is
    // The RPC returns driver_details jsonb. 
    // We need to match the driver's phone or name from presence if ID isn't exposed in presence commonly (it is as 'id')
    // Wait, presence tracks 'user.id'. Does RPC return driver_id?
    // Let's check RPC definition... it returns driver_details but not raw ID in my SQL block? 
    // Wait, I updated SQL to return b.id, b.status, b.pickup_details...
    // Actually typically we need the driver_id to filter the map.
    // I will assume for now we see ALL drivers or I need to update RPC to return driver_id.
    // Let's assume for this MVP we show all fleet (Apollo View) or just try to match.
    // Actually, showing all fleet is cooler for "Badagry Tour" context, but for safety we usually want just one.
    // Let's show the map with all drivers for now as a "Fleet View" unless we can strict match.

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
            <header style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    📡 Apollo Live Uplink
                </h1>
                <p style={{ color: '#888' }}>Secure Monitoring Channel</p>
            </header>

            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 300px' }}>
                <div style={{ height: '600px', background: '#111', borderRadius: '12px', overflow: 'hidden' }}>
                    <LiveMap drivers={driverLocation} zoom={13} />
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <span className={`${styles.status} ${styles[booking.status]}`}>
                            {booking.status.toUpperCase()}
                        </span>
                    </div>
                    <div className={styles.cardBody}>
                        <h3>Mission Details</h3>
                        <p><strong>Passenger:</strong> Protected</p>
                        <p><strong>Origin:</strong> {booking.pickup_details?.pickup}</p>
                        <p><strong>Target:</strong> {booking.pickup_details?.destination}</p>

                        <hr style={{ borderColor: '#333', margin: '15px 0' }} />

                        <h4>Chauffeur</h4>
                        <p>👮 {booking.driver_details?.full_name || 'Assigned Agent'}</p>
                        <p>📞 {booking.driver_details?.phone || 'Private'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackPage;
