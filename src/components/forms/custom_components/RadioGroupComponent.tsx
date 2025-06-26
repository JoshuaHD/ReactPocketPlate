import { FormItem, FormControl, FormLabel } from "@/components/ui/form.js"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.js"
import { ComponentProps } from "react"
import { z } from "zod"

type RadioGroupOption = {
    value: string
    label: string | number | React.ReactNode
}

type RadioGroupFormField = {
    options: RadioGroupOption[],
    layout?: "row" | "col",

    field?: {
        options?: RadioGroupOption[],
        layout?: "row" | "col",
    }
}

const RadioGroupFormField = (props: RadioGroupFormField & ComponentProps<typeof RadioGroupPrimitive.Root>) => {
    const styles = {
        row: "grid grid-cols-2 sm:grid-cols-3 gap-y-4",
        col: "flex flex-col space-y-0",
    }

    const style: string = styles[props.layout as keyof typeof styles ?? "col"]

    return <RadioGroup
        onValueChange={props.onChange as typeof props.onValueChange}
        onChange={props.onChange}
        value={props.value}
        className={style}
    >
        {props.options.map((option: RadioGroupOption, i: number) => {
            return <FormItem key={i} className="flex items-center space-y-0 space-x-1">
                <FormControl>
                    <RadioGroupItem value={option.value} />
                </FormControl>
                <FormLabel className="font-normal">
                    {option.label}
                </FormLabel>
            </FormItem>
        })}
    </RadioGroup>
}


const RadioGroupComponent = {
    component: RadioGroupFormField,
    props: (field: ComponentProps<typeof RadioGroupFormField> & RadioGroupFormField) => {
        return field
    }
}

export default RadioGroupComponent


export const radioGroupFieldSchema = (required: boolean) => z.string().min((required) ? 1 : 0, { message: "Please select an option" })