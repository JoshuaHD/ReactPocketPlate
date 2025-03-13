
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
export default function DevTools() {
    if (process.env.NODE_ENV !== "development") return null; // Skip completely in production

    const hide = localStorage.getItem('__hide_devtools') === 'true';
    if (hide) return null;

    return <>
        <ReactQueryDevtools />
        <TanStackRouterDevtools />
    </>
}