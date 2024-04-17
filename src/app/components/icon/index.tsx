import GlobalConfig from "@/app/app.config";

type Props = {
    icon: string
}

const defaultProps: Props = {
    icon: "icon"
}

export default function Icon(props: Props = defaultProps) {
    return <i className={`${GlobalConfig.theme}-icon bi bi-${props.icon}`}></i>;
}