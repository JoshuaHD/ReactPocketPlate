import { ComponentProps } from "react"
import { Path, UseFormReturn } from "react-hook-form"
import { TypeOf, z } from "zod"
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "../ui/form.js"
import { Input } from "../ui/input.js"
import { ZodFormFieldMetaData } from "./zod_schema_helpers.js"

type ZodFormField<TSchema extends z.ZodObject<any>> = {
    form: UseFormReturn<any, any, undefined>;
    name: Path<TypeOf<TSchema>>;
    fieldMetaData: ZodFormFieldMetaData<string> | ZodFormFieldMetaData<boolean> | ZodFormFieldMetaData<Record<string, any>> | ZodFormFieldMetaData<string | Record<string, any>> | ZodFormFieldMetaData<File[] | undefined> | ZodFormFieldMetaData<object> | ZodFormFieldMetaData<any>
}

const fieldComponents: Record<string, any> = {
    string: Input,
};


export default function <TSchema extends z.ZodObject<any>>({ form, fieldMetaData, name }: ZodFormField<TSchema>) {
    let Component = fieldMetaData.component?.component ?? fieldComponents["string"]; // Default to Input

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => {
                const label = fieldMetaData.label ?? name
                const additionalProps = (typeof fieldMetaData.component?.props === 'function') ? fieldMetaData.component.props(field, form) : ((fieldMetaData.component?.component) ? field : {})
                const fieldProps: ComponentProps<typeof Component> = { ...fieldMetaData.field, ...additionalProps }

                if (fieldProps.type === "hidden")
                    return <><Component {...form.register(name)} {...fieldProps} /><FormMessage /></>

                return <FormItem className={`col-span-12 ${fieldMetaData.className ?? ""}`}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Component {...form.register(name)} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            }}
        />
    )
}