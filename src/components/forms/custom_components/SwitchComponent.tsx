import { Switch } from "@/components/ui/switch.js";
import { ComponentProps } from "react";

const SwitchComponent = {
    component: Switch,
    props: (field: ComponentProps<typeof Switch>) => {
        //field.checked = field.value
        field.onCheckedChange = field.onChange as any
        field.defaultChecked = field.value as unknown as boolean
        return field
    },
}

export default SwitchComponent