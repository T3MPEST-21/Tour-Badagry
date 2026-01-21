"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './WhyChooseUs.module.css';

const WhyChooseUs = () => {
    // Icons for the value props
    const shieldIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
    );

    const carIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
            <circle cx="6.5" cy="16.5" r="2.5"/>
            <circle cx="16.5" cy="16.5" r="2.5"/>
        </svg>
    );

    const walletIcon = (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7h-7"/>
            <path d="M14 11h6"/>
            <path d="M19 15h1"/>
             <rect x="2" y="5" width="20" height="14" rx="2"/>
        </svg>
    );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Left Side: Image */}
        <div className={styles.imageColumn}>
             <div className={styles.imageWrapper}>
                 {/* Using placeholder for now due to quota */}
                <Image 
                    src="/white-sedan.png" 
                    alt="Premium Badagry Fleet" 
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                 <div className={styles.experienceBadge}>
                    <span className={styles.years}>15+</span>
                    <span className={styles.badgeText}>YEARS EXCELLENCE</span>
                </div>
             </div>
        </div>

        {/* Right Side: Content */}
        <div className={styles.contentColumn}>
            <span className={styles.subtitle}>WHY TRAVEL WITH US</span>
            <h2 className={styles.headline}>
                Safety, Reliability, and <br />
                Unmatched Local <br />
                Knowledge.
            </h2>

            <div className={styles.benefitsList}>
                <div className={styles.benefitItem}>
                    <div className={styles.iconBox}>{shieldIcon}</div>
                    <div className={styles.benefitContent}>
                        <h4 className={styles.benefitTitle}>Verified Drivers</h4>
                        <p className={styles.benefitDesc}>
                            All our drivers undergo rigorous background checks and regular professional training.
                        </p>
                    </div>
                </div>

                <div className={styles.benefitItem}>
                    <div className={styles.iconBox}>{carIcon}</div>
                    <div className={styles.benefitContent}>
                        <h4 className={styles.benefitTitle}>Modern AC Fleet</h4>
                        <p className={styles.benefitDesc}>
                            Travel in comfort. Our entire fleet is air-conditioned and meticulously maintained for safety.
                        </p>
                    </div>
                </div>

                <div className={styles.benefitItem}>
                    <div className={styles.iconBox}>{walletIcon}</div>
                    <div className={styles.benefitContent}>
                        <h4 className={styles.benefitTitle}>Transparent Pricing</h4>
                        <p className={styles.benefitDesc}>
                           No hidden charges. Fixed rates for airport transfers and competitive hourly rates for tours.
                        </p>
                    </div>
                </div>
            </div>

            <Link href="/booking" className={styles.ctaBtn}>
                Book Your Ride Now
            </Link>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
