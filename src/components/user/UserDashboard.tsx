import { useAuth } from "@/state/atoms/user.js"
import { Button } from "../ui/button.js"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.js"
import TanstackLink from "../ui/TanstackLink.js"
import LoginPage from "./LoginPage.js"
import UserProfile from "./UserProfile.js"

export default function UserDashboard() {
    const { user, refresh, logout } = useAuth()
    if (!user)
        return <LoginPage />
    return <div>
        <Card className="mt-4">
            <CardContent className="flex justify-center">
                <Button variant={"link"}><TanstackLink to={"/user/change_password"}>Change Password</TanstackLink></Button>
                <Button variant={"link"} onClick={() => refresh()}>Refresh Session</Button>
                <Button variant={"link"} onClick={() => logout()}>Logout</Button>
            </CardContent>
        </Card>
        <Card className="mt-4">
            <CardHeader><CardTitle>User Profile</CardTitle></CardHeader>
            <CardContent>
                <UserProfile />
            </CardContent>
        </Card>
    </div>
}