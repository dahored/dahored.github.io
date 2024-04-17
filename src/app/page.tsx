import styles from "@/app/assets/styles/modules/home.module.scss";
import MainBanner from "./modules/main-banner";

export default function Home() {
  return (
    <main className={styles.main}>
      <MainBanner name="Diego Hernandez" image=""></MainBanner>
    </main>
  );
}
