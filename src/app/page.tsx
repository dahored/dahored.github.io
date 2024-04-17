import styles from "@/app/assets/styles/modules/home.module.scss";
import MainBanner from "./modules/main-banner";

export default function Home() {
  return (
    <main className={styles.main}>
      <MainBanner 
        title="Diego Hernandez" 
        subtitle="Software Developer"
        image="/photos/385067776_6555082641211785_7765110881528106328_n.jpg"
        backgroundImage="https://as1.ftcdn.net/v2/jpg/04/08/07/96/1000_F_408079686_gvm6DdgTDRmOuv8YRdbRGAbE4UUWv05S.jpg"
        imageType="rounded"
        wave
      ></MainBanner>
    </main>
  );
}
