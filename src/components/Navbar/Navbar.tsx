"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/login/actions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Check Auth Status
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
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

        {/* Desktop/Mobile Menu */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
          <li><Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          {user && (
            <li><Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
          )}
          {user ? (
            <li>
              <button
                onClick={() => { signOut(); setIsMenuOpen(false); }}
                className={styles.navLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </li>
          ) : (
            <li><Link href="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Login</Link></li>
          )}

          <li className={styles.mobileOnly}>
            {!user && (
              <Link href="/booking" className={styles.bookBtnMobile} onClick={() => setIsMenuOpen(false)}>
                Book a Ride Now
              </Link>
            )}
          </li>
        </ul>

        <div className={styles.actions}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {!user && (
            <Link href="/booking" className={styles.bookBtn}>
              Book a Ride Now
            </Link>
          )}

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
