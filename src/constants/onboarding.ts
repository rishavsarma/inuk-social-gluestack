import { THEME_ACCENT_COLOR } from "@/constants";

export interface OnboardingFloatingCard {
  id: string;
  type: "like" | "comment" | "trophy" | "stat";
  value: string;
  label?: string;
  /** Position offsets relative to slide width/height, 0-1 */
  x: number;
  y: number;
  delay: number;
  rotate: number;
}

export interface OnboardingSlide {
  id: number;
  titleKey: string;
  subtitleKey: string;
  accentColor: string;
  backgroundImage: number;
  floatingCards: OnboardingFloatingCard[];
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    titleKey: "onboarding.slide1.title",
    subtitleKey: "onboarding.slide1.subtitle",
    accentColor: THEME_ACCENT_COLOR,
    backgroundImage: require("@/assets/images/onboarding_bg1.png"),
    floatingCards: [
      { id: "1a", type: "like", value: "12.4K", delay: 300, x: 0.6, y: 0.28, rotate: 6 },
      { id: "1b", type: "comment", value: "890", delay: 550, x: 0.08, y: 0.38, rotate: -5 },
    ],
  },
  {
    id: 2,
    titleKey: "onboarding.slide2.title",
    subtitleKey: "onboarding.slide2.subtitle",
    accentColor: THEME_ACCENT_COLOR,
    backgroundImage: require("@/assets/images/onboarding_bg2.png"),
    floatingCards: [
      { id: "2a", type: "trophy", value: "8.9K", delay: 300, x: 0.08, y: 0.42, rotate: -6 },
      { id: "2b", type: "like", value: "890", delay: 550, x: 0.58, y: 0.33, rotate: 5 },
    ],
  },
  {
    id: 3,
    titleKey: "onboarding.slide3.title",
    subtitleKey: "onboarding.slide3.subtitle",
    accentColor: THEME_ACCENT_COLOR,
    backgroundImage: require("@/assets/images/onboarding_bg3.png"),
    floatingCards: [
      { id: "3a", type: "like", value: "2.4K", delay: 300, x: 0.55, y: 0.3, rotate: 7 },
      { id: "3b", type: "like", value: "890", delay: 500, x: 0.58, y: 0.45, rotate: -4 },
    ],
  },
  {
    id: 4,
    titleKey: "onboarding.slide4.title",
    subtitleKey: "onboarding.slide4.subtitle",
    accentColor: THEME_ACCENT_COLOR,
    backgroundImage: require("@/assets/images/onboarding_bg4.png"),
    floatingCards: [
      { id: "4a", type: "stat", value: "1,260", label: "followers", delay: 300, x: 0.05, y: 0.52, rotate: -3 },
      { id: "4b", type: "like", value: "233", delay: 500, x: 0.58, y: 0.3, rotate: 6 },
      { id: "4c", type: "comment", value: "16", delay: 700, x: 0.06, y: 0.36, rotate: -6 },
    ],
  },
];
