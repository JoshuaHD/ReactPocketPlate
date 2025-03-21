import FormBlockerToast from "@/components/ui/FormBlockerToast.js";
import { FieldError, FieldErrors, FieldErrorsImpl, Merge } from "react-hook-form";
import { toast } from "react-toastify";


export type OrphanError = {
    name: string,
    err: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined,
}

export const getOrphanErrors = (errors: FieldErrors, fields: string[]): OrphanError[] => {
    const errorkeys = Object.keys(errors)

    if (errorkeys.length < 1)
        return []

    const difference = (arr1: string[], arr2: string[]) => arr1.filter(item => !arr2.includes(item));

    const orphanErrors = difference(errorkeys, fields)

    return orphanErrors.map((e: keyof typeof errors) => ({ name: e, err: errors[e] }))
}

export const formBlocker = (isDirty: boolean) => () => {
    const DONT_BLOCK_NAVIGATION = false;
    const BLOCK_NAVIGATION = true;
  
    if (!isDirty)
        return DONT_BLOCK_NAVIGATION
  
    const shouldBlock = new Promise<boolean>((resolve) => {
        // Using a modal manager of your choice
        const notify = () => {
            toast.warn(FormBlockerToast, {
                autoClose: false, // Make sure the toast doesn't auto-close
                closeButton: false, // Remove the close button
                closeOnClick: false,
                onClose(reason) {
                    if(reason==="cancel")
                        return resolve(BLOCK_NAVIGATION)
                    
                    return resolve(DONT_BLOCK_NAVIGATION)
                },
            });
        };
  
        notify()
    })
  
    return shouldBlock
  }