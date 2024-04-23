import CSS from 'csstype';
import styles from "./styles.module.scss";
import Title from "@/app/components/title";
import Image from "next/image";

type Props = {
  title: string,
  subtitle?: string,
  image?: string
  imageType?: 'circle' | 'square' | 'rounded',
  backgroundImage?: string,
  wave?: boolean,
  styles?: object
}

function getStyles(props: Props): CSS.Properties {
  return {
    ...props.styles,
    backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
  }
}

export default function MainBanner(props: Props) {
  return <div className={`${styles.mainBanner}`} style={getStyles(props)}>
    <div className={`${styles.mainBannerWrapper}`}>
      <div className={`${styles.mainBannerContent} responsive-content`}>
        {props.image && 
        <div>
          <Image
            src={props.image}
            alt="Main photo"
            className={`${styles.image} ${styles[`image--${props.imageType}`] || styles[`image--square`]}`}
            width={200}
            height={200}
            priority
            objectFit="cover"
          />
        </div>
        }
        <Title title={props.title} variant="h1" class={`${styles.mainBannerTitle}`}></Title>
        {props.subtitle && <Title title={props.subtitle} variant="h3" light  class={`${styles.mainBannerSubTitle}`}></Title>}
      </div>
      <div className="waves">
        {props.wave && <div className={`${styles.wave} ${styles.wave1}`}></div>}
        {props.wave && <div className={`${styles.wave} ${styles.wave2}`}></div>}
        {props.wave && <div className={`${styles.wave} ${styles.wave3}`}></div>}
      </div>
    </div>
  </div>;
}