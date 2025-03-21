import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodSchema, ZodRawShape } from "zod"
import { Button } from "@/components/ui/button.js"
import { Form, FormMessage } from "@/components/ui/form.js"
import { getDefaultValuesFromZodFormMetadata, ZodFormMetadata } from "@/components/forms/zod_schema_helpers.js";
import ZodFormField from "@/components/forms/ZodFormField.js";
import { pb } from "@/settings.js"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { RecordModel } from "pocketbase"
import { useRouter, useCanGoBack, useBlocker } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"
import queryClient, { getPbClients } from "@/state/queryClient.js"
import { useMutation, useQuery } from "@tanstack/react-query"
import { OrphanError, getOrphanErrors, formBlocker } from "./utils.js"

type UpdateEntryForm<T extends ZodRawShape> = {
    recordId: string;
    collection: string;
    formSchema: ZodSchema<T>;
    formMetaData: ZodFormMetadata<T>;
    onSuccess?: (values: RecordModel) => void;
};

export default function UpdateEntryForm<T extends ZodRawShape>({ recordId, collection, formSchema, formMetaData, onSuccess }: UpdateEntryForm<T>) {
    const router = useRouter()
    const canGoBack = useCanGoBack()
    const [action, setAction] = useState<"back" | "stay">()
    const { data } = useQuery(getPbClients(collection).getOne(recordId))
    const [formId, _setFormId] = useState(new Date().getTime())

    // When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
    const mutation = useMutation({
        mutationFn: ({ id, values }: { id: any, values: Partial<RecordModel> }) => pb.collection(collection).update(id, values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collection, recordId] })
        },
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaultValuesFromZodFormMetadata(formMetaData, data) as any,
    })

    const [orphanErrors, setOrphanErrors] = useState<OrphanError[]>([])

    useEffect(() => {
        setOrphanErrors(getOrphanErrors(form.formState.errors, Object.keys(formMetaData)))
    }, [form.formState.errors])

    useBlocker({
        shouldBlockFn: formBlocker(form.formState.isDirty)
    })

    // Reset form values when data is loaded
    useEffect(() => {
        if (data) {
            form.reset(getDefaultValuesFromZodFormMetadata(formMetaData, data) as any)
        }
    }, [data])

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await mutation.mutateAsync({ id: values.id, values })

            // reset the form to the current values to disable navigation blocker
            form.reset(form.getValues())

            if (action === "stay") {
                toast.success("Saved", {
                    autoClose: 1000
                })
            } else {
                if (typeof onSuccess === "function")
                    return onSuccess(res)

                if (canGoBack) {
                    return router.history.back()
                }
            }
        } catch (err: any) {
            toast.error(err.message);
        }
    }

    const buttons = <div className="flex justify-center gap-2">
        {canGoBack && <Button onClick={() => setAction("back")} disabled={form.formState.isSubmitting} type="submit">Submit{form.formState.isSubmitting && <>ing <Loader2 className="animate-spin" /></>}</Button>}
        <Button onClick={() => setAction("stay")} disabled={form.formState.isSubmitting || !form.formState.isDirty} type="submit">Save{form.formState.isSubmitting && <>ing only <Loader2 className="animate-spin" /></>}</Button>
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
