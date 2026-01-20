"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './blog.module.css';

const BlogPage = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    
    const categories = ['All', 'History', 'Food', 'Travel Tips', 'Culture'];
    
    const posts = [
        {
            title: "5 Must-Visit Historical Landmarks in Badagry",
            excerpt: "From the First Storey Building to the Agia Tree Monument, explore the relics of Nigeria's historical cradle.",
            category: "History",
            image: "/first-storey.png",
            date: "Oct 12, 2023"
        },
        {
            title: "Exploring the Local Flavors: Top Badagry Dishes",
            excerpt: "Discover the unique taste of Ajogun, coconut bread, and fresh lagoon fish in the heart of Badagry.",
            category: "Food",
            image: "/hero-bg.png", // Placeholder
            date: "Oct 05, 2023"
        },
        {
            title: "Safety Tips for First-Time Visitors to Badagry",
            excerpt: "Everything you need to know about navigating the city, interacting with locals, and staying safe.",
            category: "Travel Tips",
            image: "/taxi-services.jpeg",
            date: "Sep 28, 2023"
        },
        {
            title: "The Significance of the Point of No Return",
            excerpt: "A deep dive into the emotional and historical weight of Gberefu Island's most famous landmark.",
            category: "History",
            image: "/slave-relics.png",
            date: "Sep 20, 2023"
        }
    ];

    const filteredPosts = activeCategory === 'All' 
        ? posts 
        : posts.filter(post => post.category === activeCategory);

    return (
        <div className={styles.blogPage}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Badagry Travel Guide</h1>
                    <p className={styles.lead}>
                        Your ultimate companion for discovering the history, culture, and beauty of our city.
                    </p>
                </div>
            </header>

            <section className={styles.content}>
                <div className={styles.container}>
                    {/* Categories */}
                    <div className={styles.categoryFilter}>
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                className={`${styles.catBtn} ${activeCategory === cat ? styles.active : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Blog Grid */}
                    <div className={styles.blogGrid}>
                        {filteredPosts.map((post, index) => (
                            <article key={index} className={styles.postCard}>
                                <div className={styles.imageWrapper}>
                                    <Image src={post.image} alt={post.title} fill className={styles.img} />
                                    <span className={styles.postCategory}>{post.category}</span>
                                </div>
                                <div className={styles.postContent}>
                                    <span className={styles.postDate}>{post.date}</span>
                                    <h2 className={styles.postTitle}>{post.title}</h2>
                                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                                    <Link href={`/blog/${index}`} className={styles.readMore}>
                                        Read Article →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className={styles.newsletter}>
                <div className={styles.container}>
                    <div className={styles.newsletterBox}>
                        <h2>Stay Updated</h2>
                        <p>Get the latest travel tips and historical insights delivered to your inbox.</p>
                        <form className={styles.newsForm}>
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPage;
