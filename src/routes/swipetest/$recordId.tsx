import GoBackLink from '@/components/ui/GoBackLink.js'
import ViewEntry from '@/modules/pb_form/ViewEntry.js'
import queryClient, { getPbClients } from '@/state/queryClient.js'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import TanstackLink from '@/components/ui/TanstackLink.js'

const throw404 = (err: any) => {
  if (err.status === 404)
    throw notFound()
  throw err
}

export const Route = createFileRoute('/swipetest/$recordId')({
  loader: ({ params: { recordId }, }: any) => {
   return queryClient.ensureQueryData(getPbClients("tasks").getList(recordId, 1)).catch(throw404)
  },
  component: RouteComponent,
})

const Page = ({recordId}: any) => {
  //const res = useQuery(getPbClients("tasks").getList(recordId, 1))
  const data = Route.useLoaderData();

  const isLoading = false
  console.log({data, isLoading})

  const prev = (data?.page > 1) ? data?.page - 1 : null
  const next = (data?.page < data?.totalPages) ? data?.page + 1 : null
  return <>
    You are on: {recordId}

    {(isLoading) ? <>loading</> : <>
    <br />
    <pre key={recordId}>
      {JSON.stringify({data}, null, 4)}
    </pre>
    <TanstackLink to={`../${prev}`}>prev</TanstackLink> | <TanstackLink to={`../${next}`}>next</TanstackLink>
    </>
    }
  </>
}

function RouteComponent() {
  const { recordId } = Route.useParams()
  
  return <div>
    <div><GoBackLink fallbackLink='../' /></div>
    <Page key={recordId} recordId={recordId} />
  </div>
}
