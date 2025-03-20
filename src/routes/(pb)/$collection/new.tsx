import { createFileRoute } from '@tanstack/react-router'
import AddEntryForm from '@/modules/pb_form/AddEntryForm.js'
import GoBackLink from '@/components/ui/GoBackLink.js'
import { PageSetup } from '@/modules/pb_collection_settings/types.js'

export const Route = createFileRoute('/(pb)/$collection/new')({
  loader: ({context: {collection_settings}}: any) => ({collection_settings}),
  component: RouteComponent,
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const {collection, formCreateMetadata, formCreateSchema} = loaderData.collection_settings as PageSetup<any>

  return <div>
    <div><GoBackLink fallbackLink='../' /></div>
    <h1>Create new {collection} entry</h1>
    <AddEntryForm collection={collection} formMetaData={formCreateMetadata} formSchema={formCreateSchema} />
  </div>
}
