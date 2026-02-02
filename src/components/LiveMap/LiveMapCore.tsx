'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LiveMap.module.css';
import { Navigation } from 'lucide-react';

// Fix for default Leaflet marker icons not showing up in Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom Car Icon for Drivers using Lucide Navigation icon
const CarIcon = L.divIcon({
    className: styles.driverMarkerContainer,
    html: `<div class="${styles.driverMarkerRipple}"></div><div class="${styles.driverMarkerIcon}"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

// Component to handle auto-panning/zoom when coordinates change
function RecenterMap({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

interface LiveMapCoreProps {
    drivers?: Array<{
        id: string;
        full_name: string;
        lat: number;
        lng: number;
        status?: string;
    }>;
    center?: [number, number];
    zoom?: number;
}

const LiveMapCore: React.FC<LiveMapCoreProps> = ({
    drivers = [],
    center = [6.4357, 2.8794], // Badagry Default
    zoom = 13
}) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            zoomControl={false}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <RecenterMap center={center} zoom={zoom} />

            {drivers.map((driver) => (
                <Marker
                    key={driver.id}
                    position={[driver.lat, driver.lng]}
                    icon={CarIcon}
                >
                    <Popup>
                        <div className={styles.markerInfo}>
                            <h4>{driver.full_name}</h4>
                            <p>Status: <span style={{
                                color: driver.status === 'available' ? 'var(--whatsapp-green)' : '#ff4d4f',
                                fontWeight: 'bold',
                                textTransform: 'uppercase'
                            }}>{driver.status || 'BUSY'}</span></p>
                            <p>Lat: {driver.lat.toFixed(4)}, Lng: {driver.lng.toFixed(4)}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LiveMapCore;
