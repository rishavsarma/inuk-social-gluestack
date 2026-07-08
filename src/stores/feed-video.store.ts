import { create } from "zustand";

const ACTIVE_VISIBILITY_THRESHOLD = 0.6;

interface FeedVideoState {
  activeVideoId: string | null;
  visibility: Record<string, number>;
  reportVisibility: (id: string, ratio: number) => void;
  removeVideo: (id: string) => void;
}

function pickActiveVideoId(visibility: Record<string, number>) {
  let bestId: string | null = null;
  let bestRatio = ACTIVE_VISIBILITY_THRESHOLD;
  for (const id in visibility) {
    if (visibility[id] >= bestRatio) {
      bestRatio = visibility[id];
      bestId = id;
    }
  }
  return bestId;
}

export const useFeedVideoStore = create<FeedVideoState>((set, get) => ({
  activeVideoId: null,
  visibility: {},
  reportVisibility: (id, ratio) => {
    const visibility = { ...get().visibility, [id]: ratio };
    set({ visibility, activeVideoId: pickActiveVideoId(visibility) });
  },
  removeVideo: (id) => {
    const visibility = { ...get().visibility };
    delete visibility[id];
    set({ visibility, activeVideoId: pickActiveVideoId(visibility) });
  },
}));
