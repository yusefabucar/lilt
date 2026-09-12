import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-bg-subtle shadow-border transition-colors duration-150 data-[state=checked]:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 translate-x-1 rounded-full bg-fg transition-transform duration-150 data-[state=checked]:translate-x-6 data-[state=checked]:bg-accent-fg" />
    </SwitchPrimitive.Root>
  );
}
