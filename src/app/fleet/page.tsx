"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './fleet.module.css';

const FleetPage = () => {
    const vehicles = [
        {
            name: "Basic Sedan",
            category: "Standard",
            capacity: "4 passengers",
            luggage: "2 large bags",
            features: ["AC", "Bluetooth Audio", "Clean Interiors"],
            price: "₦5,000 / trip",
            image: "/taxi-services.jpeg" // Using existing for now
        },
        {
            name: "Executive SUV",
            category: "Premium",
            capacity: "6 passengers",
            luggage: "4 large bags",
            features: ["Leather Seats", "Extra Legroom", "USB Chargers"],
            price: "₦12,000 / trip",
            image: "/Airport-transfers.jpeg"
        },
        {
            name: "Tourism Mini-Bus",
            category: "Group",
            capacity: "14 passengers",
            luggage: "Ample Storage",
            features: ["Trained Tour Driver", "High Roof", "P.A System"],
            price: "₦25,000 / trip",
            image: "/heritage-tours.webp"
        }
    ];

    return (
        <div className={styles.fleetPage}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Our Premium Fleet</h1>
                    <p className={styles.lead}>
                        Meticulously maintained vehicles designed for comfort and safety.
                    </p>
                </div>
            </header>

            <section className={styles.fleetGrid}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        {vehicles.map((car, index) => (
                            <div key={index} className={styles.carCard}>
                                <div className={styles.imageWrapper}>
                                    <Image src={car.image} alt={car.name} fill className={styles.img} />
                                    <span className={styles.category}>{car.category}</span>
                                </div>
                                <div className={styles.details}>
                                    <h2 className={styles.carName}>{car.name}</h2>
                                    <div className={styles.specs}>
                                        <span>👥 {car.capacity}</span>
                                        <span>🧳 {car.luggage}</span>
                                    </div>
                                    <ul className={styles.features}>
                                        {car.features.map((f, i) => <li key={i}>{f}</li>)}
                                    </ul>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.price}>{car.price}</span>
                                        <Link href="/booking" className={styles.bookBtn}>Book Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FleetPage;
