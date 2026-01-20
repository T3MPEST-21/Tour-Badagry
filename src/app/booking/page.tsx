"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './booking.module.css';

const BookingForm = () => {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    
    // Form State
    const [formData, setFormData] = useState({
        pickup: '',
        destination: '',
        date: '',
        time: '',
        serviceType: 'taxi', 
        vehicleType: '',
        fullName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'airport') setFormData(prev => ({ ...prev, serviceType: 'airport' }));
        if (type === 'tour') setFormData(prev => ({ ...prev, serviceType: 'tour' }));
    }, [searchParams]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className={styles.bookingPage}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Book Your Journey</h1>
                    <div className={styles.progress}>
                        <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
                            <span className={styles.stepNum}>1</span>
                            <span className={styles.stepLabel}>Details</span>
                        </div>
                        <div className={styles.progressLine}></div>
                        <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
                            <span className={styles.stepNum}>2</span>
                            <span className={styles.stepLabel}>Vehicle</span>
                        </div>
                        <div className={styles.progressLine}></div>
                        <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
                            <span className={styles.stepNum}>3</span>
                            <span className={styles.stepLabel}>Contact</span>
                        </div>
                    </div>
                </header>

                <main className={styles.formContent}>
                    {step === 1 && (
                        <div className={styles.stepContainer}>
                            <h2 className={styles.stepTitle}>Ride Details</h2>
                            
                            <div className={styles.serviceSelector}>
                                <button 
                                    className={`${styles.serviceBtn} ${formData.serviceType === 'taxi' ? styles.active : ''}`}
                                    onClick={() => setFormData({...formData, serviceType: 'taxi'})}
                                >
                                    City Taxi
                                </button>
                                <button 
                                    className={`${styles.serviceBtn} ${formData.serviceType === 'airport' ? styles.active : ''}`}
                                    onClick={() => setFormData({...formData, serviceType: 'airport'})}
                                >
                                    Airport Transfer
                                </button>
                                <button 
                                    className={`${styles.serviceBtn} ${formData.serviceType === 'tour' ? styles.active : ''}`}
                                    onClick={() => setFormData({...formData, serviceType: 'tour'})}
                                >
                                    Heritage Tour
                                </button>
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>{formData.serviceType === 'airport' ? 'Pickup Point (Lagos/Airport)' : 'Pickup Location'}</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter pickup point"
                                        value={formData.pickup}
                                        onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>{formData.serviceType === 'airport' ? 'Destination (Badagry/Lagos)' : 'Destination'}</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter destination"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({...formData, destination: e.target.value})}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Preferred Date</label>
                                    <input 
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Preferred Time</label>
                                    <input 
                                        type="time" 
                                        value={formData.time}
                                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button className={styles.nextBtn} onClick={nextStep}>
                                Continue to Vehicle Selection
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.stepContainer}>
                            <h2 className={styles.stepTitle}>Select Your Vehicle</h2>
                            <div className={styles.vehicleGrid}>
                                <div 
                                    className={`${styles.vehicleCard} ${formData.vehicleType === 'Basic Sedan' ? styles.activeCard : ''}`} 
                                    onClick={() => setFormData({...formData, vehicleType: 'Basic Sedan'})}
                                >
                                    <div className={styles.vehiclePlaceholder}>🚗</div>
                                    <div className={styles.vehicleInfo}>
                                        <h3>Basic Sedan</h3>
                                        <p>Ideal for 1-4 passengers. Air-conditioned, standard luggage space.</p>
                                        <span className={styles.priceTag}>From ₦5,000</span>
                                    </div>
                                </div>
                                <div 
                                    className={`${styles.vehicleCard} ${formData.vehicleType === 'Executive SUV' ? styles.activeCard : ''}`} 
                                    onClick={() => setFormData({...formData, vehicleType: 'Executive SUV'})}
                                >
                                    <div className={styles.vehiclePlaceholder}>🚙</div>
                                    <div className={styles.vehicleInfo}>
                                        <h3>Executive SUV</h3>
                                        <p>Premium 6-seater. Extra luggage capacity and maximum comfort.</p>
                                        <span className={styles.priceTag}>From ₦12,000</span>
                                    </div>
                                </div>
                                <div 
                                    className={`${styles.vehicleCard} ${formData.vehicleType === 'Tourism Bus' ? styles.activeCard : ''}`} 
                                    onClick={() => setFormData({...formData, vehicleType: 'Tourism Bus'})}
                                >
                                    <div className={styles.vehiclePlaceholder}>🚐</div>
                                    <div className={styles.vehicleInfo}>
                                        <h3>Tourism Bus</h3>
                                        <p>Perfect for heritage tours and large groups. Up to 14 seats.</p>
                                        <span className={styles.priceTag}>From ₦25,000</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.backBtn} onClick={prevStep}>Back</button>
                                <button 
                                    className={styles.nextBtn} 
                                    onClick={nextStep}
                                    disabled={!formData.vehicleType}
                                >
                                    {formData.vehicleType ? 'Continue to Contact' : 'Select a Vehicle'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.stepContainer}>
                            <h2 className={styles.stepTitle}>Contact Information</h2>
                             <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        placeholder="+234 ..."
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                    <label>Additional Information (Optional)</label>
                                    <textarea 
                                        placeholder="Flight number, landmarks, or special requests..."
                                        className={styles.textarea}
                                    ></textarea>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.backBtn} onClick={prevStep}>Back</button>
                                <button 
                                    className={styles.submitBtn} 
                                    onClick={() => setStep(4)}
                                    disabled={!formData.fullName || !formData.phone}
                                >
                                    Send Booking Inquiry
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className={styles.successContainer}>
                            <div className={styles.successIcon}>✓</div>
                            <h2 className={styles.successTitle}>Booking Request Sent!</h2>
                            <p className={styles.successText}>
                                Thank you for choosing Tour Badagry. Our team will review your 
                                request and contact you via phone or email within 30 minutes 
                                to confirm availability and finalize the details.
                            </p>
                            <button className={styles.homeBtn} onClick={() => window.location.href = '/'}>
                                Return Home
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const BookingPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingForm />
        </Suspense>
    );
};

export default BookingPage;
