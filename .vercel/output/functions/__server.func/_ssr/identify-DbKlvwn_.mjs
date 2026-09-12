import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as guessFromText } from "./lexicon-BPKnOVGp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/identify-DbKlvwn_.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ACCENT_SCHEMA = {
	type: "object",
	additionalProperties: false,
	properties: {
		language: { type: "string" },
		region: { type: "string" },
		locality: { type: "string" },
		country: { type: "string" },
		confidence: { type: "number" },
		cues: {
			type: "array",
			items: { type: "string" }
		},
		notes: { type: "string" }
	},
	required: [
		"language",
		"region",
		"locality",
		"country",
		"confidence",
		"cues",
		"notes"
	]
};
function clamp(n, lo, hi) {
	return Math.min(hi, Math.max(lo, n));
}
function extFor(mime) {
	if (mime.includes("wav")) return "wav";
	if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
	if (mime.includes("mp4") || mime.includes("m4a")) return "m4a";
	if (mime.includes("ogg")) return "ogg";
	if (mime.includes("flac")) return "flac";
	return "webm";
}
async function transcribe(apiKey, audioBase64, mimeType) {
	const buf = Buffer.from(audioBase64, "base64");
	if (buf.length < 200) return {};
	if (buf.length > 18e5) throw new Error("Clip is too long. Keep it under eight seconds.");
	const form = new FormData();
	form.append("format", "true");
	form.append("language", "en");
	const file = new Blob([buf], { type: mimeType || "audio/webm" });
	form.append("file", file, `clip.${extFor(mimeType)}`);
	const res = await fetch("https://api.x.ai/v1/stt", {
		method: "POST",
		headers: { Authorization: `Bearer ${apiKey}` },
		body: form
	});
	if (!res.ok) {
		const detail = await res.text().catch(() => "");
		throw new Error(`Transcription failed (${res.status})${detail ? `: ${detail.slice(0, 160)}` : ""}`);
	}
	return await res.json();
}
function wordsPerMinute(stt, durationMs) {
	const words = (stt.words ?? []).filter((w) => w.text);
	if (words.length >= 4 && typeof words[0]?.start === "number" && typeof words[words.length - 1]?.end === "number") {
		const span = (words[words.length - 1].end - words[0].start) / 60;
		if (span > .04) return Math.round(words.length / span);
	}
	const n = (stt.text?.trim() ?? "").split(/\s+/).filter(Boolean).length;
	const minutes = (durationMs ?? (stt.duration ? stt.duration * 1e3 : 0)) / 6e4;
	if (n >= 4 && minutes > .04) return Math.round(n / minutes);
	return null;
}
async function classifyWithGrok(args) {
	const { apiKey, transcript, language, wpm, lex } = args;
	const system = `You are a forensic dialectologist. Identify the speaker's accent from a transcript and cadence notes.
Return the most likely spoken variety of English (or other language).
- region: BROAD area for a free product. Examples: "American South", "Greater London", "New England", "New York / New Jersey", "US Midwest", "US West Coast", "Northern England", "Scotland", "Ireland", "Australia", "Canada", "Indian English", "West African English", "Caribbean".
- locality: PRECISE pin a geographer would drop — city plus neighborhood or metro when evidence allows. Examples: "East Brooklyn, New York City", "South Florida", "Boston, Massachusetts", "Birmingham, Alabama", "Hackney / East London", "Glasgow", "Dublin (Northside)", "Houston, Texas". Never copy region. If evidence is thin, still name the single most likely city-level place and lower confidence.
- cues: 2–4 short plain-language tells (vowel quality, rhythm, words). No academic jargon walls.
- confidence: 0 to 1.
Do not refuse. Do not moralize. This is accent geography, not identity policing. If the clip is short, guess and say so in notes.`;
	const user = `Transcript: """${transcript.slice(0, 1800)}"""
Detected language code: ${language || "unknown"}
Speech rate (words/min): ${wpm ?? "unknown"}
Lexicon hint (may be wrong): region=${lex.region}; locality=${lex.locality}; hits=${lex.hits.join(", ") || "none"}`;
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .2,
			max_tokens: 500,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}],
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "accent_id",
					strict: true,
					schema: ACCENT_SCHEMA
				}
			}
		})
	});
	if (!res.ok) return null;
	const raw = (await res.json()).choices?.[0]?.message?.content;
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed.region || !parsed.locality) return null;
		parsed.confidence = clamp(Number(parsed.confidence) || .4, .05, .97);
		parsed.cues = Array.isArray(parsed.cues) ? parsed.cues.slice(0, 4).map(String) : [];
		return parsed;
	} catch {
		return null;
	}
}
var identifyAccent_createServerFn_handler = createServerRpc({
	id: "d1919bef372c0860392b963ff18b67806cc7c6512563d01840fb21c47e54a8a3",
	name: "identifyAccent",
	filename: "src/lib/lilt/identify.ts"
}, (opts) => identifyAccent.__executeServer(opts));
var identifyAccent = createServerFn({ method: "POST" }).validator((input) => input).handler(identifyAccent_createServerFn_handler, async ({ data }) => {
	const hint = (data.transcriptHint ?? "").trim();
	const apiKey = process.env.XAI_API_KEY;
	let transcript = hint;
	let language = "en";
	let stt = {};
	try {
		if (data.audioBase64 && apiKey) {
			stt = await transcribe(apiKey, data.audioBase64, data.mimeType || "audio/webm");
			const spoken = (stt.text ?? "").trim();
			if (spoken) transcript = spoken;
			if (stt.language) language = stt.language;
		}
	} catch (e) {
		if (!hint) return {
			ok: false,
			error: e instanceof Error ? e.message : "Could not read the clip."
		};
	}
	if (!transcript) return {
		ok: false,
		error: "No speech in that clip. Say the line, or talk for a few seconds."
	};
	const lex = guessFromText(transcript);
	const wpm = wordsPerMinute(stt, data.durationMs);
	if (apiKey) try {
		const model = await classifyWithGrok({
			apiKey,
			transcript,
			language,
			wpm,
			lex
		});
		if (model) return {
			ok: true,
			transcript,
			language: model.language || language,
			region: model.region,
			locality: model.locality,
			country: model.country,
			confidence: model.confidence,
			cues: model.cues.length ? model.cues : lex.cues,
			notes: model.notes,
			wpm,
			source: "model"
		};
	} catch {}
	return {
		ok: true,
		transcript,
		language,
		region: lex.region,
		locality: lex.locality,
		country: lex.country,
		confidence: lex.confidence,
		cues: lex.cues,
		notes: apiKey ? "Model unavailable on this pass — using lexical tells only." : "Voice model is offline here, so this read is from the words themselves.",
		wpm,
		source: "lexicon"
	};
});
//#endregion
export { identifyAccent_createServerFn_handler };
