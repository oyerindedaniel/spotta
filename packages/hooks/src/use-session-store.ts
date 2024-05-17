import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SessionData } from "@repo/types";

interface SessionStore {
  data: SessionData;
  setData: (data: SessionData) => void;
  updateData: (data: Partial<SessionData>) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      data: {
        refreshToken: "",
        sessionId: "",
        ttl: undefined,
      },
      setData: (data) => set({ data }),
      updateData: (data) =>
        set((state) => ({ data: { ...state.data, ...data } })),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
