"use client";

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Top Section */}
                <div className={styles.topSection}>
                    {/* Brand Column */}
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <span className={styles.logoIcon}>🚕</span>
                            <span className={styles.logoText}>Tour Badagry</span>
                        </div>
                        <p className={styles.tagline}>
                            Connecting the heart of Badagry to the West African coast through reliable transportation and deep cultural discovery.
                        </p>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialLink} aria-label="Facebook">FB</a>
                            <a href="#" className={styles.socialLink} aria-label="Instagram">IG</a>
                            <a href="#" className={styles.socialLink} aria-label="Twitter">TW</a>
                            <a href="#" className={styles.socialLink} aria-label="LinkedIn">LN</a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className={styles.linksGroup}>
                        <div className={styles.linkCol}>
                            <h4 className={styles.colTitle}>Company</h4>
                            <Link href="/" className={styles.footerLink}>Home</Link>
                            <Link href="/booking" className={styles.footerLink}>Book Now</Link>
                            <Link href="/login" className={styles.footerLink}>Login/Sign Up</Link>
                        </div>

                        <div className={styles.linkCol}>
                            <h4 className={styles.colTitle}>Services</h4>
                            <Link href="/booking?type=taxi" className={styles.footerLink}>City Taxi</Link>
                            <Link href="/booking?type=airport" className={styles.footerLink}>Airport Transfer</Link>
                            <Link href="/booking?type=tour" className={styles.footerLink}>Heritage Tours</Link>
                        </div>
                    </div>

                    {/* Newsletter Column */}
                    <div className={styles.newsletterCol}>
                        <h4 className={styles.colTitle}>Stay Updated</h4>
                        <p className={styles.newsletterText}>
                            Get travel tips and exclusive discount codes for your next Badagry mission.
                        </p>
                    </div>
                </div>

                <div className={styles.divider}></div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Badagry Tourism & Taxi Services. All rights reserved.
                    </p>
                    <div className={styles.legalLinks}>
                        <Link href="#" className={styles.legalLink}>Privacy Policy</Link>
                        <Link href="#" className={styles.legalLink}>Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
