import { getPbClients } from "@/state/queryClient.js"
import { useQuery } from "@tanstack/react-query"

type ViewEntry = {
    recordId: string,
    collection: string,
}
export default function ViewEntry ({recordId, collection}: ViewEntry) {
    const { data } = useQuery(getPbClients(collection).getOne(recordId))

    return <div className="p-4">
        <h1>View {collection} entry</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
}