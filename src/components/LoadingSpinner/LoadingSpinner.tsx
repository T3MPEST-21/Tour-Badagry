"use client";

import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ minimal = false, size = 50 }: { minimal?: boolean, size?: number }) => {
    if (minimal) {
        return (
            <svg
                className={styles.spinner}
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: size, height: size }}
            >
                <circle
                    className={styles.path}
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                />
            </svg>
        );
    }

    return (
        <div className={styles.container}>
            <svg
                className={styles.spinner}
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: size, height: size }}
            >
                <circle
                    className={styles.path}
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    strokeWidth="4"
                />
            </svg>
            <span className={styles.text}>Synchronizing...</span>
        </div>
    );
};

export default LoadingSpinner;
