import Hero from "@/components/Hero/Hero";
import CoreServices from "@/components/CoreServices/CoreServices";
import HeritageSection from "@/components/HeritageSection/HeritageSection";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Footer from "@/components/Footer/Footer";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <CoreServices />
      <HeritageSection />
      <WhyChooseUs />
      {/* Testimonials section will be added here later */}
      <Footer />
    </main>
  );
}
