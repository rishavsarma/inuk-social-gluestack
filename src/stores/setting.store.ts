import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface SettingState {
  theme: AppTheme;
  language: string;
  hasCompletedOnboarding: boolean;
  isProMember: boolean;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: string) => void;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setIsProMember: (isProMember: boolean) => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      hasCompletedOnboarding: false,
      isProMember: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
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
