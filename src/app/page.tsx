import styles from "@/app/assets/styles/modules/home.module.scss";
import MainBanner from "./modules/main-banner";

export default function Home() {
  return (
    <main className={styles.main}>
      <MainBanner 
        title="Diego Hernandez" 
        subtitle="Software Developer"
        image="/photos/385067776_6555082641211785_7765110881528106328_n.jpg"
        imageType="rounded"
        wave
      ></MainBanner>

       
    </main>
  );
}
