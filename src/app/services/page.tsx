"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './services.module.css';

const ServicesPage = () => {
    return (
        <div className={styles.servicesPage}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Our Professional Services</h1>
                    <p className={styles.lead}>
                        From seamless airport transfers to culturally immersive heritage tours, 
                        we provide world-class mobility solutions tailored for Badagry.
                    </p>
                </div>
            </header>

            {/* Service Detail 1: Taxi */}
            <section id="taxi" className={styles.serviceDetail}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.imageCol}>
                            <Image src="/taxi-services.jpeg" alt="Taxi Services" fill className={styles.img} />
                        </div>
                        <div className={styles.textCol}>
                            <span className={styles.tag}>24/7 Availability</span>
                            <h2>City Taxi & Private Hire</h2>
                            <p>
                                Navigate Badagry and its environs with ease. Our fleet of well-maintained 
                                sedans and SUVs are driven by professional, vetted drivers who 
                                know every corner of the city.
                            </p>
                            <ul className={styles.featureList}>
                                <li>Fully Air-Conditioned Vehicles</li>
                                <li>Clean and Sanitized Interiors</li>
                                <li>Professional and Courteous Drivers</li>
                                <li>Transparent Flat-Rate Pricing</li>
                            </ul>
                            <Link href="/booking?type=taxi" className={styles.bookLink}>
                                Book a City Ride →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Detail 2: Airport */}
            <section id="airport" className={`${styles.serviceDetail} ${styles.altBg}`}>
                <div className={styles.container}>
                    <div className={styles.gridInverse}>
                        <div className={styles.textCol}>
                            <span className={styles.tag}>Punctual & Stress-Free</span>
                            <h2>Airport Shuttle & Transfers</h2>
                            <p>
                                Start or end your journey on a high note. We provide reliable transfers 
                                between Badagry and Murtala Muhammed International Airport (MMIA/MM2).
                            </p>
                            <ul className={styles.featureList}>
                                <li>Real-time Flight Tracking</li>
                                <li>Personalized Meet & Greet Service</li>
                                <li>Wait-Time Buffer included</li>
                                <li>Spacious Luggage Capacity</li>
                            </ul>
                            <Link href="/booking?type=airport" className={styles.bookLink}>
                                Book Airport Transfer →
                            </Link>
                        </div>
                        <div className={styles.imageCol}>
                            <Image src="/Airport-transfers.jpeg" alt="Airport Shuttle" fill className={styles.img} />
                        </div>
                    </div>
                </div>
            </section>

             {/* Service Detail 3: Tours */}
             <section id="tours" className={styles.serviceDetail}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.imageCol}>
                            <Image src="/heritage-tours.webp" alt="Heritage Tours" fill className={styles.img} />
                        </div>
                        <div className={styles.textCol}>
                            <span className={styles.tag}>Discover History</span>
                            <h2>Heritage & Cultural Tours</h2>
                            <p>
                                Deep dive into the history of the "Point of No Return". 
                                Our guided tours offer a respectful and educational perspective 
                                on Badagry's unique role in global history.
                            </p>
                            <ul className={styles.featureList}>
                                <li>Licensed Heritage Guides</li>
                                <li>Curated Half-Day and Full-Day Routes</li>
                                <li>Visit First Storey Building & Mobil Museum</li>
                                <li>Group and Educational Discounts</li>
                            </ul>
                            <Link href="/booking?type=tour" className={styles.bookLink}>
                                Customize Your Tour →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
