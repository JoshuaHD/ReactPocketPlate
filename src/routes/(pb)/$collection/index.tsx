import { Button } from '@/components/ui/button.js'
import TanstackLink from '@/components/ui/TanstackLink.js'
import { PageSetup } from '@/modules/pb_collection_settings/types.js'
import ListEntries from '@/modules/pb_form/ListEntries.js'
import queryClient, { getPbClients } from '@/state/queryClient.js'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/(pb)/$collection/')({
  component: RouteComponent,
  // FIXME Params and Context are not recognized by typescript correctly
  loader: ({ params: { }, context: { collection_settings, collection } }: any) => {

    const { queryOptions } = collection_settings

    return queryClient.ensureQueryData(getPbClients(collection).getFullList(queryOptions)).then(() => {
      return { collection_settings }
    })
  },
})

export function BottomBuffer() {
  return <div className='h-24'></div>
}
export function FloatingActionButton() {
  const [visible, setVisible] = useState(true);
  let scrollTimeout: NodeJS.Timeout;

  useEffect(() => {
    const handleScroll = () => {
      setVisible(false); // Hide button when scrolling

      // Clear previous timeout to reset timer
      clearTimeout(scrollTimeout);

      // Show button after 1 second of no scrolling
      scrollTimeout = setTimeout(() => setVisible(true), 1000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <>
      {/* Invisible buffer zone to prevent overlap */}
      <div className="h-20" aria-hidden="true"></div>
      <Button
        className={`fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center ${visible ? "opacity-100" : "opacity-0"}`}
        asChild
        size="icon"
      >
        <TanstackLink to={'./new'}><Plus className="w-8 h-8" /></TanstackLink>
      </Button>
    </>
  );
}

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const { collection, listEntriesProps, queryOptions } = loaderData.collection_settings as PageSetup<any>

  return <div>
    <ListEntries collection={collection} queryOptions={queryOptions} {...listEntriesProps} />

    <FloatingActionButton />
  </div>
}
