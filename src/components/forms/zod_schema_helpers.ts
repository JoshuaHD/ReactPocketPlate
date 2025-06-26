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

    for (const key in formMetaData) {
        const meta = formMetaData[key];
        let defaultValue = meta?.field?.defaultValue ?? meta?.defaultValue;
    
        if (typeof defaultValue === "function") {
          // call with (currentDataValue, fullData, fieldKey)
          defaultValues[key] = defaultValue(data?.[key], data, key);
          continue;
        }
    
        if (data && key in data) {
          // Important: include falsy values by using 'key in data'
          defaultValues[key] = data[key];
          continue;
        }
    
        if (defaultValue !== undefined) {
          defaultValues[key] = defaultValue;
          continue;
        }
    
        // Fallback by type inference — customize per your metadata or schema type info
        const type = meta?.field?.type ?? typeof data?.[key];
        switch (type) {
          case "string":
            defaultValues[key] = "";
            break;
          case "number":
            defaultValues[key] = 0;
            break;
          case "boolean":
            defaultValues[key] = false;
            break;
          case "object":
            defaultValues[key] = {}; // Or null, if you prefer
            break;
          case "array":
            defaultValues[key] = [];
            break;
          default:
            defaultValues[key] = null; // safest fallback
        }
      }
    
      return defaultValues;
};

