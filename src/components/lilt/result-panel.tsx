import { Lock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IdentifyOk } from "@/lib/lilt/types";

type Props = {
  result: IdentifyOk;
  premium: boolean;
  onUnlock: () => void;
  onAgain: () => void;
};

export function ResultPanel({ result, premium, onUnlock, onAgain }: Props) {
  const pct = Math.round(result.confidence * 100);
  return (
    <section className="mx-auto w-full max-w-lg animate-in">
      <div className="rounded-xl bg-bg-elevated p-5 shadow-border sm:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle">Vicinity</p>
        <h2 className="mt-2 font-display text-3xl leading-tight tracking-tight text-fg sm:text-4xl">
          {result.region}
        </h2>
        <p className="mt-1 text-sm text-fg-muted">{result.country}</p>

        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle">Neighborhood</p>
          {premium ? (
            <p className="mt-2 flex items-start gap-2 font-display text-xl text-fg">
              <MapPin className="mt-1 size-4 shrink-0 text-fg-muted" />
              <span>{result.locality}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={onUnlock}
              className="mt-2 flex w-full items-center justify-between gap-3 rounded-lg bg-bg-subtle px-4 py-3 text-left shadow-border"
            >
              <span>
                <span className="block font-display text-lg blur-[6px] select-none" aria-hidden>
                  the neighborhood
                </span>
                <span className="mt-1 block text-xs text-fg-muted">Neighborhood · $0.99/mo</span>
              </span>
              <Lock className="size-4 shrink-0 text-fg-muted" />
            </button>
          )}
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle">Confidence</p>
            <p className="font-mono text-sm tabular-nums text-fg">{pct}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-subtle">
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {premium && result.cues.length ? (
          <ul className="mt-5 space-y-2">
            {result.cues.map((cue) => (
              <li key={cue} className="text-sm leading-relaxed text-fg-muted">
                {cue}
              </li>
            ))}
          </ul>
        ) : null}

        {result.transcript ? (
          <p className={cn("mt-5 border-t border-border pt-4 text-sm leading-relaxed text-fg-muted")}>
            “{result.transcript}”
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1 rounded-md" onClick={onAgain}>
            Listen again
          </Button>
          {!premium ? (
            <Button variant="secondary" className="flex-1 rounded-md" onClick={onUnlock}>
              Unlock Pinpoint
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
