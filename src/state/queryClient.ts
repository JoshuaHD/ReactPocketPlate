import { pb } from "@/settings.js"
import { QueryClient, queryOptions } from "@tanstack/react-query"
import { RecordFullListOptions, RecordOptions } from "pocketbase"

const queryClient = new QueryClient()

export default queryClient

export function getPbClients(collection: string) {
    return {
        getOne: (id: string, options?: RecordOptions) => {
            return queryOptions({
                queryKey: [collection, id],
                queryFn: () => pb.collection(collection).getOne(id, options),
                staleTime: 5 * 1000,
                retry: (failureCount: number, error: any) => {
                    console.log({ error })
                    if (error?.status === 404) {
                        return false; // Do NOT retry on 404 Not Found
                    }
                    if (error?.status === 401) {
                        return false; // Do NOT retry on 401 Unauthorized
                    }
                    return failureCount < 3; // Retry up to 3 times for other errors
                },
            })
        },
        getFullList: (options?:RecordFullListOptions ) => {
            return queryOptions({
                queryKey: [collection],
                queryFn: () => pb.collection(collection).getFullList(options),
                staleTime: 5 * 1000,
                retry: (failureCount: number, error: any) => {
                    console.log({ error })
                    if (error?.status === 404) {
                        return false; // Do NOT retry on 404 Not Found
                    }
                    if (error?.status === 401) {
                        return false; // Do NOT retry on 401 Unauthorized
                    }
                    return failureCount < 3; // Retry up to 3 times for other errors
                },
            })
        },
    }
}