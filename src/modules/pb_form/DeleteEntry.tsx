import { Button } from "@/components/ui/button.js"
import { Message } from "@/components/ui/Message.js"
import { pb } from "@/settings.js"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"

type DeleteEntry = {
    collection: string,
    recordId: string,
    onSuccess?: () => void,
    onError?: (err: any) => void
}

export default function DeleteEntry({ collection, recordId: resourceId, onSuccess, onError }: DeleteEntry) {
    const queryClient = useQueryClient()

    // When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
    const mutation = useMutation({
        mutationFn: (id: string) => pb.collection(collection).delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [collection] })
        },
    })
    const handleDeleteResource = async () => {
        try {
            await mutation.mutateAsync(resourceId)
            if (onSuccess && typeof onSuccess === "function")
                return onSuccess()

            toast.success("Deleted")
        } catch (err: any) {
            if (onError && typeof onError === "function")
                return onError(err)

            toast.error(err.message)
        }
    }
    return <Message type="error" >
        Are you sure you that you want to delete the following resource?
        <ul>
            <li>{collection}: {resourceId}</li>
        </ul>
        <center>
        <Button onClick={handleDeleteResource} variant="destructive" disabled={mutation.isPending}>Delete Resource {mutation.isPending ? <Loader2 className="animate-spin" /> :  <Loader2 fill="transparent" stroke="transparent"/> }</Button>
        </center>
    </Message>
}