import UserProfile from '@/components/user/UserProfile.js'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UserProfile />
}
