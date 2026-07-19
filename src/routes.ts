export const ROUTES = {
  ROOT: "/" as const,
  ONBOARDING: {
    THEME: "/(onboarding)/theme",
    LANGUAGE: "/(onboarding)/language",
    DRIVER: "/(onboarding)/driver",
  } as const,
  AUTH: {
    HOME: "/(auth)" as const,
    SIGNUP: "/(auth)/signup" as const,
    SET_PASSWORD: "/(auth)/set-password" as const,
    SET_REFERRAL: "/(auth)/set-referral" as const,
    SET_PROFILE: "/(auth)/set-profile" as const,
    VERIFY_OTP: "/(auth)/verify-otp" as const,
    PASSWORD_LOGIN: "/(auth)/password-login" as const,
  },
  TABS: {
    FEED: "/feed" as const,
    ARENA: "/arena" as const,
    CREATE: "/create" as const,
    AWARDS: "/awards" as const,
    DISCOVER: "/discover" as const,
    PROFILE: "/profile" as const,
    EXPLORE: "/explore" as const,
    NOTIFICATIONS: "/notifications" as const,
  },
  CONTENT: {
    POST_DETAILS: (mediaId: string, postId: string) =>
      `/post-detail/${mediaId}/${postId}` as const,
    POST_COMMENTS: (mediaId: string | number, postId: string | number) =>
      `/post/${mediaId}/${postId}?comments=true` as const,
    THEME_DETAILS: (id: string) => `/theme/${id}` as const,
  },
  ARENA: {
    QUIZ: "/arena/quiz" as const,
  },
  USER: {
    PROFILE: (id: string | number) => `/(tabs)/profile?id=${id}` as const,
    NETWORK: (userId: string | number, tab: "followers" | "following") =>
      `/profile/network?userId=${userId}&tab=${tab}` as const,
    MENU: "/profile-menu" as const,
    EDIT_PROFILE: "/settings/edit-profile" as const,
    CHANGE_PASSWORD: "/settings/change-password" as const,
    POINTS: "/settings/points" as const,
    VERIFICATION: "/profile-menu/verification" as const,
    PRIVACY: "/profile-menu/privacy" as const,
    NOTIFICATION_PREFS: "/profile-menu/notifications" as const,
    BLOCKED: "/profile-menu/blocked" as const,
    DATA_PRIVACY: "/profile-menu/data-privacy" as const,
    LANGUAGE: "/profile-menu/language" as const,
    THEME: "/profile-menu/theme" as const,
    MY_POSTS: "/my-posts" as const,
  },
  LEGAL: {
    TERMS: "/(legal)/terms" as const,
    PRIVACY: "/(legal)/privacy" as const,
  },
} as const;

export type AppRoute =
  | (typeof ROUTES.AUTH)[keyof typeof ROUTES.AUTH]
  | (typeof ROUTES.TABS)[keyof typeof ROUTES.TABS]
  | typeof ROUTES.USER.MENU;
