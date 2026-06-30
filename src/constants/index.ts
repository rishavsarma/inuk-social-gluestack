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
