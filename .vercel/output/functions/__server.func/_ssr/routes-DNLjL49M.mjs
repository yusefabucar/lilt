import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as DIAGNOSTIC_LINES } from "./lexicon-kdsV9Buk.mjs";
import { a as Lock, i as MapPin, r as Mic, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DNLjL49M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-bg-subtle text-fg shadow-border hover:bg-bg-elevated",
			ghost: "text-fg-muted hover:text-fg hover:bg-bg-subtle"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function isStandalone() {
	return window.matchMedia("(display-mode: standalone)").matches || Boolean(navigator.standalone);
}
function isIos() {
	const ua = navigator.userAgent;
	return /iPad|iPhone|iPod/i.test(ua) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
function InstallApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [installed, setInstalled] = (0, import_react.useState)(false);
	const [deferred, setDeferred] = (0, import_react.useState)(null);
	const [sheet, setSheet] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
		setInstalled(isStandalone());
		const onPrompt = (e) => {
			e.preventDefault();
			setDeferred(e);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "secondary",
		className: "w-full rounded-md",
		onClick: () => void onInstall(),
		children: "Get the app"
	}), sheet ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 grid place-items-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-bg/80",
			"aria-label": "Close",
			onClick: () => setSheet(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-labelledby": "install-title",
			className: "relative z-10 w-full max-w-md rounded-xl bg-bg-elevated p-6 shadow-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setSheet(false),
					className: "absolute right-4 top-4 grid size-11 place-items-center rounded-md text-fg-muted hover:text-fg",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle",
					children: "Home screen"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "install-title",
					className: "mt-2 font-display text-3xl tracking-tight",
					children: "ACCENTIFY on your phone"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-fg-muted",
					children: "iPhone: Safari → Share → Add to Home Screen. Android: Chrome → Install app. It sits next to your other apps — own icon, full screen."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full rounded-md",
					onClick: () => setSheet(false),
					children: "Got it"
				})
			]
		})]
	}) : null] });
}
function ListenOrb({ state, levels, remainingMs, onPress }) {
	const live = state === "recording";
	const busy = state === "analyzing" || state === "requesting";
	const label = state === "recording" ? "Stop" : state === "analyzing" ? "Listening" : state === "requesting" ? "Allow mic" : "Listen";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid place-items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("orb-ring", live && "orb-ring-live"),
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("orb-ring orb-ring-2", live && "orb-ring-live"),
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onPress,
				disabled: busy,
				"aria-label": label,
				"aria-pressed": live,
				className: cn("relative z-10 grid size-44 place-items-center rounded-full bg-accent text-accent-fg shadow-[0_0_0_1px_rgb(241_236_227_/_0.18),0_24px_60px_rgb(0_0_0_/_0.45)] transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] sm:size-52", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50", "disabled:opacity-70", live && "scale-[0.98]", busy && "cursor-wait"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex flex-col items-center gap-2",
					children: [
						live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wave, { levels }) : busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orb-spin size-9 rounded-full border-2 border-accent-fg/20 border-t-accent-fg" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {
							className: "size-8",
							strokeWidth: 1.6
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg tracking-tight",
							children: label
						}),
						live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-xs tabular-nums text-accent-fg/70",
							children: [(remainingMs / 1e3).toFixed(1), "s"]
						}) : null
					]
				})
			})
		]
	});
}
function Wave({ levels }) {
	const bars = levels.length ? levels : Array.from({ length: 24 }, () => .12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flex h-8 items-end gap-[3px]",
		"aria-hidden": true,
		children: bars.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-[3px] rounded-full bg-accent-fg",
			style: { height: `${Math.round(8 + v * 24)}px` }
		}, i))
	});
}
function Paywall({ open, busy, error, onClose, onSubscribe }) {
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 grid place-items-end sm:place-items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-bg/70",
			"aria-label": "Close",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-labelledby": "paywall-title",
			className: "relative z-10 w-full max-w-md rounded-t-xl bg-bg-elevated p-6 shadow-border sm:rounded-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "absolute right-4 top-4 grid size-11 place-items-center rounded-md text-fg-muted hover:text-fg",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle",
					children: "Pinpoint"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "paywall-title",
					className: "mt-2 font-display text-3xl tracking-tight",
					children: "$0.99 a month"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-fg-muted",
					children: "Free ACCENTIFY names the vicinity — New York, the American South, Greater London. Pinpoint names the neighborhood: Brooklyn, NY, Southie, Hackney."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-5 space-y-2 text-sm text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-md bg-bg-subtle px-3 py-2 shadow-border",
							children: "Neighborhood on every read — Brooklyn, NY, not just New York"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-md bg-bg-subtle px-3 py-2 shadow-border",
							children: "Billed $0.99 each month until you cancel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-md bg-bg-subtle px-3 py-2 shadow-border",
							children: "Payouts go to the connected bank, not a middle wallet"
						})
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-fg-muted",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl tracking-tight",
						children: "$0.99"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-fg-subtle",
						children: "per month"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "rounded-md px-6",
						onClick: onSubscribe,
						disabled: busy,
						children: busy ? "Opening checkout" : "Pay $0.99/mo"
					})]
				})
			]
		})]
	});
}
function ResultPanel({ result, premium, onUnlock, onAgain }) {
	const pct = Math.round(result.confidence * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto w-full max-w-lg animate-in",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-bg-elevated p-5 shadow-border sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle",
					children: "Vicinity"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl leading-tight tracking-tight text-fg sm:text-4xl",
					children: result.region
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-fg-muted",
					children: result.country
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle",
						children: "Neighborhood"
					}), premium ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 flex items-start gap-2 font-display text-xl text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-1 size-4 shrink-0 text-fg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: result.locality })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onUnlock,
						className: "mt-2 flex w-full items-center justify-between gap-3 rounded-lg bg-bg-subtle px-4 py-3 text-left shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-lg blur-[6px] select-none",
							"aria-hidden": true,
							children: "the neighborhood"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-fg-muted",
							children: "Neighborhood · $0.99/mo"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4 shrink-0 text-fg-muted" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle",
							children: "Confidence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-sm tabular-nums text-fg",
							children: [pct, "%"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-1.5 overflow-hidden rounded-full bg-bg-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-accent",
							style: { width: `${pct}%` }
						})
					})]
				}),
				premium && result.cues.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-2",
					children: result.cues.map((cue) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm leading-relaxed text-fg-muted",
						children: cue
					}, cue))
				}) : null,
				result.transcript ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: cn("mt-5 border-t border-border pt-4 text-sm leading-relaxed text-fg-muted"),
					children: [
						"“",
						result.transcript,
						"”"
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "flex-1 rounded-md",
						onClick: onAgain,
						children: "Listen again"
					}), !premium ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "flex-1 rounded-md",
						onClick: onUnlock,
						children: "Unlock Pinpoint"
					}) : null]
				})
			]
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var identifyAccent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d1919bef372c0860392b963ff18b67806cc7c6512563d01840fb21c47e54a8a3"));
var startPinpointCheckout = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("67144286fdde82237a83ad3ea269ff4933f513a32b436772cbf45f6317c04f57"));
var confirmPinpointCheckout = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("16096b5d8c07a59148c4cd218696b3f476c326ca2b33f7d4869c5a114663c8f5"));
function pickMime() {
	if (typeof MediaRecorder === "undefined") return "";
	return [
		"audio/webm;codecs=opus",
		"audio/webm",
		"audio/mp4",
		"audio/ogg;codecs=opus",
		"audio/ogg"
	].find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}
