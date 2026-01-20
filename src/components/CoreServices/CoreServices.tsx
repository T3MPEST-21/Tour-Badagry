"use client";

import React from 'react';
import ServiceCard from '../ServiceCard/ServiceCard';
import styles from './CoreServices.module.css';

const CoreServices = () => {
    // Icons as simple SVG components for pixel perfection without external libs
    const taxiIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 16H9M16 16H15M5 16H4M5 16V13C5 12.4696 5.21071 11.9609 5.58579 11.5858C5.96086 11.2107 6.46957 11 7 11H17C17.5304 11 18.0391 11.2107 18.4142 11.5858C18.7893 11.9609 19 12.4696 19 13V16M5 16C5 17.1 5.9 18 7 18H17C18.1 18 19 17.1 19 16M19 16H20M9 20V22M15 20V22M7 11V6C7 5.46957 7.21071 4.96086 7.58579 4.58579C7.96086 4.21071 8.46957 4 9 4H15C15.5304 4 16.0391 4.21071 16.4142 4.58579C16.7893 4.96086 17 5.46957 17 6V11" />
        </svg>
    );

    const airportIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
        </svg>
    ); // Replacing generic send/plane with a distinct plane if preferred, usually a simple plane shape is best.
    
    // Better plane icon
    const planeIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <path d="M2 12h20 M13 12l5-8 M6 12l5-8 M9 16l4 8 M15 16l2 4 M6 12l-2 3 M22 12l-2 3" />
            {/* Simplified plane shape for clarity if the above is too abstract */}
           <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="none" stroke="none"/> {/* hidden filler */}
           <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" stroke="none"/>
        </svg>
    );

    // Let's use clean stroke icons to match the style
    const planeStrokeIcon = (
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 12L22 18L2 18L8 12M2 18L10 2L14 10" opacity="0"/> {/* reset path */}
            <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="currentColor" stroke="none"/>
         </svg>
    );

    const heritageIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="21" width="18" height="2" />
            <path d="M5 21V7L12 3L19 7V21" />
            <path d="M9 21V12H15V21" />
            <path d="M9 7V21" /> {/* Details lines */}
            <path d="M15 7V21" />
        </svg>
    );

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.subtitle}>OUR CORE EXPERTISE</span>
                    <div className={styles.headerContent}>
                        <h2 className={styles.headline}>
                            Tailored transportation and <br />
                            exploration solutions.
                        </h2>
                        <p className={styles.description}>
                            We combine local knowledge with modern fleet standards to ensure 
                            your journey is comfortable, safe, and rich in discovery.
                        </p>
                    </div>
                </div>

                <div className={styles.grid}>
                    <ServiceCard 
                        imageSrc="/taxi-services.jpeg"
                        title="Taxi Services"
                        description="Professional, air-conditioned rides within Badagry, Seme, Agbara, and Lagos metropolis. Available 24/7 for your convenience."
                        linkText="Learn more"
                        linkUrl="/services#taxi"
                    />
                    <ServiceCard 
                        imageSrc="/Airport-transfers.jpeg"
                        title="Airport Transfers"
                        description="Punctual and comfortable pickups and drop-offs from MMIA/MM2. We track your flight to ensure we're there when you land."
                        linkText="Book transfer"
                        linkUrl="/booking?type=airport"
                    />
                    <ServiceCard 
                        imageSrc="/heritage-tours.webp"
                        title="Heritage Tours"
                        description="Curated guided visits to historical landmarks including the First Storey Building and the Point of No Return."
                        linkText="Explore tours"
                        linkUrl="/tours"
                    />
                </div>
            </div>
        </section>
    );
};

export default CoreServices;
