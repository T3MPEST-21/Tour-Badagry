"use client";

import React from 'react';
import styles from './contact.module.css';

const ContactPage = () => {
    return (
        <div className={styles.contactPage}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Get In Touch</h1>
                    <p className={styles.lead}>
                        Have questions about our services or need a custom tour package? 
                        We're here to help you 24/7.
                    </p>
                </div>
            </header>

            <section className={styles.contactSection}>
                <div className={styles.container}>
                    <div className={styles.contactGrid}>
                        {/* Info Column */}
                        <div className={styles.infoCol}>
                            <div className={styles.infoCard}>
                                <div className={styles.icon}>📍</div>
                                <div>
                                    <h3>Our Office</h3>
                                    <p>12, Badagry Marina Road, Near Slave Port, Badagry, Lagos State.</p>
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.icon}>📞</div>
                                <div>
                                    <h3>Call Us</h3>
                                    <p>+234 800 TOUR BADAGRY</p>
                                    <p>+234 812 345 6789</p>
                                </div>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.icon}>✉️</div>
                                <div>
                                    <h3>Email Us</h3>
                                    <p>info@tourbadagry.com</p>
                                    <p>support@tourbadagry.com</p>
                                </div>
                            </div>
                            
                            <div className={styles.socials}>
                                <h3>Follow Our Journey</h3>
                                <div className={styles.socialIcons}>
                                    <span>FB</span>
                                    <span>IG</span>
                                    <span>TW</span>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className={styles.formCol}>
                            <form className={styles.contactForm}>
                                <div className={styles.inputGrid}>
                                    <div className={styles.inputGroup}>
                                        <label>Full Name</label>
                                        <input type="text" placeholder="John Doe" />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Email Address</label>
                                        <input type="email" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Subject</label>
                                    <select>
                                        <option>General Inquiry</option>
                                        <option>Custom Tour Package</option>
                                        <option>Fleet Partnership</option>
                                        <option>Customer Support</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Message</label>
                                    <textarea placeholder="Write your message here..."></textarea>
                                </div>
                                <button type="submit" className={styles.submitBtn}>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className={styles.mapSection}>
                <div className={styles.mapPlaceholder}>
                   <p>📍 Interactive Map of Badagry Marina Location</p>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
