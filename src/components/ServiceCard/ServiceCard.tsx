"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  icon?: React.ReactNode;
  imageSrc?: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, imageSrc, title, description, linkText, linkUrl }) => {
  return (
    <div className={styles.card}>
      {imageSrc ? (
        <div className={styles.imageWrapper}>
          <Image 
            src={imageSrc} 
            alt={title} 
            fill 
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
          />
        </div>
      ) : (
        <div className={styles.iconWrapper}>
          {icon}
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Link href={linkUrl} className={styles.link}>
          {linkText} <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
