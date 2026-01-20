"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './about.module.css';

const AboutPage = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <Image 
          src="/hero-bg.png" 
          alt="Badagry Coast" 
          fill 
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroContent}>
            <span className={styles.subtitle}>EST. 2009</span>
            <h1 className={styles.title}>Our Story & Mission</h1>
            <p className={styles.tagline}>
              Bridging history and modern mobility in the cradle of Nigerian tourism.
            </p>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className={styles.container}>
            <div className={styles.storyGrid}>
                <div className={styles.textContent}>
                    <h2 className={styles.sectionTitle}>The Heart of Badagry</h2>
                    <p>
                        Tour Badagry was born out of a passion for our city's rich heritage and 
                        a realization that visitors deserved a premium, reliable way to explore it. 
                        Since 2009, we've evolved from a small local taxi service into the 
                        leading tourism and transportation partner in the region.
                    </p>
                    <p>
                        We believe that every journey tells a story. Whether it's a daily commute 
                        to a business hub or a solemn visit to the Slave Relics, we ensure 
                        that your travel is safe, dignified, and comfortable.
                    </p>
                </div>
                <div className={styles.imageGrid}>
                    <div className={styles.statBox}>
                        <span className={styles.statNum}>15k+</span>
                        <span className={styles.statLabel}>Happy Travelers</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statNum}>24/7</span>
                        <span className={styles.statLabel}>Service Availability</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.mvSection}>
        <div className={styles.container}>
            <div className={styles.mvGrid}>
                <div className={styles.mvCard}>
                    <div className={styles.cardIcon}>🎯</div>
                    <h3>Our Mission</h3>
                    <p>
                        To provide safe, reliable, and air-conditioned transportation that connects 
                        people to the historical and economic pulse of Badagry.
                    </p>
                </div>
                <div className={styles.mvCard}>
                    <div className={styles.cardIcon}>👁️</div>
                    <h3>Our Vision</h3>
                    <p>
                        To be the premier gateway to West African coastal tourism, recognized 
                        globally for excellence in hospitality and local discovery.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallery}>
        <div className={styles.container}>
            <h2 className={styles.sectionTitleCenter}>Captured Moments</h2>
            <div className={styles.imageGallery}>
                {/* Reusing existing public images for the gallery */}
                <div className={styles.galleryItem}>
                    <Image src="/first-storey.png" alt="First Storey Building" fill className={styles.img} />
                </div>
                <div className={styles.galleryItem}>
                    <Image src="/slave-relics.png" alt="Slave Relics" fill className={styles.img} />
                </div>
                <div className={styles.galleryItem}>
                    <Image src="/heritage-tours.webp" alt="Tour Route" fill className={styles.img} />
                </div>
                <div className={styles.galleryItem}>
                    <Image src="/taxi-services.jpeg" alt="Our Fleet" fill className={styles.img} />
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
            <div className={styles.ctaBox}>
                <h2>Ready to explore with us?</h2>
                <p>Book your ride or tour package today and experience Badagry like never before.</p>
                <Link href="/booking" className={styles.ctaBtn}>
                    Book a Ride Now
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
