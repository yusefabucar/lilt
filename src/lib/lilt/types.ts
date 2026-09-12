export type IdentifyOk = {
  ok: true;
  transcript: string;
  language: string;
  region: string;
  locality: string;
  country: string;
  confidence: number;
  cues: string[];
  notes: string;
  wpm: number | null;
  source: "model" | "lexicon";
};

export type IdentifyErr = { ok: false; error: string };

export type IdentifyResult = IdentifyOk | IdentifyErr;

export type HistoryItem = {
  id: string;
  at: string;
  transcript: string;
  region: string;
  locality: string;
  country: string;
  confidence: number;
  cues: string[];
  source: "model" | "lexicon";
};

export type ListenState = "idle" | "requesting" | "recording" | "analyzing" | "result" | "error";
