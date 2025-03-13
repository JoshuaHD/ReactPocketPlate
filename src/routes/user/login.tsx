import LoginPage from '@/components/user/LoginPage.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginPage />
}
