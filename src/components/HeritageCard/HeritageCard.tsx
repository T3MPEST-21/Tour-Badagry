"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeritageCard.module.css';

interface HeritageCardProps {
  imageSrc: string;
  title: string;
  category: string;
  description: string;
  linkUrl: string;
}

const HeritageCard: React.FC<HeritageCardProps> = ({ imageSrc, title, category, description, linkUrl }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image 
          src={imageSrc} 
          alt={title} 
          fill 
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={styles.categoryBadge}>{category}</div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Link href={linkUrl} className={styles.button}>
          View Tour Details
        </Link>
      </div>
    </div>
  );
};

export default HeritageCard;