function blobToBase64(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const text = String(reader.result ?? "");
			const i = text.indexOf(",");
			resolve(i >= 0 ? text.slice(i + 1) : text);
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read the clip."));
		reader.readAsDataURL(blob);
	});
}
function levelsFromAnalyser(analyser, bins = 24) {
	const buf = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(buf);
	const out = [];
	const step = Math.max(1, Math.floor(buf.length / bins));
	for (let i = 0; i < bins; i++) {
		let sum = 0;
		for (let j = 0; j < step; j++) sum += buf[i * step + j] ?? 0;
		out.push(Math.min(1, sum / step / 180));
	}
	return out;
}
function startSpeechHint(onText) {
	const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
	if (!SR) return () => {};
	const rec = new SR();
	rec.continuous = true;
	rec.interimResults = true;
	rec.lang = "en-US";
	rec.onresult = (ev) => {
		const parts = [];
		for (let i = 0; i < ev.results.length; i++) {
			const t = ev.results[i]?.[0]?.transcript;
			if (t) parts.push(t);
		}
		onText(parts.join(" ").trim());
	};
	try {
		rec.start();
	} catch {
		return () => {};
	}
	return () => {
		try {
			rec.stop();
		} catch {
			rec.abort();
		}
	};
}
function nid() {
	return `h_${Math.random().toString(36).slice(2, 9)}`;
}
var useLilt = create()(persist((set, get) => ({
	premium: false,
	subscribedAt: null,
	history: [],
	subscribe: () => set({
		premium: true,
		subscribedAt: (/* @__PURE__ */ new Date()).toISOString()
	}),
	cancel: () => set({
		premium: false,
		subscribedAt: null
	}),
	remember: (result) => {
		set({ history: [{
			id: nid(),
			at: (/* @__PURE__ */ new Date()).toISOString(),
			transcript: result.transcript.slice(0, 180),
			region: result.region,
			locality: result.locality,
			country: result.country,
			confidence: result.confidence,
			cues: result.cues,
			source: result.source
		}, ...get().history].slice(0, 16) });
	},
	clearHistory: () => set({ history: [] })
}), { name: "accentify-v1" }));
var MAX_MS = 8e3;
var MIN_MS = 2200;
function LiltApp() {
	const premium = useLilt((s) => s.premium);
	const subscribe = useLilt((s) => s.subscribe);
	const remember = useLilt((s) => s.remember);
	const history = useLilt((s) => s.history);
	const [state, setState] = (0, import_react.useState)("idle");
	const [levels, setLevels] = (0, import_react.useState)(() => Array.from({ length: 24 }, () => .12));
	const [remainingMs, setRemainingMs] = (0, import_react.useState)(MAX_MS);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [paywall, setPaywall] = (0, import_react.useState)(false);
	const [payBusy, setPayBusy] = (0, import_react.useState)(false);
	const [payError, setPayError] = (0, import_react.useState)(null);
	const [typed, setTyped] = (0, import_react.useState)("");
	const line = DIAGNOSTIC_LINES[0];
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const chunksRef = (0, import_react.useRef)([]);
	const streamRef = (0, import_react.useRef)(null);
	const ctxRef = (0, import_react.useRef)(null);
	const rafRef = (0, import_react.useRef)(0);
	const startedAt = (0, import_react.useRef)(0);
	const hintRef = (0, import_react.useRef)("");
	const stopHint = (0, import_react.useRef)(() => {});
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const q = new URLSearchParams(window.location.search);
		const sessionId = q.get("session_id");
		if (q.get("checkout") === "cancel") {
			toast("Checkout canceled. Pinpoint stays locked.");
			window.history.replaceState({}, "", "/");
		}
		if (sessionId) (async () => {
			const out = await confirmPinpointCheckout({ data: { sessionId } });
			window.history.replaceState({}, "", "/");
			if (out.ok) {
				subscribe();
				toast("Pinpoint is live. $0.99/mo is on the card.");
			} else toast(out.error);
		})();
	}, [subscribe]);
	(0, import_react.useEffect)(() => {
		return () => teardown();
	}, []);
	function teardown() {
		cancelAnimationFrame(rafRef.current);
		stopHint.current();
		recRef.current = null;
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
		ctxRef.current?.close();
		ctxRef.current = null;
	}
	function idle() {
		teardown();
		setState("idle");
		setLevels(Array.from({ length: 24 }, () => .12));
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
			const stream = await navigator.mediaDevices.getUserMedia({ audio: {
				echoCancellation: true,
				noiseSuppression: true
			} });
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
			ctx.resume();
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
	async function finish(mimeType) {
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
			await runIdentify({
				audioBase64: blob.size > 400 ? await blobToBase64(blob) : void 0,
				mimeType,
				transcriptHint: hintRef.current,
				durationMs: elapsed
			});
		} catch (e) {
			setState("error");
			setError(e instanceof Error ? e.message : "Could not place that voice.");
		}
	}
	async function runIdentify(input) {
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
	async function identifyTyped(raw) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 pb-16 pt-6 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl tracking-[0.12em] sm:text-2xl",
					children: "ACCENTIFY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-fg-subtle",
					children: [
						"Where ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-fg",
							children: "YOU"
						}),
						" from?"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (!premium) setPaywall(true);
					},
					className: "h-11 rounded-full bg-bg-elevated px-4 text-xs font-medium uppercase tracking-[0.14em] text-fg-muted shadow-border",
					children: mounted && premium ? "Pinpoint" : "Free"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex flex-1 flex-col items-center justify-center gap-8 py-10",
				children: [state !== "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListenOrb, {
					state,
					levels,
					remainingMs,
					onPress: () => void onOrb()
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg-muted",
							children: state === "recording" ? "Speak naturally. Tap again to stop." : state === "analyzing" ? "Placing the voice…" : "Tap and talk. Free hears the vicinity. Pinpoint names the neighborhood — Brooklyn, NY and the like."
						}),
						state === "idle" || state === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 font-display text-lg leading-snug text-fg",
							children: [
								"“",
								line,
								"”"
							]
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-fg-muted",
							children: error
						}) : null
					]
				})] }) : result ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultPanel, {
					result,
					premium,
					onUnlock: () => setPaywall(true),
					onAgain: () => {
						setResult(null);
						idle();
					}
				}) : null, state !== "recording" && state !== "analyzing" && state !== "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-lg flex-col items-stretch gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex w-full gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							identifyTyped(String(new FormData(e.currentTarget).get("spoken") ?? "") || typed);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "spoken",
							name: "spoken",
							value: typed,
							onChange: (e) => setTyped(e.target.value),
							placeholder: "Or type a sentence the way you’d say it",
							className: "h-11 min-w-0 flex-1 rounded-md bg-bg-elevated px-3 text-sm text-fg shadow-border outline-none placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-accent/40"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "secondary",
							className: "rounded-md",
							children: "Place"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallApp, {})]
				}) : null]
			}),
			mounted && history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-fg-subtle",
					children: "Recent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: history.slice(0, 5).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-baseline justify-between gap-3 rounded-lg bg-bg-elevated px-4 py-3 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-fg",
								children: h.region
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-fg-subtle",
								children: premium ? h.locality : "Neighborhood locked"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "shrink-0 font-mono text-xs tabular-nums text-fg-muted",
							children: [Math.round(h.confidence * 100), "%"]
						})]
					}, h.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: state
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paywall, {
				open: paywall,
				busy: payBusy,
				error: payError,
				onClose: () => {
					if (!payBusy) setPaywall(false);
				},
				onSubscribe: () => void onSubscribe()
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiltApp, {});
}
//#endregion
export { Home as component };
