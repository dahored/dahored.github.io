import GlobalConfig from "@/app/app.config";
import styles from "./styles.module.scss";
import Title from "@/app/components/title";

type Props = {
  // children: any
  name: string
}

export default function MainBanner(props: Props) {
  return <div className={`${styles.mainBanner}`}>
    <div className={`${styles.mainBannerWrapper}`}>
      <Title title={props.name} variant="h2" light></Title>
    </div>
  </div>;
}