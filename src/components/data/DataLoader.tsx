import { Loader2 } from "lucide-react";
import React from "react";
import { Message } from "../ui/Message.js";

type DataLoader = {
    isPending?: boolean,
    isFetching?: boolean,
    error?: any,
    children: React.ReactNode
}
export default function DataLoader({children, error, isPending, isFetching}: DataLoader) {
    const loader = <Loader2 className="animate-spin fixed top-15 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" />
    if(isPending)
        return loader

    if(error)
        return <Message type="error">Error: {error?.message}</Message>

    // bottom right corner <Loader2 className="animate-spin fixed bottom-4 right-4 z-50" />
    const cornerSpinner = (isFetching) ? loader : <></>

    return <>
    {children}
    {cornerSpinner}
    </>;

}