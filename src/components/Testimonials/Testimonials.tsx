"use client";

import React from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    id: 1,
    name: "John Adeleke",
    role: "Business Traveler",
    text: "Tour Badagry has been my go-to for airport transfers. They are always on time, and the cars are spotless. Truly a premium experience in Badagry.",
    avatar: "👤"
  },
  {
    id: 2,
    name: "Sarah Thompson",
    role: "International Tourist",
    text: "The Heritage Tour was beyond my expectations. Our guide was knowledgeable and passionate. The private sedan made the heat of the day very manageable!",
    avatar: "👤"
  },
  {
    id: 3,
    name: "Emeka Okafor",
    role: "Local Executive",
    text: "Finding a reliable ride in Agbara/Badagry used to be a challenge. T.B. provides the professional service that executives actually need.",
    avatar: "👤"
  }
];

const Testimonials = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Our Guest Diaries</span>
          <h2 className={styles.title}>What Travelers Say About Us</h2>
        </div>

        <div className={styles.grid}>
          {testimonials.map((item) => (
            <div key={item.id} className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>“</div>
              <p className={styles.text}>{item.text}</p>
              <div className={styles.footer}>
                <div className={styles.avatar}>{item.avatar}</div>
                <div className={styles.info}>
                  <h4 className={styles.name}>{item.name}</h4>
                  <span className={styles.role}>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
