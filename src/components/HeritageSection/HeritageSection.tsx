"use client";

import React, { useRef } from 'react';
import HeritageCard from '../HeritageCard/HeritageCard';
import styles from './HeritageSection.module.css';

const HeritageSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const heritageSites = [
    {
      id: 1,
      imageSrc: '/first-storey.png',
      title: 'First Storey Building',
      category: 'HISTORICAL LANDMARK',
      description: 'Built in 1845 by CMS missionaries, this iconic structure represents a major pillar of Nigerian history.',
      linkUrl: '/tours/first-storey'
    },
    {
      id: 2,
      imageSrc: '/hero-bg.png', // Placeholder for Point of No Return due to quota
      title: 'Point of No Return',
      category: 'CULTURAL ROUTE',
      description: 'Walk the historic path to the Gberefu Island coast, where thousands departed, never to return.',
      linkUrl: '/tours/point-of-no-return'
    },
    {
      id: 3,
      imageSrc: '/slave-relics.png',
      title: 'The Slave Relics Museum',
      category: 'HERITAGE SITE',
      description: 'A guided journey through preserved artifacts that tell the somber yet powerful story of the era.',
      linkUrl: '/tours/slave-museum'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
            <h2 className={styles.headline}>Must-Visit Heritage Sites</h2>
            
            <div className={styles.controls}>
                <button className={styles.navBtn} onClick={scrollLeft} aria-label="Scroll Left">
                    ←
                </button>
                <button className={styles.navBtn} onClick={scrollRight} aria-label="Scroll Right">
                    →
                </button>
            </div>
        </div>

        <div className={styles.carouselWrapper} ref={scrollRef}>
             {heritageSites.map((site) => (
                <div key={site.id} className={styles.cardWrapper}>
                    <HeritageCard 
                        imageSrc={site.imageSrc}
                        title={site.title}
                        category={site.category}
                        description={site.description}
                        linkUrl={site.linkUrl}
                    />
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
