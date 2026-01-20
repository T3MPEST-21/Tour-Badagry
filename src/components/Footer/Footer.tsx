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
                    <Link href="/about" className={styles.footerLink}>About Us</Link>
                    <Link href="/services" className={styles.footerLink}>Our Services</Link>
                    <Link href="/fleet" className={styles.footerLink}>Our Fleet</Link>
                    <Link href="/contact" className={styles.footerLink}>Contact Us</Link>
                </div>

                <div className={styles.linkCol}>
                    <h4 className={styles.colTitle}>Services</h4>
                    <Link href="/services#taxi" className={styles.footerLink}>City Taxi</Link>
                    <Link href="/services#airport" className={styles.footerLink}>Airport Transfer</Link>
                    <Link href="/tours" className={styles.footerLink}>Heritage Tours</Link>
                    <Link href="/services#charter" className={styles.footerLink}>Group Charter</Link>
                </div>
            </div>

            {/* Newsletter Column */}
            <div className={styles.newsletterCol}>
                <h4 className={styles.colTitle}>Stay Updated</h4>
                <p className={styles.newsletterText}>
                    Get travel tips, heritage stories, and exclusive discount codes.
                </p>
                <form className={styles.form}>
                    <input 
                        type="email" 
                        placeholder="Email address" 
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submitBtn}>
                        →
                    </button>
                </form>
            </div>
        </div>

        <div className={styles.divider}></div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
            <p className={styles.copyright}>
                © {new Date().getFullYear()} Badagry Tourism & Taxi Services. All rights reserved.
            </p>
            <div className={styles.legalLinks}>
                <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
                <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
                <Link href="/sitemap" className={styles.legalLink}>Sitemap</Link>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
