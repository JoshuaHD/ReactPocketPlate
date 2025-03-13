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
import { useAuth } from "@/state/atoms/user.js"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.js"
import { formSchemaChangePassword } from "./formSchemas.js"
import { useState } from "react"
import PasswordLoginForm from "./PasswordLoginForm.js"

export default function ChangePasswordForm() {
    const [ success, setSuccess] = useState(false)
    const { user, changePassword } = useAuth()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchemaChangePassword>>({
        resolver: zodResolver(formSchemaChangePassword),
        defaultValues: {
            oldPassword: "",
            password: "",
            passwordConfirm: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchemaChangePassword>) {
        try {
            await changePassword(values.oldPassword, values.password, values.passwordConfirm)
            setSuccess(true)
        } catch (err: any) {
            console.log({ err })

            if (err?.response?.data?.oldPassword?.message)
                form.setError("oldPassword", { type: "manual", message: err?.response?.data?.oldPassword?.message });
            if (err?.response?.data?.password?.message)
                form.setError("password", { type: "manual", message: err?.response?.data?.password?.message });

        }
    }

    
    if (success) {
        return <Card className="max-w-96 m-auto mt-4">
            <CardHeader>
                <CardTitle>Password Changed</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Your password was successfully changed.</p>

                <p>Please Login again with your new password.</p>
            </CardContent>
            
            <CardHeader>
                <CardTitle>User Login</CardTitle>
            </CardHeader>
            <CardContent><PasswordLoginForm /></CardContent>
        </Card>
    }

    if (!user) {
        return <Card className="max-w-96 m-auto mt-4">
            <CardContent>You need to be logged in to change your password!</CardContent>
        </Card>
    }


    return (
        <Card className="max-w-96 m-auto mt-4">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type={"password"} placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type={"password"} placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordConfirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type={"password"} placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Change Password</Button>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}
