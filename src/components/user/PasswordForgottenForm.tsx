import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button.js"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.js"
import { Input } from "@/components/ui/input.js"
import { pb } from '@/settings.js'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card.js"
import { formSchemaPasswordForgotten } from "./formSchemas.js"
import { useState } from "react"

export default function PasswordForgottenForm() {
    const [resetRequested, setResetRequested] = useState(false)
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchemaPasswordForgotten>>({
        resolver: zodResolver(formSchemaPasswordForgotten),
        defaultValues: {
            email: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchemaPasswordForgotten>) {
        try {
            await pb.collection("users").requestPasswordReset(values.email);

            setResetRequested(true)
        } catch (err) {
            console.error({ err })
        }
    }
    if (resetRequested) {
        return <Card className="max-w-96 m-auto mt-4">
            <CardHeader>
                <CardTitle>Password Reset</CardTitle>
            </CardHeader>
            <CardContent>
                We sent you an email with instructions to reset your password.
            </CardContent>
            <CardFooter>
                <Button onClick={() => {
                    form.setValue("email", "")
                    setResetRequested(false)
                }}>Try again</Button>
            </CardFooter>
        </Card>
    }


    return (
        <Card className="max-w-96 m-auto mt-4">
            <CardHeader>
                <CardTitle>Password Forgotten</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type={"email"} placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Request Password Reset</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
