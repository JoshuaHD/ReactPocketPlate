import JsonTextArea from "@/components/ui/JsonTextArea.js";
import { z } from "zod";

export function getJsonTextArea (label: string, placeholder?: string) {
    return {
        defaultValue: (data: any) => (data) ? JSON.stringify(data, null, 2) : "",
        label,
        component: {
            component: JsonTextArea,
            props: (field: any) => {
                field.placeholder = placeholder ?? "JSON"

                return field
            }
        }
    }
}

export const jsonFieldSchema = z.union([
    z.record(z.any()),  // Object type
    z.string()           // String type
]).refine((val) => {
    if (typeof val === "string") {
        if (!val.trim())
            return true
        // Check if the string is parsable JSON
        try {
            JSON.parse(val);
            return true;  // Valid JSON string
        } catch {
            return false;  // Invalid JSON string
        }
    } else if (typeof val === "object") {
        // Ensure it's a plain object (not an array or null)
        // && val !== null && !Array.isArray(val)
        return true;
    }
    return false;  // If it's neither a valid JSON string nor a plain object
}, "Invalid JSON format"); // JSON type