import queryClient, { getPbClients } from '@/state/queryClient.js'
import { createFileRoute } from '@tanstack/react-router'

import UpdateEntryForm from '@/modules/pb_form/UpdateEntryForm.js'
import GoBackLink from '@/components/ui/GoBackLink.js'
import { PageSetup } from '@/modules/pb_collection_settings/types.js'

export const Route = createFileRoute('/(pb)/$collection/$recordId_/edit')({
  component: RouteComponent,

  loader: ({ params: { recordId, }, context: { collection_settings, collection } }: any) => {
    return queryClient.ensureQueryData(getPbClients(collection).getOne(recordId))
                      .then((data) => ({ collection_settings, data }))
  }
})

function RouteComponent() {
  const { recordId } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const { collection, formUpdateMetadata, formUpdateSchema } = loaderData.collection_settings as PageSetup<any>

  return <div>
    <div><GoBackLink fallbackLink='../' /></div>
    <h1>Updating {collection} id {recordId}</h1>
    <UpdateEntryForm recordId={recordId} collection={collection} formSchema={formUpdateSchema} formMetaData={formUpdateMetadata} />
  </div>
}


