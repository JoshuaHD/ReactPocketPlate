import LogoutForm from '@/components/user/LogoutForm.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/logout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LogoutForm />
}
