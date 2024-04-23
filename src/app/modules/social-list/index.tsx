'use client';

import CSS from 'csstype';
import styles from "./styles.module.scss";
import Title from "@/app/components/title";
import Icon from "@/app/components/icon";

type Props = {
  title?: string,
  subtitle?: string,
  backgroundImage?: string,
  styles?: object,
  hoverBySocial?: boolean,
  showFollowers?: boolean,
  //social
  urlFacebook?: string,
  urlInstagram?: string,
  urlYoutube?: string,
  urlTwitch?: string,
}

function getStyles(props: Props): CSS.Properties {
  return {
    ...props.styles,
    backgroundImage: props.backgroundImage ? `url(${props.backgroundImage})` : 'none',
  }
}

export default function SocialList(props: Props) {

  function goToSocial(url: string | undefined) {
    window.open(url, '_blank');
  }
  
  return <div className={`${styles.socialList}`} style={getStyles(props)}>
    <div className={`${styles.socialListWrapper}`}>
      <div className={`${styles.socialListContent} responsive-content`}>
        {props.title && <Title title={props.title} variant="h2" class={`${styles.socialListTitle}`}></Title>}
        {props.subtitle && <Title title={props.subtitle} variant="h3" light class={`${styles.socialListSubTitle}`}></Title>}

        <div className={`${styles.socialListItems}`}>

          {props.urlYoutube &&
          <div className={`${styles.socialListItem} ${props.hoverBySocial ? 'social--youtube': ''}`} onClick={() => goToSocial(props.urlYoutube)}>
            <div className={`${styles.socialListItemContent}`}>
              <div className={`${styles.socialListItemIcon} color--youtube`}>
                <Icon icon="youtube" size='xxlarge' />
              </div>
              <div className={`${styles.socialListItemText}`}>
                <Title title="Youtube" variant="h5" class={`${styles.socialListItemTitle}`}></Title>
                {props.showFollowers && <Title title="100000" variant="h3" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {props.showFollowers && <Title title="Subscribers" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {!props.showFollowers && <Title title="Subscribe on Youtube" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
              </div>
            </div>
          </div>
          }
          {props.urlTwitch &&
          <div className={`${styles.socialListItem} ${props.hoverBySocial ? 'social--twitch': ''}`} onClick={() => goToSocial(props.urlTwitch)}>
            <div className={`${styles.socialListItemContent}`}>
              <div className={`${styles.socialListItemIcon} color--twitch`}>
                <Icon icon="twitch" size='xxlarge' />
              </div>
              <div className={`${styles.socialListItemText}`}>
                <Title title="Twitch" variant="h5" class={`${styles.socialListItemTitle}`}></Title>
                {props.showFollowers && <Title title="100000" variant="h3" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {props.showFollowers && <Title title="Followers" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {!props.showFollowers && <Title title="Follow us on Twitch" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
              </div>
            </div>
          </div>
          }

          {props.urlInstagram &&
          <div className={`${styles.socialListItem} ${props.hoverBySocial ? 'social--instagram': ''}`} onClick={() => goToSocial(props.urlInstagram)}>
            <div className={`${styles.socialListItemContent}`}>
              <div className={`${styles.socialListItemIcon} color--instagram`}>
                <Icon icon="instagram" size='xxlarge' />
              </div>
              <div className={`${styles.socialListItemText}`}>
                <Title title="Instagram" variant="h5" class={`${styles.socialListItemTitle}`}></Title>
                {props.showFollowers && <Title title="100000" variant="h3" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {props.showFollowers && <Title title="Followers" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {!props.showFollowers && <Title title="Follow us on Instagram" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
              </div>
            </div>
          </div>
          }

          {props.urlFacebook &&
          <div className={`${styles.socialListItem} ${props.hoverBySocial ? 'social--facebook': ''}`} onClick={() => goToSocial(props.urlFacebook)}>
            <div className={`${styles.socialListItemContent}`}>
              <div className={`${styles.socialListItemIcon} color--facebook`}>
                <Icon icon="facebook" size='xxlarge' />
              </div>
              <div className={`${styles.socialListItemText}`}>
                <Title title="Facebook" variant="h5" class={`${styles.socialListItemTitle}`}></Title>
                {props.showFollowers && <Title title="100000" variant="h3" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {props.showFollowers && <Title title="Followers" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
                {!props.showFollowers && <Title title="Follow us on Facebook" variant="h6" light class={`${styles.socialListItemSubTitle}`}></Title>}
              </div>
            </div>
          </div>
          }

        </div>
      </div>
    </div>
  </div>;
}