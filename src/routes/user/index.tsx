import UserDashboard from '@/components/user/UserDashboard.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UserDashboard />
}
