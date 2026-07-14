import { create } from "zustand";

interface FollowState {
  overrides: Record<string, boolean>;
  setFollowOverride: (profileId: string, isFollowing: boolean) => void;
}

/** Optimistic follow/unfollow state keyed by profile id, shared across the
 * Feed and Post Detail screens so a follow action taken on one screen is
 * reflected on the other without waiting on a refetch. */
export const useFollowStore = create<FollowState>((set) => ({
  overrides: {},
  setFollowOverride: (profileId, isFollowing) =>
    set((state) => ({
      overrides: { ...state.overrides, [profileId]: isFollowing },
    })),
}));
