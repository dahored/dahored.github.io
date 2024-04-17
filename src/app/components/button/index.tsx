import GlobalConfig from "@/app/app.config";

type Props = {
  children: any,
  variant?: 'primary' | 'secondary',
  size?: 'small' | 'medium' | 'large',
  onlyIcon?: boolean 
}

const defaultProps: Props = {
  children: "Button",
  variant: "primary",
  size: "medium",
  onlyIcon: false
}

export default function Button(props: Props = defaultProps) {
  return <button className={`
    ${GlobalConfig.theme}-button 
    ${props.variant ? `${GlobalConfig.theme}-button--${props.variant}` : ""}
    ${props.onlyIcon ? `${GlobalConfig.theme}-button--only-icon` : ""}
    ${GlobalConfig.theme}-button--${props.size}
  `}>
    {props.children || "Button"}
  </button>;
}