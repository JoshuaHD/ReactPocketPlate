import PasswordForgottenForm from '@/components/user/PasswordForgottenForm.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/password_forgotten')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PasswordForgottenForm />
}
