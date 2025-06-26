import { Checkbox } from "@/components/ui/checkbox.js";
import { ComponentProps } from "react";

const CheckboxComponent = {
    component: Checkbox,
    props: (field: ComponentProps<typeof Checkbox>) => {
        //field.checked = field.value
        field.onCheckedChange = field.onChange as any
        field.checked = field.value as unknown as boolean
        return field
    },
}

export default CheckboxComponent