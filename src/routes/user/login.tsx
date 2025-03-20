import LoginPage from '@/components/user/LoginPage.js'
import { pb } from '@/settings.js'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

const fallback = "/user/profile"
export const Route = createFileRoute('/user/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ search }) => {
    const redirect_page = search.redirect || fallback
    if (pb.authStore.isValid && redirect_page !== '/user/login' ) {
      // @ts-ignore // FIXME: Issue with Tanstack Router Expected 0 arguments, but got 1.
      throw redirect({ to: redirect_page })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage />
}
