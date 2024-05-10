import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SessionData {
  refreshToken: string;
  sessionId: string;
}

interface SessionStore {
  data: SessionData;
  setData: (data: SessionData) => void;
  updateData: (data: Partial<SessionData>) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      data: { refreshToken: "", sessionId: "" },
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
