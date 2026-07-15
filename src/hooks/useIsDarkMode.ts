import { useColorScheme } from "react-native";

import { useSettingStore } from "@/stores/setting.store";

/** Resolves the stored theme preference against the OS scheme when it's
 * "system" — components comparing `theme === "dark"` directly render light
 * colors whenever the preference is "system", even on a dark OS. */
export function useIsDarkMode(): boolean {
  const theme = useSettingStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  return (theme === "system" ? systemColorScheme : theme) === "dark";
}
