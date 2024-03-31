import GlobalConfig from "@/app/app.config";

type Props = {
  children: any,
  variant?: string
}

const defaultProps: Props = {
  children: "Button",
  variant: "primary"
}

export default function Button(props: Props = defaultProps) {
  return <button className={`
    ${GlobalConfig.theme}-button 
    ${props.variant ? `${GlobalConfig.theme}-button--${props.variant}` : ""}
  `}>
    {props.children || "Button"}
  </button>;
}