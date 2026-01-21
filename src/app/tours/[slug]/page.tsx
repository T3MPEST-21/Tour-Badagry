"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './tourDetail.module.css';

const tourData = {
    'first-storey': {
        title: "The First Storey Building in Nigeria",
        category: "Historical Landmark",
        image: "/first-storey.png",
        year: "Built in 1845",
        location: "Badagry Marina, Lagos",
        description: "A profound monument to Nigerian history. This structure was where the Bible was first translated into Yoruba by Bishop Samuel Ajayi Crowther. It stands as a testament to the early missionary works in West Africa.",
        features: [
            "Original 1845 architecture",
            "Bishop Ajayi Crowther's Bible translation room",
            "The historic 'Miracle Well'",
            "Missionary relics and documents"
        ],
        timeline: [
            { year: "1842", event: "Foundation laid by Reverend Henry Townsend." },
            { year: "1845", event: "Completion of the structure." },
            { year: "1843", event: "Translation of the Holy Bible into Yoruba begins." }
        ]
    },
    'point-of-no-return': {
        title: "The Point of No Return",
        category: "Cultural Route",
        image: "/hero-bg.png",
        year: "Gberefu Island Coast",
        location: "Gberefu Island, Badagry",
        description: "A somber and powerful site on the coast of the Atlantic. This was the final departure point for thousands of enslaved Africans. The route through the island is a walk of reflection and history.",
        features: [
            "Path through Gberefu Island",
            "The Attenuation Well (Spirit Well)",
            "The Atlantic Ocean beach terminal",
            "Original slave route markers"
        ],
        timeline: [
            { year: "17th C", event: "Establishment of the slave port." },
            { year: "1851", event: "Treaty to abolish slave trade signed in Badagry." },
            { year: "Today", event: "A major destination for global heritage seekers." }
        ]
    },
    'slave-museum': {
        title: "The Slave Relics Museum",
        category: "Heritage Site",
        image: "/slave-relics.png",
        year: "Mobil Museum",
        location: "Badagry Marina",
        description: "A museum dedicated to preserving the artifacts and stories of the transatlantic slave trade. It houses original chains, shackles, and documents that provide a visceral connection to the past.",
        features: [
            "Original slave chains and shackles",
            "Historical records and trade documents",
            "Expert guided historical narrative",
            "Cannons and defensive artifacts"
        ],
        timeline: [
            { year: "1840", event: "Abass Family Seriki Williams era relics." },
            { year: "19th C", event: "Peak of the museum's artifact collection period." },
            { year: "2002", event: "Inauguration as a state heritage museum." }
        ]
    }
};

const TourDetailPage = ({ params }: { params: { slug: string } }) => {
    const tour = tourData[params.slug as keyof typeof tourData];

    if (!tour) {
        notFound();
    }

    return (
        <div className={styles.tourPage}>
            {/* Header / Hero */}
            <header className={styles.hero}>
                <Image src={tour.image} alt={tour.title} fill className={styles.heroImg} priority />
                <div className={styles.overlay}></div>
                <div className={styles.heroContent}>
                    <span className={styles.breadcrumb}>Tours / {tour.category}</span>
                    <h1 className={styles.title}>{tour.title}</h1>
                    <div className={styles.tagline}>
                        <span>📍 {tour.location}</span>
                        <span>📅 {tour.year}</span>
                    </div>
                </div>
            </header>

            <div className={styles.container}>
                <div className={styles.mainGrid}>
                    {/* Left: Content */}
                    <div className={styles.contentCol}>
                        <section className={styles.overview}>
                            <h2>Tour Overview</h2>
                            <p>{tour.description}</p>
                        </section>

                        <section className={styles.timelineSection}>
                            <h2>Historical Timeline</h2>
                            <div className={styles.timeline}>
                                {tour.timeline.map((item, i) => (
                                    <div key={i} className={styles.timelineItem}>
                                        <div className={styles.itemYear}>{item.year}</div>
                                        <div className={styles.itemEvent}>{item.event}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className={styles.featuresSection}>
                            <h2>What You’ll Experience</h2>
                            <ul className={styles.featuresGrid}>
                                {tour.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Right: Sidebar */}
                    <aside className={styles.sidebar}>
                        <div className={styles.bookingCard}>
                            <h3>Experience this Tour</h3>
                            <p>Premium air-conditioned transport and expert guides included.</p>
                            <div className={styles.price}>From ₦15,000 / person</div>
                            <Link href={`/booking?type=tour&slug=${params.slug}`} className={styles.bookBtn}>
                                Book This Tour
                            </Link>
                            <p className={styles.note}>* Includes pickup from anywhere in Badagry or Lagos.</p>
                        </div>
                        
                        <div className={styles.helpBox}>
                            <h4>Need Assistance?</h4>
                            <p>Contact our heritage specialists for group or educational bookings.</p>
                            <Link href="/contact" className={styles.contactLink}>Talk to an expert</Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TourDetailPage;
