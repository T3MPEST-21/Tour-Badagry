"use client";

import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    minimal?: boolean;
    size?: number;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ minimal = false, size = 40, className = '' }) => {
    // If minimal is purely requested, we can still show a smaller version of the logo
    // or the ring if strictly needed. But the user wants the "Flash" style.
    // Let's make the logo scale.

    return (
        <div className={`${styles.container} ${minimal ? styles.minimal : ''} ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                {/* 
                   Path 1: The "T" Top Bar 
                   Starts left, goes right.
                */}
                <path
                    d="M 15 20 H 85"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className={`${styles.path} ${styles.pathT}`}
                />

                {/* 
                   Path 2: The "B" Spine & Curves
                   Starts from T-center, goes down, loops B-top, loops B-bottom.
                   Continuous line for smooth drawing.
                */}
                <path
                    d="M 50 20 V 90 M 50 35 C 75 35 75 55 50 55 C 75 55 75 90 50 90"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${styles.path} ${styles.pathB}`}
                />
            </svg>
            {!minimal && <span className={styles.text}>Initialising Uplink...</span>}
        </div>
    );
};

export default LoadingSpinner;
