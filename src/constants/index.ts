import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const THEMES = [
  { id: "light" as const, labelKey: "settings.theme_light" },
  { id: "dark" as const, labelKey: "settings.theme_dark" },
  { id: "system" as const, labelKey: "settings.theme_system" },
] as const;

export const LANGUAGES = [
  { id: "en" as const, labelKey: "settings.lang_en" },
  { id: "hi" as const, labelKey: "settings.lang_hi" },
] as const;

export const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
] as const;

/** Matches the `--theme` accent token in globals.css — for native props
 * (e.g. Switch trackColor) that need a runtime color value, not a class. */
export const THEME_ACCENT_COLOR = "rgb(192, 57, 42)";

export const POST_CONSTANTS = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  HERO_HEIGHT: SCREEN_WIDTH * 1.1,
};
