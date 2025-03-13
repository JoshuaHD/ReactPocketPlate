import { z } from "zod"
export const formSchemaLogin = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" })
})
export const formSchemaPasswordForgotten = z.object({
    email: z.string().email()
})
export const formSchemaChangePassword = z.object({
    oldPassword: z.string().min(1, { message: "Password is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    passwordConfirm: z.string().min(1, { message: "Password is required" })
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"], // Error will appear on the confirmPassword field
});

export const formSchemaOtpLoginStep1 = z.object({
    email: z.string().email()
})
export const formSchemaOtpLoginStep2 = z.object({
    otp: z.string().min(8, {
        message: "Your one-time password must be 8 characters.",
      })
})