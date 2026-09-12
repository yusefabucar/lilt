export function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/ogg"];
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const i = text.indexOf(",");
      resolve(i >= 0 ? text.slice(i + 1) : text);
    };
    reader.onerror = () => reject(new Error("Could not read the clip."));
    reader.readAsDataURL(blob);
  });
}

export function levelsFromAnalyser(analyser: AnalyserNode, bins = 24): number[] {
  const buf = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buf);
  const out: number[] = [];
  const step = Math.max(1, Math.floor(buf.length / bins));
  for (let i = 0; i < bins; i++) {
    let sum = 0;
    for (let j = 0; j < step; j++) sum += buf[i * step + j] ?? 0;
    out.push(Math.min(1, sum / step / 180));
  }
  return out;
}

type Recog = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((ev: { results: ArrayLike<{ 0?: { transcript?: string } }> }) => void) | null;
};

export function startSpeechHint(onText: (text: string) => void): () => void {
  const SR =
    (window as unknown as { SpeechRecognition?: new () => Recog; webkitSpeechRecognition?: new () => Recog })
      .SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: new () => Recog }).webkitSpeechRecognition;
  if (!SR) return () => {};
  const rec = new SR();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  rec.onresult = (ev) => {
    const parts: string[] = [];
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
