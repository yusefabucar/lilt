import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstall = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

function isIos(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function InstallApp() {
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstall | null>(null);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    setReady(true);
    setInstalled(isStandalone());
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstall);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!ready || installed) return null;

  async function onInstall() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === "accepted") setInstalled(true);
      return;
    }
    if (isIos()) {
      window.location.assign("/?install=1&platform=ios");
      return;
    }
    setSheet(true);
  }

  return (
    <>
      <Button type="button" variant="secondary" className="w-full rounded-md" onClick={() => void onInstall()}>
        Get the app
      </Button>
      {sheet ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button type="button" className="absolute inset-0 bg-bg/80" aria-label="Close" onClick={() => setSheet(false)} />
          <div
            role="dialog"
            aria-labelledby="install-title"
            className="relative z-10 w-full max-w-md rounded-xl bg-bg-elevated p-6 shadow-border"
          >
            <button
              type="button"
              onClick={() => setSheet(false)}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-md text-fg-muted hover:text-fg"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle">Home screen</p>
            <h2 id="install-title" className="mt-2 font-display text-3xl tracking-tight">
              ACCENTIFY on your phone
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              iPhone: Safari → Share → Add to Home Screen. Android: Chrome → Install app. It sits next to your
              other apps — own icon, full screen.
            </p>
            <Button className="mt-6 w-full rounded-md" onClick={() => setSheet(false)}>
              Got it
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
