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
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Check Auth Status
    // Check Auth Status (Validation)
    const checkUser = async () => {
      // getUser() validates the token against the server. 
      // getSession() just checks local storage. 
      // We use getUser to prevent 'Zombie Sessions'.
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setUser(null);
      } else {
        setUser(user);
      }
    };
    checkUser();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        setLoggingOut(false);
      }
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

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    setShowLogoutConfirm(false);
    setLoggingOut(true);

    // 1. Force UI update immediately
    setUser(null);

    // 2. Clear Client-Side Session (LocalStorage)
    await supabase.auth.signOut();

    // Safety timeout: if server action redirect fails
    setTimeout(() => {
      if (window.location.pathname === '/') window.location.reload();
    }, 5000);

    // 3. Clear Server-Side Cookies & Redirect
    await signOut();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

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
            <li><Link href="/dashboard/passenger" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
          )}

          <li>
            {user ? (
              <button
                onClick={handleLogoutClick}
                className={styles.navLink}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                disabled={loggingOut}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            )}
          </li>

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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Disconnect Uplink?</h3>
            <p>Are you sure you want to log out of the Mission Control Center?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={cancelLogout}>Cancel</button>
              <button className={styles.confirmBtn} onClick={confirmLogout}>Disconnect</button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Blocking Overlay */}
      {loggingOut && (
        <div className={styles.blockingOverlay}>
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinnerCore}></div>
            <div className={styles.spinnerText}>
              <span>Terminating Session...</span>
              <small>Securing connection data.</small>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
