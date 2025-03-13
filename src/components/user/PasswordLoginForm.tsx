import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.js"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form.js"
import { Input } from "@/components/ui/input.js"
import { useAuth } from "@/state/atoms/user.js"
import { formSchemaLogin } from "./formSchemas.js"
import TanstackLink from "../ui/TanstackLink.js"

export default function PasswordLoginForm() {
    const router = useRouter()

    const { login } = useAuth()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchemaLogin>>({
        resolver: zodResolver(formSchemaLogin),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchemaLogin>) {
        try {
            await login(values.email, values.password)

            router.navigate({ to: "/user" })
        } catch (err: any) {
            form.setError("password", { type: "manual", message: err.message });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type={"password"} placeholder="" {...field} />
                            </FormControl>
                            <FormDescription className="text-right"><TanstackLink to={'/user/password_forgotten'}>Password Forgotten?</TanstackLink></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-center">
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}
