import { ComponentProps } from "react";
import { Textarea } from "./textarea.js";

type JsonTextArea = ComponentProps<"textarea">
export default function JsonTextArea(props: JsonTextArea) {
    return <Textarea {...props} />
}