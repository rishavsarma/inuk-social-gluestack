/**
 * Byte-exact port of inuk.social-web's `theme.js` brand tokens. Discover and Arena are built
 * to match that reference pixel-for-pixel, so these screens intentionally bypass the app's
 * semantic `--theme`/`--foreground` tokens in favour of the web app's own literal palette.
 */

export const WEB_PALETTE = {
  navy: "#1B1F3B",
  red: "#CF2B13",
  snow: "#FFFFFF",
  mist: "#C4C8DB",
  redSoftDark: "#ff7a63",
} as const;

export const WEB_THEME = {
  light: {
    bg: "#FFFFFF",
    ink: WEB_PALETTE.navy,
    sub: "rgba(27,31,59,0.60)",
    line: "#E3E4EC",
    inputBg: "#F0F0F3",
  },
  dark: {
    bg: "#12142A",
    ink: "#E9EBF4",
    sub: "#C4C8DB",
    line: "#2b3050",
    inputBg: "#20233B",
  },
} as const;

/** `className` fragments pairing light/dark literal hex via NativeWind's `dark:` variant —
 * mirrors web's `mode === 'dark' ? darkValue : lightValue` ternaries used throughout Discover/Arena. */
export const WEB_TEXT_INK = "text-[#1B1F3B] dark:text-[#E9EBF4]";
export const WEB_TEXT_SUB = "text-[rgba(27,31,59,0.6)] dark:text-[#C4C8DB]";
export const WEB_BG_SCREEN = "bg-white dark:bg-[#12142A]";
export const WEB_BORDER_LINE = "border-[#E3E4EC] dark:border-[#2b3050]";
export const WEB_BG_PILL = "bg-[#F0F0F3] dark:bg-[#20233B]";

/** font.round (Baloo2) / font.body (Inter) weight → NativeWind class, matching `theme.js`'s `font` export. */
export const WEB_FONT_ROUND = {
  500: "font-baloo-medium",
  700: "font-baloo-bold",
  800: "font-baloo-extrabold",
} as const;

export const WEB_FONT_BODY = {
  400: "font-inter",
  500: "font-inter-medium",
  600: "font-inter-semibold",
  700: "font-inter-bold",
} as const;
