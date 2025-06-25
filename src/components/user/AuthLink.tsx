import { useAuth } from "@/state/atoms/user.js"
import TanstackLink from "../ui/TanstackLink.js"

export default function AuthLink() {
    const { user } = useAuth()

    if (user)
        return <>
            <TanstackLink to="/user" className="[&.active]:font-bold">
                My Account
            </TanstackLink>
        </>

    return <TanstackLink to={"/user/login"}>Login</TanstackLink>
}