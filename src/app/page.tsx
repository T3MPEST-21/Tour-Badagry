import Hero from "@/components/Hero/Hero";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      {/* We will add the other sections (Core Expertise, Heritage Sites, etc.) below later */}
    </main>
  );
}
