import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.ComponentProps<"span"> & { tone?: "neutral" | "up" | "down" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        tone === "neutral" && "bg-bg-subtle text-fg-muted",
        tone === "up" && "bg-up/15 text-up",
        tone === "down" && "bg-down/15 text-down",
        tone === "accent" && "bg-accent/15 text-accent",
        className,
      )}
      {...props}
    />
  );
}
