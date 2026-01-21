"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './fleetDetail.module.css';

const vehicleData = {
    'basic-sedan': {
        name: "Basic Sedan",
        category: "Standard",
        image: "/taxi-services.jpeg",
        tagline: "Reliable efficiency for everyday city travel.",
        description: "Our basic sedan fleet consists of modern, fuel-efficient vehicles perfect for 1-4 passengers. Ideal for quick trips across Badagry, commute to Agbara, or a budget-friendly ride to Lagos.",
        specs: {
            capacity: "4 Passengers",
            luggage: "2 Large Bags",
            transmission: "Automatic",
            fuel: "Petrol"
        },
        features: [
            "Full Air Conditioning",
            "Bluetooth Audio System",
            "Professional Vetted Driver",
            "Child Seat Available on Request"
        ],
        pricing: "₦5,000 per trip (within Badagry)"
    },
    'executive-suv': {
        name: "Executive SUV",
        category: "Premium",
        image: "/Airport-transfers.jpeg",
        tagline: "Luxury and space for the discerning traveler.",
        description: "Command the road in our premium SUVs. Featuring leather interiors and extra legroom, these vehicles are the first choice for airport transfers, corporate travel, and small families seeking maximum comfort.",
        specs: {
            capacity: "6 Passengers",
            luggage: "4 Large Bags",
            transmission: "Automatic / 4WD",
            fuel: "Petrol/Diesel"
        },
        features: [
            "Premium Leather Interior",
            "Dual-Zone Climate Control",
            "On-board USB Charging",
            "Enhanced Safety Suspension"
        ],
        pricing: "₦12,000 per trip (Badagry - MMIA)"
    },
    'tourism-bus': {
        name: "Tourism Mini-Bus",
        category: "Group",
        image: "/heritage-tours.webp",
        tagline: "The ultimate choice for group discoveries.",
        description: "Our high-roof Hiace buses are specially outfitted for tourism. With panoramic windows and a reinforced suspension, they provide the best view and smoothest ride for school trips, church groups, and corporate tours.",
        specs: {
            capacity: "14 Passengers",
            luggage: "Special Roof Rack",
            transmission: "Manual/Auto",
            fuel: "Diesel"
        },
        features: [
            "Public Address (PA) System",
            "High-Roof for Standing Room",
            "Trained Historical Tour Driver",
            "First Aid Kit & Emergency Exit"
        ],
        pricing: "₦25,000 Day Rate (Tour Package)"
    }
};

const FleetDetailPage = ({ params }: { params: { slug: string } }) => {
    const vehicle = vehicleData[params.slug as keyof typeof vehicleData];

    if (!vehicle) {
        notFound();
    }

    return (
        <div className={styles.fleetPage}>
            <header className={styles.hero}>
                <Image src={vehicle.image} alt={vehicle.name} fill className={styles.heroImg} priority />
                <div className={styles.overlay}></div>
                <div className={styles.heroContent}>
                    <span className={styles.categoryBadge}>{vehicle.category} Class</span>
                    <h1 className={styles.title}>{vehicle.name}</h1>
                    <p className={styles.tagline}>{vehicle.tagline}</p>
                </div>
            </header>

            <div className={styles.container}>
                <div className={styles.contentGrid}>
                    <div className={styles.mainContent}>
                        <section className={styles.about}>
                            <h2>Vehicle Overview</h2>
                            <p>{vehicle.description}</p>
                        </section>

                        <section className={styles.specsSection}>
                            <h2>Technical Specifications</h2>
                            <div className={styles.specsGrid}>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Passenger Capacity</span>
                                    <span className={styles.specValue}>{vehicle.specs.capacity}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Luggage Capacity</span>
                                    <span className={styles.specValue}>{vehicle.specs.luggage}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Transmission</span>
                                    <span className={styles.specValue}>{vehicle.specs.transmission}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}>Fuel Type</span>
                                    <span className={styles.specValue}>{vehicle.specs.fuel}</span>
                                </div>
                            </div>
                        </section>

                        <section className={styles.featuresSection}>
                            <h2>Key Features</h2>
                            <ul className={styles.featuresList}>
                                {vehicle.features.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={styles.priceCard}>
                            <span className={styles.priceLabel}>Starting from</span>
                            <div className={styles.priceValue}>{vehicle.pricing.split(' ')[0]}</div>
                            <p className={styles.priceContext}>{vehicle.pricing.split(' ').slice(1).join(' ')}</p>
                            
                            <hr />
                            
                            <Link href={`/booking?type=fleet&vehicle=${params.slug}`} className={styles.bookBtn}>
                                Reserve this Vehicle
                            </Link>
                            <p className={styles.guarantee}>✨ Instant booking confirmation</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default FleetDetailPage;
