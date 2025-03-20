import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@/state/queryClient.js'

// Import the generated route tree
import { routeTree } from './routeTree.gen.js'
import './styles/main.css'
import { useAuth } from './state/atoms/user.js'
import { Message } from './components/ui/Message.js'

// Create a new router instance
const router = createRouter({ 
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  scrollRestorationBehavior: "auto",
  defaultErrorComponent: ({ error }: {error: any}) => {
    return <Message standalone type="error">Error: {error?.message}</Message>
  },
  defaultNotFoundComponent: () => <Message standalone={true} type="error">Not Found ¯\_(ツ)_/¯</Message>,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router,
    context: {
      auth: undefined
    }
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </StrictMode>,
  )
}
