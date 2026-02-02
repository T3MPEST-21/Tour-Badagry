"use client";

import Hero from "@/components/Hero/Hero";
import CoreServices from "@/components/CoreServices/CoreServices";
import HeritageSection from "@/components/HeritageSection/HeritageSection";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "@/app/page.module.css";

const LandingView = () => {
    return (
        <main className={styles.main}>
            <Hero />
            <ScrollReveal animation="fade-up" delay={200}>
                <CoreServices />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={300}>
                <HeritageSection />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={400}>
                <WhyChooseUs />
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={500}>
                <Testimonials />
            </ScrollReveal>
            <Footer />
        </main>
    );
};

export default LandingView;
