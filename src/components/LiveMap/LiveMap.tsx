'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import styles from './LiveMap.module.css';

// Dynamic import of the MapCore to avoid "window is not defined" error during SSR
const LiveMapCore = dynamic<LiveMapProps>(() => import('./LiveMapCore'), {
    ssr: false,
    loading: () => (
        <div className={styles.mapContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--primary-blue)', letterSpacing: '2px', fontSize: '0.8rem' }}>
                INITIALIZING NAVIGATION...
            </p>
        </div>  
    )
});

interface LiveMapProps {
    drivers?: Array<{
        id: string;
        full_name: string;
        lat: number;
        lng: number;
    }>;
    center?: [number, number];
    zoom?: number;
}

const LiveMap: React.FC<LiveMapProps> = (props) => {
    return (
        <div className={styles.mapContainer}>
            <LiveMapCore {...props} />
        </div>
    );
};

export default LiveMap;
