import { useAuth } from "@/state/atoms/user.js"
import TanstackLink from "../ui/TanstackLink.js"

export default function AuthLink () {
    const {user} = useAuth()

    if(user)
        return <TanstackLink to={"/user/logout"}>logout</TanstackLink>
    
    return <TanstackLink to={"/user/login"}>login</TanstackLink>
}