
import { Button } from "@/components/ui/button.js"
import { useAuth } from "@/state/atoms/user.js"
import UserProfile from "./UserProfile.js"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card.js"
import PasswordLoginForm from "./PasswordLoginForm.js"
import OtpLoginForm from "./OtpLoginForm.js"
import { azureAuthEnabled, otpAuthEnabled } from "@/settings.js"

export default function LoginPage() {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated())
        return <UserProfile />

    return (
        <Card className="max-w-96 m-auto mt-4">
            <CardHeader>
                <CardTitle>User Login</CardTitle>
            </CardHeader>
            <CardContent>
                <PasswordLoginForm />
            </CardContent>
            {otpAuthEnabled && <>
                <hr />
                <CardHeader>
                    <CardTitle>Login with Code</CardTitle>
                </CardHeader>
                <CardContent>
                    <OtpLoginForm />
                </CardContent>
            </>}

            {azureAuthEnabled && <>
                <hr />
                <CardFooter className="flex justify-center">
                    <Button>Login with Office Account</Button>
                </CardFooter>
            </>}
        </Card>
    )
}
