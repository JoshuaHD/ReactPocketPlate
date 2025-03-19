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
import { formSchemaOtpLoginStep1, formSchemaOtpLoginStep2 } from "./formSchemas.js"
import { useEffect, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp.js";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeft } from "lucide-react";

export default function OtpLoginForm() {
    const [otpId, setOtpId] = useState<string>("")
    const router = useRouter()

    const { requestOTP, authWithOTP } = useAuth()
    // 1. Define your form.
    const formStep1 = useForm<z.infer<typeof formSchemaOtpLoginStep1>>({
        resolver: zodResolver(formSchemaOtpLoginStep1),
        defaultValues: {
            email: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmitStep1(values: z.infer<typeof formSchemaOtpLoginStep1>) {
        try {
            const new_otpId = await requestOTP(values.email)
            setOtpId(new_otpId)
        } catch (err: any) {
            formStep1.setError("email", { type: "manual", message: err.message });
        }
    }

    const formStep2 = useForm<z.infer<typeof formSchemaOtpLoginStep2>>({
        resolver: zodResolver(formSchemaOtpLoginStep2),
        defaultValues: {
            otp: "",
        },
    })

    const otpValue = formStep2.watch("otp")
    const otpLength = 8

    useEffect(() => {
        if (otpValue.length === otpLength) {
            formStep2.handleSubmit(onSubmitStep2)(); // Auto-submit when length is met
        }
    }, [otpValue]);

    async function onSubmitStep2(values: z.infer<typeof formSchemaOtpLoginStep2>) {
        try {
            // authenticate with the requested OTP id and the email password
            await authWithOTP(otpId, values.otp)

            // Get the value of the "redirect" query parameter
            const redirect = (new URLSearchParams(window.location.search)).get('redirect');
            router.navigate({ to: redirect || "/user" })
        } catch (err: any) {
            formStep2.setError("otp", { type: "manual", message: err.message });
        }
    }

    if (!otpId)
        return (
            <Form key={"step1"} {...formStep1}>
                <form onSubmit={formStep1.handleSubmit(onSubmitStep1)} className="space-y-6">
                    <FormField
                        control={formStep1.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        <Button type="submit">Request Code</Button>
                    </div>
                </form>
            </Form>
        )

    const resetOTP = () => {
        formStep1.reset()
        formStep2.reset()
        setOtpId("")
    }

    return (
        <Form key={"step2"} {...formStep2}>
            <form onSubmit={formStep2.handleSubmit(onSubmitStep2)} className="space-y-6">
                <FormField
                    control={formStep2.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>One-Time Password</FormLabel>
                            <FormDescription>
                                Please enter the one-time password sent to <strong>{formStep1.getValues("email")}</strong>
                            </FormDescription>
                            <FormControl>
                                <div className="flex justify-center">
                                    <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSeparator />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                            <InputOTPSlot index={6} />
                                            <InputOTPSlot index={7} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-center">
                    <Button type="submit">Submit</Button>
                </div>
                <div className="flex justify-center">
                    <Button variant="link" type="submit" onClick={resetOTP}><ArrowLeft /> Change Email</Button>
                </div>
            </form>
        </Form>
    )
}
