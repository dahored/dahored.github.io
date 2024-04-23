import GlobalConfig from "@/app/app.config";

type Props = {
    icon: string,
    size?: 'default' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge'
}

const defaultProps: Props = {
    icon: "icon",
    size: "default"
}

export default function Icon(props: Props = defaultProps) {
    return <i className={`
        ${GlobalConfig.theme}-icon bi bi-${props.icon} 
        ${GlobalConfig.theme}-icon__size--${props.size || defaultProps.size}
    `}></i>;
}