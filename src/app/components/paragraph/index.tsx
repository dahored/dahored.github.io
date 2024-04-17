import GlobalConfig from "@/app/app.config";

type Props = {
  children: any
}

const defaultProps: Props = {
  children: "",
}

export default function Paragraph(props: Props = defaultProps) {
  return <p className={`${GlobalConfig.theme}-paragraph`}>
    {props.children || ""}
  </p>;
}