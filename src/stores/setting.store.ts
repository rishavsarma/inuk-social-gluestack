import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface SettingState {
  theme: AppTheme;
  language: string;
  pushNotificationsEnabled: boolean;
  votingAlertsEnabled: boolean;
  hasCompletedOnboarding: boolean;
  isProMember: boolean;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: string) => void;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  setVotingAlertsEnabled: (enabled: boolean) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setIsProMember: (isProMember: boolean) => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      pushNotificationsEnabled: true,
      votingAlertsEnabled: true,
      hasCompletedOnboarding: false,
      isProMember: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setPushNotificationsEnabled: (pushNotificationsEnabled) =>
        set({ pushNotificationsEnabled }),
      setVotingAlertsEnabled: (votingAlertsEnabled) =>
        set({ votingAlertsEnabled }),
      setHasCompletedOnboarding: (hasCompletedOnboarding) =>
        set({ hasCompletedOnboarding }),
      setIsProMember: (isProMember) => set({ isProMember }),
    }),
    {
      name: 'setting-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
