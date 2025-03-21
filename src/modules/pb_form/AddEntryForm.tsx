import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodSchema } from "zod"
import { Button } from "@/components/ui/button.js"
import { Form, FormMessage } from "@/components/ui/form.js"
import { getDefaultValuesFromZodFormMetadata, ZodFormMetadata } from "@/components/forms/zod_schema_helpers.js";
import ZodFormField from "@/components/forms/ZodFormField.js";
import { pb } from "@/settings.js"
import { toast } from "react-toastify"

import { ZodRawShape } from "zod";
import { useEffect, useState } from "react"
import { RecordModel } from "pocketbase"
import { useRouter, useCanGoBack, useBlocker } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import queryClient from "@/state/queryClient.js"
import { getOrphanErrors, OrphanError, formBlocker } from "./utils.js"

type AddEntryForm<T extends ZodRawShape> = {
    collection: string;
    formSchema: ZodSchema<T>;
    formMetaData: ZodFormMetadata<T>;
    onSuccess?: (values: RecordModel) => void,
};

export default function AddEntryForm<T extends ZodRawShape>({ collection, formSchema, formMetaData, onSuccess }: AddEntryForm<T>) {
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const [action, setAction] = useState<"back" | "new">()
    const [formId, setFormId] = useState(new Date().getTime())

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaultValuesFromZodFormMetadata(formMetaData, {}) as any,
    })

    // When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
    const mutation = useMutation({
        mutationFn: (values: Partial<RecordModel>) => pb.collection(collection).create(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collection] })
        },
    })

    const [orphanErrors, setOrphanErrors] = useState<OrphanError[]>([])

    useEffect(() => {
        setOrphanErrors(getOrphanErrors(form.formState.errors, Object.keys(formMetaData)))
    }, [form.formState.errors])

    useBlocker({
        shouldBlockFn: formBlocker(form.formState.isDirty)
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await mutation.mutateAsync(values)

            const resetForm = () => {
                form.reset(getDefaultValuesFromZodFormMetadata(formMetaData, {}) as any)
                toast.success("Created", {
                    hideProgressBar: false,
                    autoClose: 1000
                });
                setFormId(new Date().getTime())
            }

            if (action === "new") {
                resetForm()
            } else {
                resetForm()
                if (typeof onSuccess === "function")
                    return onSuccess(res)

                if (canGoBack) {
                    await router.invalidate({ sync: true })
                    return router.history.back()
                }
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    const buttons = <div className="flex justify-center gap-2">
        {canGoBack && <Button onClick={() => setAction("back")} disabled={form.formState.isSubmitting} type="submit">Create{form.formState.isSubmitting && <>ing <Loader2 className="animate-spin" /></>}</Button>}
        <Button onClick={() => setAction("new")} disabled={form.formState.isSubmitting || !form.formState.isDirty} type="submit">Save{form.formState.isSubmitting && <>ing only <Loader2 className="animate-spin" /></>} + new</Button>
    </div>

    return (<div className={"max-w-lg p-4"}>
        <Form key={formId} {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 grid grid-cols-12 gap-6">
                {Object.entries(formMetaData).map(([key, field]) => {
                    return <ZodFormField key={key} form={form} name={key} fieldMetaData={field} />
                })}
                <div className="col-span-12">
                    {orphanErrors?.map((error) => {
                        return <FormMessage key={error.name}><>{error.name}: {error.err?.message}</></FormMessage>
                    })}
                    {buttons}
                </div>
            </form>
        </Form>
    </div>
    )
}
