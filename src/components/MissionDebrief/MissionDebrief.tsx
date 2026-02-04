"use client";

import React, { useState } from 'react';
import styles from './MissionDebrief.module.css';
import { createClient } from '@/lib/supabase/client';

interface MissionDebriefProps {
    bookingId: string;
    driverId: string;
    onClose: () => void;
    onSuccess: () => void;
}

const MissionDebrief: React.FC<MissionDebriefProps> = ({ bookingId, driverId, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const supabase = createClient();

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('ratings')
            .insert({
                booking_id: bookingId,
                rater_id: session.user.id,
                rated_id: driverId,
                rating: rating,
                comment: comment
            });

        setSubmitting(false);

        if (error) {
            console.error('Rating error:', error);
            alert('Failed to submit debrief. ' + error.message);
        } else {
            onSuccess();
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Mission Debrief</h2>
                <p className={styles.subtitle}>Rate your experience with the Apollo Fleet.</p>

                <div className={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`${styles.star} ${(hover || rating) >= star ? styles.active : ''}`}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    className={styles.textarea}
                    placeholder="Optimization Log (Optional comments...)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className={styles.actions}>
                    <button className={styles.skipBtn} onClick={onClose}>Skip</button>
                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={submitting || rating === 0}
                    >
                        {submitting ? 'Transmitting...' : 'Submit Report'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionDebrief;
