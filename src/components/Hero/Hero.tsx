"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

const Hero = () => {
    // State for the booking widget
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [rideType, setRideType] = useState('Standard Taxi');

  return (
    <section className={styles.heroSection}>
      {/* Background Overlay */}
      <div className={styles.overlay}></div>
      
      {/* Content Container */}
      <div className={styles.container}>
        <div className={styles.content}>
            <div className={styles.badge}>PREMIUM TRAVEL SERVICES</div>
            <h1 className={styles.headline}>
                Reliable Taxi & Tourism <br />
                Services Across <span className={styles.highlight}>Badagry & Environs</span>
            </h1>
            <p className={styles.subheadline}>
                From seamless airport transfers to immersive heritage journeys, 
                experience the coastal heart of Lagos with local experts.
            </p>
            <div className={styles.ctaGroup}>
                <Link href="/booking" className={styles.primaryBtn}>
                    Book a Ride Now
                </Link>
                <Link href="/tours" className={styles.secondaryBtn}>
                    Explore Badagry
                </Link>
            </div>
        </div>

        {/* Floating Booking Widget */}
        <div className={styles.bookingWidget}>
            <div className={styles.formGroup}>
                <label className={styles.label}>PICKUP LOCATION</label>
                <div className={styles.inputWrapper}>
                     <span className={styles.icon}>📍</span>
                    <input 
                        type="text" 
                        placeholder="Where from?" 
                        className={styles.input}
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.formGroup}>
                <label className={styles.label}>DESTINATION</label>
                <div className={styles.inputWrapper}>
                    <span className={styles.icon}>🏁</span>
                    <input 
                        type="text" 
                        placeholder="Where to?" 
                        className={styles.input}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.formGroup}>
                <label className={styles.label}>RIDE TYPE</label>
                <div className={styles.inputWrapper}>
                    <span className={styles.icon}>🚖</span>
                    <select 
                        className={styles.select}
                        value={rideType}
                        onChange={(e) => setRideType(e.target.value)}
                    >
                        <option>Standard Taxi</option>
                        <option>Premium Sedan</option>
                        <option>Family SUV</option>
                        <option>Bus Charter</option>
                    </select>
                </div>
            </div>

            <button className={styles.checkBtn}>
                Check Availability
            </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
