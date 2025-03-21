import { FieldError, FieldErrors, FieldErrorsImpl, Merge } from "react-hook-form";


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
    return (
        isDirty &&
        !window.confirm("You have unsaved changes. \nAre you sure you want to leave? \nClick OK to discard changes or Cancel to stay.")
    )
}