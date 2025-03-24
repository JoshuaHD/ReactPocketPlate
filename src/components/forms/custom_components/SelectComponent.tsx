import { FormControl } from "@/components/ui/form.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.js"
import { ComponentProps } from "react"
import { z } from "zod"


type SelectOption = {
    value: string
    label: string | number | React.ReactNode
    className?: string
}

type SelectFormField = {
    options: SelectOption[],
    className?: string,
    onChange: () => void
    field?: {
        options?: SelectOption[],
        className?: string,
    }
}

export function SelectFormField(props: SelectFormField & ComponentProps<typeof Select>) {
    if (Array.isArray(props.value))
        throw new Error("Value for Select FormField needs to be a string, got an Array")

    return <Select
        onValueChange={props.onChange as typeof props.onValueChange}
        defaultValue={props.value}
        >
        <FormControl className={props.className ?? "w-full"}>
            <SelectTrigger>
                <SelectValue placeholder="Please select an option" />
            </SelectTrigger>
        </FormControl>
        <SelectContent>
            {props.options.map((option: SelectOption, i: number) => {
                return <SelectItem key={i} value={option.value} className={option.className}>{option.label}</SelectItem>
            })}
        </SelectContent>
    </Select>
}


const SelectComponent = {
    component: SelectFormField,
    props: (field: ComponentProps<typeof SelectFormField> & SelectFormField) => {
        return field
    }
}

export default SelectComponent


export const selectFieldSchema = (required: boolean) => z.string().min((required) ? 1 : 0, { message: "Please select an option" })