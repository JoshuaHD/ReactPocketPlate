import { useRouter, useCanGoBack } from "@tanstack/react-router";
import { MoveLeft } from "lucide-react";
import { Button } from "./button.js";
import TanstackLink from "./TanstackLink.js";

type GoBackLink = {
    fallbackLink?: string,
    fallbackLabel?: string|React.ReactNode
    onGoBack?: (canGoBack: boolean) => void
}

export default function GoBackLink ({fallbackLabel, fallbackLink, onGoBack}: GoBackLink) {
    const router = useRouter()
    const canGoBack = useCanGoBack()

    const goBack = () => {
        if(typeof onGoBack === "function")
            return onGoBack(canGoBack)

        if(canGoBack){
            return router.history.back()
          }
    }

    if(canGoBack)
        return <Button variant="link" className="cursor-pointer" onClick={goBack}><MoveLeft /></Button>
    
    if(fallbackLink)
        return  <Button variant={"link"}  className="cursor-pointer"><TanstackLink to={fallbackLink}>{fallbackLabel ?? <MoveLeft />}</TanstackLink></Button>

    return <></>
}