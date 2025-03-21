
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { Bug, BugOff } from 'lucide-react'

function TailwindIndicator() {
    if (process.env.NODE_ENV === "production") return <></>
  
    return (
      <div className="no-print fixed bottom-3 left-40 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white">
        <div className="block sm:hidden">xs</div>
        <div className="hidden sm:block md:hidden">sm</div>
        <div className="hidden md:block lg:hidden">md</div>
        <div className="hidden lg:block xl:hidden">lg</div>
        <div className="hidden xl:block 2xl:hidden">xl</div>
        <div className="hidden 2xl:block">2xl</div>
        <div className="hidden xs:block">xxs</div>
      </div>
    )
  }
export default function DevTools() {
    const [hide, setHide] = useState(true)
    if (process.env.NODE_ENV !== "development") return null; // Skip completely in production

    const hidden = localStorage.getItem('__hide_devtools') === 'true';
    if (hidden) return null;

    if(hide)
        return <div className='fixed bottom-0 right-0 bg-stone-200 rounded h-4 w-4 flex justify-center items-center' onClick={() => setHide(false)}><Bug size={12} /></div>

    return <>
        <div className='fixed bottom-0 right-0 bg-stone-200 rounded h-4 w-4 flex justify-center items-center' onClick={() => setHide(true)}><BugOff size={12} /></div>
        <ReactQueryDevtools />
        <TailwindIndicator />
        <TanStackRouterDevtools />
    </>
}