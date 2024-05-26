import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SessionData } from "@repo/types";

interface SessionStore {
  data: SessionData;
  setData: (data: SessionData) => void;
  updateData: (data: Partial<SessionData>) => void;
  clearData: () => void;
}

const initialState: SessionData = {
  refreshToken: "",
  sessionId: "",
  ttl: undefined,
  userId: "",
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      data: initialState,
      setData: (data) => set({ data }),
      updateData: (data) =>
        set((state) => ({ data: { ...state.data, ...data } })),
      clearData: () => set({ data: initialState }),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
