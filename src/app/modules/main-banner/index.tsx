import styles from "./styles.module.scss";
import Title from "@/app/components/title";
import Image from "next/image";
import CSS from 'csstype';

type Props = {
  title: string,
  subtitle?: string,
  image?: string
  imageType?: 'circle' | 'square' | 'rounded',
  background?: string,
  wave?: boolean,
  styles?: object
}

function getMainBannerStyles(props: Props): CSS.Properties {
  return {
    ...props.styles,
  }
}

export default function MainBanner(props: Props) {
  return <div className={`${styles.mainBanner}`} style={getMainBannerStyles(props)}>
    <div className={`${styles.mainBannerWrapper}`}>
      <div className="responsive-content">
        {props.image && 
        <Image
            src={props.image}
            alt="Main photo"
            className={`${styles.image} ${styles[`image--${props.imageType}`] || styles[`image--square`]}`}
            width={200}
            height={200}
            priority
            objectFit="cover"
        />
        }
        <Title title={props.title} variant="h1"></Title>
        {props.subtitle && <Title title={props.subtitle} variant="h3" light></Title>}
      </div>
    </div>

    <div className="waves">
      {props.wave && <div className={`${styles.wave} ${styles.wave1}`}></div>}
      {props.wave && <div className={`${styles.wave} ${styles.wave2}`}></div>}
      {props.wave && <div className={`${styles.wave} ${styles.wave3}`}></div>}
    </div>
  </div>;
}