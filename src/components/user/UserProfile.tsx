import { pb } from "@/settings.js"
import { useAuth } from "@/state/atoms/user.js"


export default function UserProfile () {
    const {user} = useAuth()
    const pbUser = pb.authStore.record
    return <pre>
        {JSON.stringify({user, pbUser}, null, 2)}
    </pre>
}