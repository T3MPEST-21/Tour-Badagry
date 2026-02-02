'use client'

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { login, signup } from './actions';
import styles from './login.module.css';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

import { useFormStatus } from 'react-dom';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
);

function PasswordInput({ id, name, placeholder, className, required }: { id: string, name: string, placeholder: string, className?: string, required?: boolean }) {
    const [show, setShow] = useState(false);
    return (
        <div className={styles.passwordWrapper}>
            <input
                id={id}
                name={name}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                className={`${styles.inputField} ${styles.inputPassword} ${className || ''}`}
                required={required}
            />
            <button
                type="button"
                className={styles.visibilityToggle}
                onClick={() => setShow(!show)}
                title={show ? "Hide Password" : "Show Password"}
            >
                {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
        </div>
    );
}

function SubmitButton({ label, className }: { label: string, className?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`${className} ${pending ? styles.buttonLoading : ''}`}
            style={{ position: 'relative' }}
        >
            {pending ? (
                <div className={styles.buttonSpinnerOuter}>
                    <LoadingSpinner minimal size={24} />
                </div>
            ) : label}
        </button>
    );
}

function LoginContent() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    const handleSignupAction = async (formData: FormData) => {
        setClientError(null);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setClientError("Passwords do not match");
            return;
        }

        return signup(formData);
    };

    return (
        <div className={styles.loginPage}>
            <div className={`${styles.container} ${isSignUp ? styles.active : ''}`}>

                {/* Sign Up Form */}
                <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
                    <form action={handleSignupAction} className={styles.form}>
                        <h1>Create Mission</h1>
                        <p>Join the fleet and experience Badagry's coastal charm.</p>

                        {(error || clientError) && <div className={styles.errorAlert}>⚠️ {error || clientError}</div>}

                        <div className={styles.inputGroup}>
                            <input id="fullName" name="fullName" type="text" placeholder="Full Name" className={styles.inputField} required />
                            <input id="email-signup" name="email" type="email" placeholder="Email Address" className={styles.inputField} required />
                            <PasswordInput id="password-signup" name="password" placeholder="Choose Password" required />
                            <PasswordInput id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required />
                        </div>

                        <SubmitButton
                            label="Register Account"
                            className={`btn-primary ${styles.submitBtn}`}
                        />

                        <div className={styles.mobileToggle}>
                            <span>Already registered?</span>
                            <button type="button" onClick={() => setIsSignUp(false)} className={styles.mobileToggleBtn}>
                                Log In
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className={`${styles.formContainer} ${styles.signInContainer}`}>
                    <form action={login} className={styles.form}>
                        <h1>Account Ignition</h1>
                        <p>Welcome back, Captain. Enter your coordinates to proceed.</p>

                        {error && <div className={styles.errorAlert}>⚠️ {error}</div>}
                        {message && <div className={styles.messageAlert}>ℹ️ {message}</div>}

                        <div className={styles.inputGroup}>
                            <input id="email-signin" name="email" type="email" placeholder="Email Address" className={styles.inputField} required />
                            <PasswordInput id="password-signin" name="password" placeholder="Password" required />
                        </div>

                        <SubmitButton
                            label="Start Session"
                            className={`btn-primary ${styles.submitBtn}`}
                        />

                        <div className={styles.mobileToggle}>
                            <span>New to the mission?</span>
                            <button type="button" onClick={() => setIsSignUp(true)} className={styles.mobileToggleBtn}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>

                {/* Overlay Panel (The Slider) */}
                <div className={styles.overlayContainer}>
                    <div className={styles.overlay}>
                        <Image
                            src="/login-bg.png"
                            alt="Badagry Coastline"
                            fill
                            className={styles.bgImage}
                            priority
                        />
                        <div className={styles.visualOverlay}></div>

                        <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
                            <h2>Welcome Back!</h2>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className={styles.ghostBtn} onClick={() => setIsSignUp(false)}>
                                Sign In
                            </button>
                        </div>

                        <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
                            <h2>Hello, Friend!</h2>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className={styles.ghostBtn} onClick={() => setIsSignUp(true)}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoadingSpinner />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
