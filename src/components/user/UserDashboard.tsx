import { useAuth } from "@/state/atoms/user.js"
import { Button } from "../ui/button.js"
import { Card, CardContent } from "../ui/card.js"
import TanstackLink from "../ui/TanstackLink.js"
import LoginPage from "./LoginPage.js"
import UserProfile from "./UserProfile.js"

export default function UserDashboard() {
    const { user, refresh, logout } = useAuth()
    if (!user)
        return <LoginPage />
    return <div>
        <Card>
            <CardContent>
                <TanstackLink to={"/user/change_password"}>Change Password</TanstackLink>
                <Button onClick={() => refresh()}>Refresh Session</Button>
                <Button onClick={() => logout()}>Logout</Button>
            </CardContent>
        </Card>
        <UserProfile />
    </div>
}