"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Placeholder Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.iconWrapper}>
             {/* Simple car/pin icon placeholder */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 17H22V19H19V17ZM2 17H5V19H2V17ZM18.5 4H5.5C4.12 4 3 5.12 3 6.5V15.5H5.5V14H18.5V15.5H21V6.5C21 5.12 19.88 4 18.5 4ZM6.25 7.5H8.75V10H6.25V7.5ZM17.75 10H15.25V7.5H17.75V10Z" fill="white"/>
            </svg>
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
