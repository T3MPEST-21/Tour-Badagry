"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Placeholder Logo */}
        {/* Brand Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoImageWrapper}>
            <Image 
              src="/logo.png" 
              alt="Tour Badagry Logo" 
              width={40} 
              height={40}
              className={styles.logoImage}
            />
          </div>
          <span className={styles.logoText}>Tour Badagry</span>
        </Link>

        {/* Desktop Menu */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <li><Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link href="/services" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Services</Link></li>
          <li><Link href="/fleet" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Fleet</Link></li>
          <li><Link href="/about" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
          <li><Link href="/contact" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li className={styles.mobileOnly}>
            <Link href="/booking" className={styles.bookBtnMobile} onClick={() => setIsMenuOpen(false)}>
              Book a Ride Now
            </Link>
          </li>
        </ul>

        <div className={styles.actions}>
          <Link href="/booking" className={styles.bookBtn}>
            Book a Ride Now
          </Link>
          
          {/* Hamburger Menu Icon */}
          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
            <span className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></span>
            <span className={`${styles.bar} ${isMenuOpen ? styles.open : ''}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
