import { useAuth } from "@/state/atoms/user.js"
import { pb } from "@/settings.js"
import { Button } from "../ui/button.js"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.js"
import LoginPage from "./LoginPage.js"

export default function LogoutForm({ confirm }: { confirm?: boolean }) {
    const { user, logout } = useAuth()
    const pbUser = pb.authStore.record

    useEffect(() => {
        if (!confirm)
            logout()
    }, [])
    if (user || pbUser)
        return <Button onClick={() => logout()}>Logout {user?.name ?? pbUser?.name}</Button>

    return <div><Card className="max-w-96 m-auto mt-4">
        <CardHeader>
            <CardTitle>Logout</CardTitle>
        </CardHeader>
        <CardContent>
            You were successfully logged out.
        </CardContent>
    </Card>
    <LoginPage />
    </div>
}