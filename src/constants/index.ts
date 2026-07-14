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

/** Mirrors the `--primary`/`--card`/`--foreground`/`--border`/`--background`
 * tokens in globals.css — for consumers that can't read NativeWind classes
 * or CSS custom properties (React Navigation's ThemeProvider, third-party
 * components taking inline style colors like OtpInput). Update alongside
 * globals.css if those tokens ever change. */
export const THEME_RGB = {
  light: {
    primary: "rgb(207, 43, 19)",
    card: "rgb(255, 255, 255)",
    foreground: "rgb(10, 10, 10)",
    border: "rgb(229, 229, 229)",
    background: "rgb(242, 242, 247)",
    mutedForeground: "rgb(108, 108, 112)",
  },
  dark: {
    primary: "rgb(207, 43, 19)",
    card: "rgb(15, 15, 15)",
    foreground: "rgb(250, 250, 250)",
    border: "rgb(46, 46, 46)",
    background: "rgb(10, 10, 10)",
    mutedForeground: "rgb(142, 142, 147)",
  },
} as const;

/** Shared icon accent tints for menu/settings rows (profile-menu.tsx,
 * settings/index.tsx) — each row picks one to color its leading icon and
 * icon background consistently instead of retyping the same hex values. */
export const MENU_ROW_TINTS = {
  blue: {
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-[#3B82F6]",
  },
  slate: {
    iconBg: "bg-slate-500/10 dark:bg-slate-500/20",
    iconColor: "text-[#64748B]",
  },
  amber: {
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-[#F59E0B]",
  },
  violet: {
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    iconColor: "text-[#8B5CF6]",
  },
  red: {
    iconBg: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-[#EF4444]",
  },
  green: {
    iconBg: "bg-green-500/10 dark:bg-green-500/20",
    iconColor: "text-[#22C55E]",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconColor: "text-[#6366F1]",
  },
  cyan: {
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    iconColor: "text-[#06B6D4]",
  },
} as const;

export const POST_CONSTANTS = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  HERO_HEIGHT: SCREEN_WIDTH * 1.1,
};

/** Minimum Sparks balance kept back and not offered for redemption in the
 * Arena Rewards catalog — shown as "Redeemable: N" on the balance card. */
export const MIN_REDEEMABLE_SPARKS = 500;

/** Sparks awarded on a successful referral signup — shown on the Set
 * Referral screen's incentive card. */
export const REFERRAL_REWARD_POINTS = {
  REFERRER: 100,
  REFEREE: 50,
} as const;
