import LoginPage from '@/components/user/LoginPage.js'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const fallback = "/user/profile"
export const Route = createFileRoute('/user/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    // @ts-ignore // FIXME context is detected as {} instead of containing auth object
    if (context?.auth?.isAuthenticated) {
      // @ts-ignore // FIXME: Issue with Tanstack Router Expected 0 arguments, but got 1.
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage />
}
