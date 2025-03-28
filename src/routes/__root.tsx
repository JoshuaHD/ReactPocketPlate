import TanstackLink from '@/components/ui/TanstackLink.js'
import AuthLink from '@/components/user/AuthLink.js'
import DevTools from '@/DevTools.js'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import PWABadge from '../PWABadge.js'
import { Bounce, ToastContainer } from 'react-toastify';
import TestNavigation from '@/_dev/TestNavigation.js'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <TanstackLink to="/" className="[&.active]:font-bold">
          Home
        </TanstackLink>{' '}
        <TanstackLink to="/user" className="[&.active]:font-bold">
          User
        </TanstackLink>{' '}

        {
          /*
            THE TESTNAVIGATION COMPONENT IS EMPTY IN MASTER USE IT IN FEATURE BRANCHES TO TEST PAGES
            IT WILL NEVER BE MERGED INTO MASTER
          */
        }
        <TestNavigation />

        <div className='ml-auto'><AuthLink /></div>
      </div>
      <hr />
      <Outlet />
      <DevTools />
      <PWABadge />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce} />
    </>
  ),
})