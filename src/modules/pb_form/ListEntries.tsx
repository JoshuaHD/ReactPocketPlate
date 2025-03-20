import DataLoader from "@/components/data/DataLoader.js";
import { Button } from "@/components/ui/button.js";
import TanstackLink from "@/components/ui/TanstackLink.js";
import { getPbClients } from "@/state/queryClient.js";
import { useQuery } from "@tanstack/react-query";
import { Edit, Eye, Trash2 } from "lucide-react";
import { RecordFullListOptions, RecordModel } from "pocketbase";
import { Bounce, toast, ToastContentProps } from "react-toastify";
import DeleteEntry from './DeleteEntry.js'


type ListRowOptions = {
    renderRow?: (row: RecordModel) => React.ReactNode | string | number
    showViewLink?: boolean
    showDeleteLink?: boolean
    showEditLink?: boolean
    rowClickAction?: "edit"|"delete"|"view"
}

export type ListEntriesProps = {} & ListRowOptions
type ListEntries = {
    collection: string,
    queryOptions?: RecordFullListOptions
} & ListEntriesProps

export default function ListEntries({ collection, queryOptions, renderRow, showViewLink, showDeleteLink, showEditLink, rowClickAction }: ListEntries) {
    const { isPending, error, data, isFetching } = useQuery(getPbClients(collection).getFullList(queryOptions))

    rowClickAction = rowClickAction ?? "view"

    return <div className="max-w-4xl">
        <DataLoader isPending={isPending} isFetching={isFetching} error={error}>
            {data?.map((row) => {
                const showRow = (typeof renderRow === "function") ? renderRow(row) : row.id

                const rowClickLink = (rowClickAction === "view") ? `./${row.id}` : `./${row.id}/${rowClickAction}`

                function CustomNotification({ closeToast }: ToastContentProps) {
                    return (
                        <DeleteEntry collection={collection} recordId={row.id} onSuccess={() => closeToast("deleted")} />
                    )
                }

                const deleteAction = () => {
                    toast(CustomNotification,
                        {
                            position: "top-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            theme: "colored",
                            transition: Bounce,
                        }
                    );
                };
                return <div key={row.id} className={"flex p-2 hover:bg-slate-200"}>
                    <TanstackLink to={rowClickLink} className="flex-1">
                        {showRow}
                    </TanstackLink>

                    {(showViewLink || rowClickAction !== "view") && <Button asChild variant="ghost">
                        <TanstackLink to={`./${row.id}`}><Eye /></TanstackLink>
                    </Button>}

                    {(showEditLink || rowClickAction !== "edit") && <Button asChild variant="ghost">
                        <TanstackLink to={`./${row.id}/edit`}><Edit /></TanstackLink>
                    </Button>}

                    {(showDeleteLink)
                        ? <Button className={"text-red-400"} asChild variant="ghost"><TanstackLink to={`./${row.id}/delete`}><Trash2 /></TanstackLink></Button>
                        : <Button className={"text-red-400"} variant="ghost" onClick={deleteAction}><Trash2 /></Button>
                    }

                </div>
            })}
        </DataLoader>
    </div>
}