import GlobalConfig from "@/app/app.config";
import React from "react";

type Props = {
    title: string,
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
    light?: boolean
}

const defaultProps: Props = {
    title: '',
    variant: 'h1'
}

export default function Title(props: Props = defaultProps) {
    return React.createElement(props.variant, { className: GlobalConfig.theme + '-title' + (props.light ? ' light' : '') }, props.title);
}