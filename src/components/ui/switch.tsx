import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils.js"

type Switch = {
  size: "large"|undefined
}

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & Switch) {
  const size = props.size

  if(size==="large")
    return <SwitchBig className={className} {...props} />
    
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

  function SwitchBig({
    className,
    ...props
  }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(
          "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-9 w-16 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", // Switch size doubled
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block h-8 w-8 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-0.2rem)] data-[state=unchecked]:translate-x-[0.08rem]" // Thumb size increased and fixed translation
          )}
        />
      </SwitchPrimitive.Root>
    )
  }
  

export { Switch }
