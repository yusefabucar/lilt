import { createServerFn } from "@tanstack/react-start";
import { guessFromText } from "./lexicon";
import type { IdentifyResult } from "./types";

const ACCENT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    language: { type: "string" },
    region: { type: "string" },
    locality: { type: "string" },
    country: { type: "string" },
    confidence: { type: "number" },
    cues: { type: "array", items: { type: "string" } },
    notes: { type: "string" },
  },
  required: ["language", "region", "locality", "country", "confidence", "cues", "notes"],
} as const;

type GrokAccent = {
  language: string;
  region: string;
  locality: string;
  country: string;
  confidence: number;
  cues: string[];
  notes: string;
};

type SttResponse = {
  text?: string;
  language?: string;
  duration?: number;
  words?: { text?: string; start?: number; end?: number }[];
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function extFor(mime: string): string {
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  if (mime.includes("mp4") || mime.includes("m4a")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("flac")) return "flac";
  return "webm";
}

async function transcribe(apiKey: string, audioBase64: string, mimeType: string): Promise<SttResponse> {
  const buf = Buffer.from(audioBase64, "base64");
  if (buf.length < 200) return {};
  if (buf.length > 1_800_000) throw new Error("Clip is too long. Keep it under eight seconds.");

  const form = new FormData();
  form.append("format", "true");
  form.append("language", "en");
  const file = new Blob([buf], { type: mimeType || "audio/webm" });
  form.append("file", file, `clip.${extFor(mimeType)}`);

  const res = await fetch("https://api.x.ai/v1/stt", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Transcription failed (${res.status})${detail ? `: ${detail.slice(0, 160)}` : ""}`);
  }
  return (await res.json()) as SttResponse;
}

function wordsPerMinute(stt: SttResponse, durationMs?: number): number | null {
  const words = (stt.words ?? []).filter((w) => w.text);
  if (words.length >= 4 && typeof words[0]?.start === "number" && typeof words[words.length - 1]?.end === "number") {
    const span = (words[words.length - 1]!.end! - words[0]!.start!) / 60;
    if (span > 0.04) return Math.round(words.length / span);
  }
  const text = stt.text?.trim() ?? "";
  const n = text.split(/\s+/).filter(Boolean).length;
  const minutes = (durationMs ?? (stt.duration ? stt.duration * 1000 : 0)) / 60000;
  if (n >= 4 && minutes > 0.04) return Math.round(n / minutes);
  return null;
}

async function classifyWithGrok(args: {
  apiKey: string;
  transcript: string;
  language: string;
  wpm: number | null;
  lex: ReturnType<typeof guessFromText>;
}): Promise<GrokAccent | null> {
  const { apiKey, transcript, language, wpm, lex } = args;
  const system = `You are a forensic dialectologist. Identify the speaker's accent from a transcript and cadence notes.
Two geographic grains — never mix them:
- region (FREE, general vicinity): metro or region a stranger would get. Examples: "New York", "American South", "Greater London", "New England", "US Midwest", "Northern England", "Scotland", "Ireland", "Australia", "Canada". Never a borough, neighborhood, or street. Never "Brooklyn".
- locality (PREMIUM, neighborhood): the pin — borough or neighborhood plus city. Examples: "Brooklyn, NY", "East New York, Brooklyn", "Southie, Boston, MA", "Hackney, East London", "South Philly, PA", "Little Havana, Miami". Must be strictly more specific than region. If evidence is thin, still name the most likely neighborhood or borough and lower confidence.
- cues: 2–4 short linguistic tells only. No place names in cues (those belong in locality).
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
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.2,
      max_tokens: 500,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "accent_id", strict: true, schema: ACCENT_SCHEMA },
      },
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = body.choices?.[0]?.message?.content;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GrokAccent;
    if (!parsed.region || !parsed.locality) return null;
    parsed.confidence = clamp(Number(parsed.confidence) || 0.4, 0.05, 0.97);
    parsed.cues = Array.isArray(parsed.cues) ? parsed.cues.slice(0, 4).map(String) : [];
    return parsed;
  } catch {
    return null;
  }
}

export const identifyAccent = createServerFn({ method: "POST" })
  .validator((input: { audioBase64?: string; mimeType?: string; transcriptHint?: string; durationMs?: number }) => input)
  .handler(async ({ data }): Promise<IdentifyResult> => {
    const hint = (data.transcriptHint ?? "").trim();
    const apiKey = process.env.XAI_API_KEY;

    let transcript = hint;
    let language = "en";
    let stt: SttResponse = {};

    try {
      if (data.audioBase64 && apiKey) {
        stt = await transcribe(apiKey, data.audioBase64, data.mimeType || "audio/webm");
        const spoken = (stt.text ?? "").trim();
        if (spoken) transcript = spoken;
        if (stt.language) language = stt.language;
      }
    } catch (e) {
      if (!hint) {
        return { ok: false, error: e instanceof Error ? e.message : "Could not read the clip." };
      }
    }

    if (!transcript) {
      return { ok: false, error: "No speech in that clip. Say the line, or talk for a few seconds." };
    }

    const lex = guessFromText(transcript);
    const wpm = wordsPerMinute(stt, data.durationMs);

    if (apiKey) {
      try {
        const model = await classifyWithGrok({ apiKey, transcript, language, wpm, lex });
        if (model) {
          return {
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
            source: "model",
          };
        }
      } catch {
        // fall through to lexicon
      }
    }

    return {
      ok: true,
      transcript,
      language,
      region: lex.region,
      locality: lex.locality,
      country: lex.country,
      confidence: lex.confidence,
      cues: lex.cues,
      notes: apiKey
        ? "Model unavailable on this pass — using lexical tells only."
        : "Voice model is offline here, so this read is from the words themselves.",
      wpm,
      source: "lexicon",
    };
  });
