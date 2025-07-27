import { pb } from "@/settings.js"
import { QueryClient, queryOptions } from "@tanstack/react-query"
import { RecordFullListOptions, RecordListOptions, RecordOptions } from "pocketbase"

const queryClient = new QueryClient()

export default queryClient

const defaultRetry = (failureCount: number, error: any) => {
    if (error?.status === 404) {
        return false; // Do NOT retry on 404 Not Found
    }
    if (error?.status === 401) {
        return false; // Do NOT retry on 401 Unauthorized
    }
    return failureCount < 3; // Retry up to 3 times for other errors
}

export function getPbClients(collection: string) {
    return {
        getOne: (id: string, options?: RecordOptions) => {
            return queryOptions({
                queryKey: [collection, id],
                queryFn: () => pb.collection(collection).getOne(id, options),
                staleTime: 5 * 1000,
                retry: defaultRetry,
            })
        },
        getList: (page?: number, perPage?: number, options?:RecordListOptions ) => {
            return queryOptions({
                queryKey: [collection, page, perPage],
                queryFn: () => pb.collection(collection).getList(page, perPage, options),
                staleTime: 5 * 1000,
                retry: defaultRetry,
            })
        },
        getFirstListItem: (filter: string, options?:RecordListOptions ) => {
            return queryOptions({
                queryKey: [collection],
                queryFn: () => pb.collection(collection).getFirstListItem(filter, options),
                staleTime: 5 * 1000,
                retry: defaultRetry,
            })
        },
        getFullList: (options?:RecordFullListOptions ) => {
            return queryOptions({
                queryKey: [collection],
                queryFn: () => pb.collection(collection).getFullList(options),
                staleTime: 5 * 1000,
                retry: defaultRetry,
            })
        },
    }
}