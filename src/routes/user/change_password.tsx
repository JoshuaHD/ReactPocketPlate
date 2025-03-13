import ChangePasswordForm from '@/components/user/ChangePasswordForm.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/change_password')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ChangePasswordForm />
}
