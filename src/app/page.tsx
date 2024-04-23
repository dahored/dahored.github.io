import styles from "@/app/assets/styles/modules/home.module.scss";
import MainBanner from "./modules/main-banner";
import SocialList from "./modules/social-list";

export default function Home() {
  return (
    <main className={styles.main}>
      <MainBanner 
        title="Diego Hernandez" 
        subtitle="Gamer and developer"
        image="/photos/385067776_6555082641211785_7765110881528106328_n.jpg"
        backgroundImage="https://as1.ftcdn.net/v2/jpg/04/08/07/96/1000_F_408079686_gvm6DdgTDRmOuv8YRdbRGAbE4UUWv05S.jpg"
        imageType="rounded"
        wave
      ></MainBanner>
      <SocialList 
        title="Social Media" 
        hoverBySocial
        showFollowers={false}
        urlFacebook="https://www.facebook.com/gaming/dahored"
        urlInstagram="https://www.instagram.com/daho.gaming/"
        urlYoutube="https://www.youtube.com/@dahogaming"
        urlTwitch="https://www.twitch.tv/dahored"
      ></SocialList>
    </main>
  );
}
