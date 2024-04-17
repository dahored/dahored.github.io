import CSS from 'csstype';
import styles from "./styles.module.scss";
import Title from "@/app/components/title";
import Image from "next/image";
import Button from "@/app/components/button";
import Icon from "@/app/components/icon";

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
      <div className={`${styles.mainBannerContent} responsive-content`}>
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
      <div className="waves">
        {props.wave && <div className={`${styles.wave} ${styles.wave1}`}></div>}
        {props.wave && <div className={`${styles.wave} ${styles.wave2}`}></div>}
        {props.wave && <div className={`${styles.wave} ${styles.wave3}`}></div>}
      </div>
    </div>
    <div className={`${styles.mainBannerExtraContent}`}>
      <div className={`responsive-content`}>
        <div className={`${styles.mainBannerCard}`}>
          <Button onlyIcon size='large'>
              <Icon icon="facebook"/>
          </Button>
          <Button onlyIcon size='large'>
              <Icon icon="instagram"/>
          </Button>
          <Button onlyIcon size='large'>
              <Icon icon="youtube"/>
          </Button>
          <Button onlyIcon size='large'>
              <Icon icon="twitch"/>
          </Button>
        </div>
      </div>
    </div>
  </div>;
}