import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md bg-bg-subtle px-3 text-sm text-fg shadow-border outline-none transition-[box-shadow,background-color] duration-150 placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
