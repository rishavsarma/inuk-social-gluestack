import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AudienceOption = "everyone" | "following" | "no_one";
export type IdVerificationStatus = "not_submitted" | "pending" | "verified";

interface AccountSettingsState {
  // Notifications — per-type & channel, no backend field yet
  likesCommentsEnabled: boolean;
  mentionsFollowsEnabled: boolean;
  contestsQuizzesEnabled: boolean;
  sparksBadgesEnabled: boolean;
  moderationOutcomesEnabled: boolean;
  weeklyDigestEnabled: boolean;
  quietHoursEnabled: boolean;
  setNotificationPref: (
    key:
      | "likesCommentsEnabled"
      | "mentionsFollowsEnabled"
      | "contestsQuizzesEnabled"
      | "sparksBadgesEnabled"
      | "moderationOutcomesEnabled"
      | "weeklyDigestEnabled"
      | "quietHoursEnabled",
    value: boolean,
  ) => void;

  // Privacy — "who can" audience pickers + visibility toggles
  commentAudience: AudienceOption;
  mentionAudience: AudienceOption;
  showLocationOnPosts: boolean;
  discoverableInSearch: boolean;
  keepCollectionsPrivate: boolean;
  setCommentAudience: (value: AudienceOption) => void;
  setMentionAudience: (value: AudienceOption) => void;
  setShowLocationOnPosts: (value: boolean) => void;
  setDiscoverableInSearch: (value: boolean) => void;
  setKeepCollectionsPrivate: (value: boolean) => void;

  // Data & privacy consents (DPDP)
  aiStoryConsent: boolean;
  marketingConsent: boolean;
  setAiStoryConsent: (value: boolean) => void;
  setMarketingConsent: (value: boolean) => void;

  // Verification
  idVerificationStatus: IdVerificationStatus;
  setIdVerificationStatus: (status: IdVerificationStatus) => void;
}

export const useAccountSettingsStore = create<AccountSettingsState>()(
  persist(
    (set) => ({
      likesCommentsEnabled: true,
      mentionsFollowsEnabled: true,
      contestsQuizzesEnabled: true,
      sparksBadgesEnabled: true,
      moderationOutcomesEnabled: true,
      weeklyDigestEnabled: false,
      quietHoursEnabled: true,
      setNotificationPref: (key, value) => set({ [key]: value }),

      commentAudience: "everyone",
      mentionAudience: "following",
      showLocationOnPosts: true,
      discoverableInSearch: true,
      keepCollectionsPrivate: true,
      setCommentAudience: (commentAudience) => set({ commentAudience }),
      setMentionAudience: (mentionAudience) => set({ mentionAudience }),
      setShowLocationOnPosts: (showLocationOnPosts) =>
        set({ showLocationOnPosts }),
      setDiscoverableInSearch: (discoverableInSearch) =>
        set({ discoverableInSearch }),
      setKeepCollectionsPrivate: (keepCollectionsPrivate) =>
        set({ keepCollectionsPrivate }),

      aiStoryConsent: true,
      marketingConsent: false,
      setAiStoryConsent: (aiStoryConsent) => set({ aiStoryConsent }),
      setMarketingConsent: (marketingConsent) => set({ marketingConsent }),

      idVerificationStatus: "not_submitted",
      setIdVerificationStatus: (idVerificationStatus) =>
        set({ idVerificationStatus }),
    }),
    {
      name: "account-settings-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
