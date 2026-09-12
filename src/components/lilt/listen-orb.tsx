import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListenState } from "@/lib/lilt/types";

type Props = {
  state: ListenState;
  levels: number[];
  remainingMs: number;
  onPress: () => void;
};

export function ListenOrb({ state, levels, remainingMs, onPress }: Props) {
  const live = state === "recording";
  const busy = state === "analyzing" || state === "requesting";
  const label =
    state === "recording"
      ? "Stop"
      : state === "analyzing"
        ? "Listening"
        : state === "requesting"
          ? "Allow mic"
          : "Listen";

  return (
    <div className="relative grid place-items-center">
      <span className={cn("orb-ring", live && "orb-ring-live")} aria-hidden />
      <span className={cn("orb-ring orb-ring-2", live && "orb-ring-live")} aria-hidden />
      <button
        type="button"
        onClick={onPress}
        disabled={busy}
        aria-label={label}
        aria-pressed={live}
        className={cn(
          "relative z-10 grid size-44 place-items-center rounded-full bg-accent text-accent-fg shadow-[0_0_0_1px_rgb(241_236_227_/_0.18),0_24px_60px_rgb(0_0_0_/_0.45)] transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] sm:size-52",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          "disabled:opacity-70",
          live && "scale-[0.98]",
          busy && "cursor-wait",
        )}
      >
        <span className="flex flex-col items-center gap-2">
          {live ? (
            <Wave levels={levels} />
          ) : busy ? (
            <span className="orb-spin size-9 rounded-full border-2 border-accent-fg/20 border-t-accent-fg" />
          ) : (
            <Mic className="size-8" strokeWidth={1.6} />
          )}
          <span className="font-display text-lg tracking-tight">{label}</span>
          {live ? (
            <span className="font-mono text-xs tabular-nums text-accent-fg/70">
              {(remainingMs / 1000).toFixed(1)}s
            </span>
          ) : null}
        </span>
      </button>
    </div>
  );
}

function Wave({ levels }: { levels: number[] }) {
  const bars = levels.length ? levels : Array.from({ length: 24 }, () => 0.12);
  return (
    <span className="flex h-8 items-end gap-[3px]" aria-hidden>
      {bars.map((v, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-accent-fg"
          style={{ height: `${Math.round(8 + v * 24)}px` }}
        />
      ))}
    </span>
  );
}
