import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface SettingState {
  theme: AppTheme;
  language: string;
  pushNotificationsEnabled: boolean;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: string) => void;
  setPushNotificationsEnabled: (enabled: boolean) => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      pushNotificationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setPushNotificationsEnabled: (pushNotificationsEnabled) =>
        set({ pushNotificationsEnabled }),
    }),
    {
      name: 'setting-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
