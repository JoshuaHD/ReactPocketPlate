import GoBackLink from '@/components/ui/GoBackLink.js'
import { Message } from '@/components/ui/Message.js'
import DeleteEntry from '@/modules/pb_form/DeleteEntry.js'
import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/(pb)/$collection/$recordId_/delete')({
  component: RouteComponent,
})

function RouteComponent() {
  const { recordId, collection } = Route.useParams()
  const [isDeleted, setIsDeleted] = useState(false)
  const router = useRouter()
  const canGoBack = useCanGoBack()

  const handleSuccess = async () => {
    await router.invalidate({ sync: true })

    if (canGoBack) {
      return router.history.back()
    }

    setIsDeleted(true)
  }

  if (isDeleted)
    return <Message standalone type={"success"}>Resource Deleted</Message>

  return <div>
    <div><GoBackLink fallbackLink='../' /></div>
    <DeleteEntry collection={collection} recordId={recordId} onSuccess={handleSuccess} />
  </div>
}
