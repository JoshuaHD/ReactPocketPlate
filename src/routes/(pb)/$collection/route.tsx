import { createFileRoute, notFound, Outlet} from '@tanstack/react-router'
import page_settings from '@/modules/pb_collection_settings/pages.js'
import { protectPage } from '@/lib/auth.js'


type PbRouteLoaderContext = {
  collection_settings: {
    collection: string,
    [key: string]: any
  },
  collection: string
}
export type RouteLoaderProps = {
  
  params: {
    collection: string,
    recordId?: string,
  }
}

export const Route = createFileRoute('/(pb)/$collection')({
  beforeLoad: async ({ params, location }) => {
    /* Dynamic import
    const module = await import(`@/modules/${params.collection}/setup.js`);
    const collection_settings = module.default
    /* */
    const collection_settings = page_settings[params.collection as keyof typeof page_settings]

    if(!collection_settings)
      throw notFound()

    protectPage(location)

    const context: PbRouteLoaderContext = {collection_settings, collection: collection_settings.collection || params.collection}

    return context
  },
  component: RouteComponent
})

function RouteComponent() {
  return <div>
    <div className='h-2 bg-zinc-100'></div>
    <Outlet />
    </div>
}
