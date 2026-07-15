import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface BlockedProfileItem {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  type: "blocked" | "muted";
}

interface BlockedState {
  entries: BlockedProfileItem[];
  unblock: (id: string) => void;
}

export const useBlockedStore = create<BlockedState>()(
  persist(
    (set) => ({
      entries: [],
      unblock: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
    }),
    {
      name: "blocked-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
