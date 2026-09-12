import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InstallApp } from "@/components/lilt/install-app";
import { ListenOrb } from "@/components/lilt/listen-orb";
import { Paywall } from "@/components/lilt/paywall";
import { ResultPanel } from "@/components/lilt/result-panel";
import { identifyAccent } from "@/lib/lilt/identify";
import { confirmPinpointCheckout, startPinpointCheckout } from "@/lib/lilt/checkout";
import { blobToBase64, levelsFromAnalyser, pickMime, startSpeechHint } from "@/lib/lilt/audio";
import { DIAGNOSTIC_LINES } from "@/lib/lilt/lexicon";
import { useLilt } from "@/lib/lilt/store";
import type { IdentifyOk, ListenState } from "@/lib/lilt/types";

const MAX_MS = 8000;
const MIN_MS = 2200;

export function LiltApp() {
  const premium = useLilt((s) => s.premium);
  const subscribe = useLilt((s) => s.subscribe);
  const remember = useLilt((s) => s.remember);
  const history = useLilt((s) => s.history);

  const [state, setState] = useState<ListenState>("idle");
  const [levels, setLevels] = useState<number[]>(() => Array.from({ length: 24 }, () => 0.12));
  const [remainingMs, setRemainingMs] = useState(MAX_MS);
  const [result, setResult] = useState<IdentifyOk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [payBusy, setPayBusy] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const line = DIAGNOSTIC_LINES[0]!;
  const [mounted, setMounted] = useState(false);

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);
  const startedAt = useRef(0);
  const hintRef = useRef("");
  const stopHint = useRef<() => void>(() => {});

  useEffect(() => {
    setMounted(true);
    const q = new URLSearchParams(window.location.search);
    const sessionId = q.get("session_id");
    const checkout = q.get("checkout");
    if (checkout === "cancel") {
      toast("Checkout canceled. Pinpoint stays locked.");
      window.history.replaceState({}, "", "/");
    }
    if (sessionId) {
      void (async () => {
        const out = await confirmPinpointCheckout({ data: { sessionId } });
        window.history.replaceState({}, "", "/");
        if (out.ok) {
          subscribe();
          toast("Pinpoint is live. $0.99/mo is on the card.");
        } else {
          toast(out.error);
        }
      })();
    }
  }, [subscribe]);

  useEffect(() => {
    return () => teardown();
  }, []);

  function teardown() {
    cancelAnimationFrame(rafRef.current);
    stopHint.current();
    recRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
  }

  function idle() {
    teardown();
    setState("idle");
    setLevels(Array.from({ length: 24 }, () => 0.12));
    setRemainingMs(MAX_MS);
  }

  async function onOrb() {
    if (state === "analyzing" || state === "requesting") return;
    if (state === "recording") {
      recRef.current?.stop();
      return;
    }
    setResult(null);
    setError(null);
    setState("requesting");
    hintRef.current = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      const mime = pickMime();
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onerror = () => {
        setError("The recorder failed. Try typing a sentence.");
        setState("error");
        teardown();
      };
      rec.onstop = () => void finish(rec.mimeType);
      rec.start();
      startedAt.current = Date.now();
      setState("recording");
      stopHint.current = startSpeechHint((t) => {
        hintRef.current = t;
      });
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      void ctx.resume();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser);
      const tick = () => {
        const elapsed = Date.now() - startedAt.current;
        setRemainingMs(Math.max(0, MAX_MS - elapsed));
        setLevels(levelsFromAnalyser(analyser));
        if (elapsed >= MAX_MS) {
          rec.stop();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setState("error");
      setError("Microphone is blocked in this window. Type a sentence the way you’d say it, or allow the mic and try again.");
    }
  }

  async function finish(mimeType: string) {
    cancelAnimationFrame(rafRef.current);
    stopHint.current();
    const elapsed = Date.now() - startedAt.current;
    const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recRef.current = null;
    if (elapsed < MIN_MS && !hintRef.current) {
      setState("error");
      setError("That was too short. Hold for a couple of seconds, or read the line below.");
      return;
    }
    setState("analyzing");
    try {
      const audioBase64 = blob.size > 400 ? await blobToBase64(blob) : undefined;
      await runIdentify({ audioBase64, mimeType, transcriptHint: hintRef.current, durationMs: elapsed });
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Could not place that voice.");
    }
  }

  async function runIdentify(input: {
    audioBase64?: string;
    mimeType?: string;
    transcriptHint?: string;
    durationMs?: number;
  }) {
    setState("analyzing");
    setError(null);
    const out = await identifyAccent({ data: input });
    if (!out.ok) {
      setState("error");
      setError(out.error);
      return;
    }
    setResult(out);
    remember(out);
    setState("result");
  }

  async function identifyTyped(raw?: string) {
    const text = (raw ?? typed).trim();
    if (text.length < 8) {
      toast("Give it a full sentence.");
      return;
    }
    setResult(null);
    try {
      await runIdentify({ transcriptHint: text });
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Could not place that sentence.");
    }
  }

  async function onSubscribe() {
    setPayBusy(true);
    setPayError(null);
    try {
      const out = await startPinpointCheckout({ data: { origin: window.location.origin } });
      if (!out.ok) {
        setPayError(out.error);
        return;
      }
      window.location.assign(out.url);
    } catch (e) {
      setPayError(e instanceof Error ? e.message : "Could not open checkout.");
    } finally {
      setPayBusy(false);
    }
  }

  const showOrb = state !== "result";

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-16 pt-6 sm:px-8">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-xl tracking-[0.12em] sm:text-2xl">ACCENTIFY</p>
          <p className="text-xs text-fg-subtle">
            Where <span className="font-medium text-fg">YOU</span> from?
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!premium) setPaywall(true);
          }}
          className="h-11 rounded-full bg-bg-elevated px-4 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted shadow-border"
        >
          {mounted && premium ? "Pinpoint" : "Free"}
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 py-10">
        {showOrb ? (
          <>
            <ListenOrb state={state} levels={levels} remainingMs={remainingMs} onPress={() => void onOrb()} />
            <div className="max-w-md text-center">
              <p className="text-sm text-fg-muted">
                {state === "recording"
                  ? "Speak naturally. Tap again to stop."
                  : state === "analyzing"
                    ? "Placing the voice…"
                    : "Tap and talk. Free hears the vicinity. Pinpoint names the neighborhood — Brooklyn, NY and the like."}
              </p>
              {state === "idle" || state === "error" ? (
                <p className="mt-4 font-display text-lg leading-snug text-fg">“{line}”</p>
              ) : null}
              {error ? <p className="mt-4 text-sm text-fg-muted">{error}</p> : null}
            </div>
          </>
        ) : result ? (
          <ResultPanel
            result={result}
            premium={premium}
            onUnlock={() => setPaywall(true)}
            onAgain={() => {
              setResult(null);
              idle();
            }}
          />
        ) : null}

        {state !== "recording" && state !== "analyzing" && state !== "result" ? (
          <div className="flex w-full max-w-lg flex-col items-stretch gap-3">
            <form
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fromForm = String(new FormData(e.currentTarget).get("spoken") ?? "");
                void identifyTyped(fromForm || typed);
              }}
            >
              <input
                id="spoken"
                name="spoken"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Or type a sentence the way you’d say it"
                className="h-11 min-w-0 flex-1 rounded-md bg-bg-elevated px-3 text-sm text-fg shadow-border outline-none placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
              />
              <Button type="submit" variant="secondary" className="rounded-md">
                Place
              </Button>
            </form>
            <InstallApp />
          </div>
        ) : null}
      </main>

      {mounted && history.length > 0 ? (
        <section className="mt-auto">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle">Recent</p>
          <ul className="mt-3 space-y-2">
            {history.slice(0, 5).map((h) => (
              <li key={h.id} className="flex items-baseline justify-between gap-3 rounded-lg bg-bg-elevated px-4 py-3 shadow-border">
                <div className="min-w-0">
                  <p className="truncate text-sm text-fg">{h.region}</p>
                  <p className="truncate text-xs text-fg-subtle">
                    {premium ? h.locality : "Neighborhood locked"}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-xs tabular-nums text-fg-muted">
                  {Math.round(h.confidence * 100)}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {state}
      </p>

      <Paywall
        open={paywall}
        busy={payBusy}
        error={payError}
        onClose={() => {
          if (!payBusy) setPaywall(false);
        }}
        onSubscribe={() => void onSubscribe()}
      />
    </div>
  );
}
