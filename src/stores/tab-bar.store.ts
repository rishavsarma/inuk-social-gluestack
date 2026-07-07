import { create } from "zustand";

interface TabBarState {
  isHidden: boolean;
  setHidden: (hidden: boolean) => void;
}

export const useTabBarStore = create<TabBarState>((set) => ({
  isHidden: false,
  setHidden: (hidden) => set({ isHidden: hidden }),
}));
