import TanstackLink from '@/components/ui/TanstackLink.js'
import AuthLink from '@/components/user/AuthLink.js'
import DevTools from '@/DevTools.js'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import PWABadge from '../PWABadge.js'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <TanstackLink to="/" className="[&.active]:font-bold">
          Home
        </TanstackLink>{' '}
        <TanstackLink to="/user" className="[&.active]:font-bold">
          User
        </TanstackLink>
        
        <div className='ml-auto'><AuthLink /></div>
      </div>
      <hr />
      <Outlet />
      <DevTools />
      <PWABadge />
    </>
  ),
})