import { FormControl } from "@/components/ui/form.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.js"
import { ComponentProps } from "react"
import { z } from "zod"


type SelectOption = {
    value: string
    label: string | number | React.ReactNode
}

type SelectFormField = {
    options: SelectOption[],

    field?: {
        options?: SelectOption[],
    }
}

export function SelectFormField (props: SelectFormField & ComponentProps<typeof Select>) {

    return <Select 
        onValueChange={props.onChange as typeof props.onValueChange} 
        defaultValue={props.value}>
        <FormControl>
            <SelectTrigger>
                <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
        </FormControl>
        <SelectContent>
            {props.options.map((option: SelectOption, i: number) => {
            return <SelectItem key={i} value={option.value}>{option.label}</SelectItem>
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