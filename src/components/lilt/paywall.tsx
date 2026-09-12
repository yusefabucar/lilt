import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  busy: boolean;
  error: string | null;
  onClose: () => void;
  onSubscribe: () => void;
};

export function Paywall({ open, busy, error, onClose, onSubscribe }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center">
      <button type="button" className="absolute inset-0 bg-bg/70" aria-label="Close" onClick={onClose} />
      <div
        role="dialog"
        aria-labelledby="paywall-title"
        className="relative z-10 w-full max-w-md rounded-t-xl bg-bg-elevated p-6 shadow-border sm:rounded-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-11 place-items-center rounded-md text-fg-muted hover:text-fg"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle">Pinpoint</p>
        <h2 id="paywall-title" className="mt-2 font-display text-3xl tracking-tight">
          $0.99 a month
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          Free ACCENTIFY names the vicinity — New York, the American South, Greater London. Pinpoint names the
          neighborhood: Brooklyn, NY, Southie, Hackney.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-fg">
          <li className="rounded-md bg-bg-subtle px-3 py-2 shadow-border">Neighborhood on every read — Brooklyn, NY, not just New York</li>
          <li className="rounded-md bg-bg-subtle px-3 py-2 shadow-border">Billed $0.99 each month until you cancel</li>
          <li className="rounded-md bg-bg-subtle px-3 py-2 shadow-border">Payouts go to the connected bank, not a middle wallet</li>
        </ul>
        {error ? <p className="mt-4 text-sm text-fg-muted">{error}</p> : null}
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-3xl tracking-tight">$0.99</p>
            <p className="text-xs text-fg-subtle">per month</p>
          </div>
          <Button className="rounded-md px-6" onClick={onSubscribe} disabled={busy}>
            {busy ? "Opening checkout" : "Pay $0.99/mo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
