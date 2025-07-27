import GoBackLink from '@/components/ui/GoBackLink.js'
import { PageSetup } from '@/modules/pb_collection_settings/types.js'
import ViewEntry from '@/modules/pb_form/ViewEntry.js'
import queryClient, { getPbClients } from '@/state/queryClient.js'
import { createFileRoute, notFound } from '@tanstack/react-router'

const throw404 = (err: any) => {
  if (err.status === 404)
    throw notFound()
  throw err
}

export const Route = createFileRoute('/(pb)/$collection/$recordId')({
  loader: ({ params: { recordId }, context: {collection} }: any) => {
    return queryClient.ensureQueryData(getPbClients(collection).getOne(recordId)).catch(throw404)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { recordId } = Route.useParams()
  const { collection } = Route.useRouteContext();

  return <div>
    <div><GoBackLink fallbackLink='../' /></div>
    <ViewEntry recordId={recordId} collection={collection} />
  </div>
}
