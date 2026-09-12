import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryItem, IdentifyOk } from "./types";

type LiltState = {
  premium: boolean;
  subscribedAt: string | null;
  history: HistoryItem[];
  subscribe: () => void;
  cancel: () => void;
  remember: (result: IdentifyOk) => void;
  clearHistory: () => void;
};

function nid(): string {
  return `h_${Math.random().toString(36).slice(2, 9)}`;
}

export const useLilt = create<LiltState>()(
  persist(
    (set, get) => ({
      premium: false,
      subscribedAt: null,
      history: [],
      subscribe: () => set({ premium: true, subscribedAt: new Date().toISOString() }),
      cancel: () => set({ premium: false, subscribedAt: null }),
      remember: (result) => {
        const item: HistoryItem = {
          id: nid(),
          at: new Date().toISOString(),
          transcript: result.transcript.slice(0, 180),
          region: result.region,
          locality: result.locality,
          country: result.country,
          confidence: result.confidence,
          cues: result.cues,
          source: result.source,
        };
        set({ history: [item, ...get().history].slice(0, 16) });
      },
      clearHistory: () => set({ history: [] }),
    }),
    { name: "accentify-v1" },
  ),
);
