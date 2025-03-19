import { Checkbox } from "@/components/ui/checkbox.js";
import { FormItem, FormControl, FormLabel, FormField } from "@/components/ui/form.js";
import { ComponentProps } from "react";
import { z } from "zod";

export const checkboxGroupFieldSchema = (min: number, max: number) => z.array(z.string()).min(min).max(max).refine((value) => value.some((item) => item), {
    message: "You have to select at least one option.",
})

type CheckboxGroupOption = {
    value: string
    label: string | number | React.ReactNode
    id: string
}

type CheckboxGroupFormField = {
    name: string,
    options: CheckboxGroupOption[],
    layout?: "row" | "col",

    field?: {
        options?: CheckboxGroupOption[],
        layout?: "row" | "col",

    }
} & ComponentProps<typeof Checkbox> & typeof Checkbox

const CheckboxGroupFormField = (props: CheckboxGroupFormField) => {
    const styles = {
        row: "grid grid-cols-2 sm:grid-cols-3 gap-y-4",
        col: "flex flex-col space-y-1",
    }

    const style: string = styles[props.layout as keyof typeof styles ?? "col"]

    return <div className={style}>{props.options.map((item) => (
        <FormField
            key={item.value}
            //control={form.control}
            name={props.name}
            render={({ field }) => {
                return (
                    <FormItem
                        key={item.value}
                        className="flex items-center space-y-0 space-x-1"
                    >
                        <FormControl>
                            <Checkbox
                                checked={field.value?.includes(item.value)}
                                value={item.value}
                                onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...field.value, item.value])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value: string) => value !== item.value
                                            )
                                        )
                                }}
                            />
                        </FormControl>
                        <FormLabel className="font-normal">
                            {item.label}
                        </FormLabel>
                    </FormItem>
                )
            }}
        />
    ))
    }</div>
}


const CheckboxGroupComponent = {
    component: CheckboxGroupFormField,
    props: (field: ComponentProps<typeof CheckboxGroupFormField> & CheckboxGroupFormField) => {
        return field
    }
}

export default CheckboxGroupComponent
