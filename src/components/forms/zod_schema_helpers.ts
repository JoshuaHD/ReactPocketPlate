import { ComponentProps, ComponentType } from "react";
import { UseFormReturn } from "react-hook-form";
import { z, ZodType } from "zod";

export type ZodFormFieldMetaData<T> = {
    defaultValue?: T | ((data?: any, allData?: any, name?: any) => T),
    label?: string,
    className?: string,
    field?: Partial<HTMLInputElement> & any,
    component?: {
        component: ComponentType<any>,
        props?: (field: ComponentProps<ComponentType> & any, form?: UseFormReturn<any, any, undefined>) => ComponentProps<ComponentType>
    }
}

export type ZodFormMetadata<T> = {
    [key in keyof T]?: ZodFormFieldMetaData<T[key]>;
} & Record<string, any>; // <-- Allow additional dynamic fields

// Generic function that accepts any Zod schema and generates metadata with the same keys
export function createZodFormMetadata<T extends ZodType<any>>(_schema: T): ZodFormMetadata<z.infer<T>> {
    type SchemaType = z.infer<T>;

    const metadata: {
        [key in keyof SchemaType]?: ZodFormFieldMetaData<SchemaType[key]>;
    } = {} as any;

    return metadata;
}

export const getDefaultValuesFromZodFormMetadata = (formMetaData: ReturnType<typeof createZodFormMetadata>, data?: Record<string, any>) => {
    let defaultValues: Record<string, any> = {}; // Ensure it's an object with string keys

    for (let key in formMetaData) {
        const fieldKey = key // as keyof typeof notesCreateFormMetadata

        const defaultValue = formMetaData[fieldKey]?.field?.defaultValue ?? formMetaData[fieldKey]?.defaultValue

        if (defaultValue !== undefined) {
            if (typeof defaultValue === 'function') {
                defaultValues[fieldKey] = defaultValue(data?.[fieldKey], data, fieldKey)
            } else {
                defaultValues[fieldKey] = data?.[fieldKey] ?? defaultValue;
            }
        }
    }

    return defaultValues;
};

