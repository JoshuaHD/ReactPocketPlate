import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/access_denied')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Access Denied</div>
}
