import { create } from "zustand";

interface FeedVideoState {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export const useFeedVideoStore = create<FeedVideoState>((set) => ({
  activeVideoId: null,
  setActiveVideoId: (id) => set({ activeVideoId: id }),
}));
