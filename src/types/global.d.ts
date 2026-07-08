type AppTheme = "light" | "dark" | "system";

type AccountType = "USER" | "ADMIN";

interface Award {
  id: string;
  postId: string;
  shape: string;
  theme: string;
  period: string;
  rank: string;
  suffix: string;
  label: string;
  value: string;
  description: string;
}

interface InitiateJourneyPayload {
  contact: string;
  accountType: AccountType;
}

interface InitiateJourneyResponse {
  status: "VERIFICATION_PENDING" | "BLOCKED" | "ACTIVE" | "WELCOME" | string;
  data?: string[] | string | any;
}

interface VerifyOtpPayload {
  requestId?: string;
  otp: string;
  contact: string;
  profileType: AccountType;
}

interface VerifyOtpResponse {
  status: "PASSWORD_PENDING" | "WELCOME" | string;
  data?: {
    token?: string;
    profileId?: string;
    accountId?: string;
    user?: any;
  };
}

interface SetPasswordPayload {
  password: string;
  confirmPassword: string;
}

interface SetPasswordResponse {
  status: "PROFILE_PENDING" | string;
  data?: any;
}

interface SetProfilePayload {
  token: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  dob?: string;
  location?: string;
}

interface SetProfileResponse {
  status: string;
  data?: {
    user?: any;
  };
}

interface SignInWithPasswordPayload {
  contact: string;
  password?: string;
}

interface SignInWithPasswordResponse {
  account: {
    id: string;
    type: string;
    status: string;
    tenantId: string;
    mobile: string;
    email: string;
  };
  profile: {
    id: string;
    status: string;
    avatar: string;
    coverPhoto: string;
    name: string;
  };
  token: string;
  expiry: string;

  profileId: string;
  profileStatus: string;
  avatar: string;
  coverPhoto: string;
  name: string;
  mobile: string;
  email: string;
  expiry: string;
}

interface SignInOtpInitiatePayload {
  contact: string;
  profileType: AccountType;
}

interface SignInOtpInitiateResponse {
  status?: string;
  data?: any;
}

interface ResetPasswordInitiatePayload {
  contact: string;
}

interface ResetPasswordInitiateResponse {
  status?: string;
  data: {
    requestId: string;
  };
}

interface ResetPasswordVerifyOtpPayload {
  requestId: string;
  otp: string;
  profileType: AccountType;
}

interface ResetPasswordVerifyOtpResponse {
  status?: string;
  data: {
    requestId: string;
  };
}

interface ResetPasswordUpdatePayload {
  requestId: string;
  password?: string;
  confirmPassword?: string;
}

interface ResetPasswordUpdateResponse {
  status?: string;
  data?: any;
}

interface SignInVerifyOtpPayload {
  contact: string;
  otp: string;
}

interface SignInVerifyOtpResponse {
  account: {
    id: string;
    type: string;
    status: string;
    tenantId: string;
    mobile: string;
    email: string;
  };
  profile: {
    id: string;
    status: string;
    avatar: string;
    coverPhoto: string;
    name: string;
  };
  token: string;
  expiry: string;

  profileId: string;
  profileStatus: string;
  avatar: string;
  coverPhoto: string;
  name: string;
  mobile: string;
  email: string;
  expiry: string;
}

interface ProfileResponse {
  accountId: string;
  avatar: string;
  bio: string;
  category: string;
  coverPhoto: string;
  createdBy: string;
  dateCreated: number;
  dateUpdated: number;
  dob: number;
  firstName: string;
  gender: "MALE" | "FEMALE";
  givenName: string;
  id: string;
  lastName: string;
  referralCode: string;
  referredBy: string;
  status: string;
  subCategory: string;
  tenantId: string;
  type: string;
  updatedBy: string;
  username: string;
  visibility: string;
}

interface ProfileStatsResponse {
  award: number;
  badge: number;
  contest: number;
  contestWin: number;
  follower: number;
  following: number;
  photo: number;
  post: number;
  profileId: string;
  reel: number;
  referral: number;
  tale: number;
  video: number;
}

interface ProfileMediaItem {
  id: string | number;
  profile_id?: string;
  post_id?: string;
  type?: string;
  postType?: string;
  caption?: string;
  media?: media[];
  postId: string;
  profileId?: string;
  mediaId: string;
  blurHash?: string;
  dateCreated?: number;
  s3Url?: string;
}

type media = {
  url?: string;
  blurHash?: string;
  media_id?: string | number;
};

interface UploadOptions {
  title?: string;
  fileUri: string;
  fileName: string;
  contentType: string;
  visibility?: "ALL" | "SELF" | "SHARED" | "FOLLOWERS";
  mediaType?:
    | "AVATAR"
    | "ILLUSTRATION"
    | "POST"
    | "COMMENT"
    | "PHOTO"
    | "VIDEO";
  token: string;
  onProgress?: (progress: number) => void;
  mediaId?: string;
  postId?: string;
}

interface PostMedia {
  id: string;
  url: string;
  type: string;
  width?: number;
  height?: number;
  thumbnail_url?: string;
}

interface PostMediaGalleryProps {
  post: PostDetail;
}

interface PostDetail {
  author: {
    profile_id?: string;
    username: string;
    display_name: string;
    avatar_url: string;
    is_following: boolean;
    date_joined: string | null;
    is_me?: boolean;
  };
  post: {
    id: string;
    title?: string;
    caption: string;
    type: string; // 'photo' | 'video' | 'text' | 'quiz' | 'audio'
    media: PostMedia[];
    audio?: { url: string; duration?: number; waveform?: number[] };
    quiz?: PostQuiz;
    is_liked: boolean;
    likes_count: number;
    comments_count: number;
    is_saved: boolean;
    created_at: string;
  };
  camera: {
    cameraExif: {
      icon: import("lucide-react-native").LucideIcon;
      /** Stable, untranslated identifier used to pick icon/color styling — the
       * displayed `label` is translated and must not be pattern-matched on. */
      type: string;
      label: string;
      value: string;
    }[];
  };
  performance: {
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    sharesCount: number;
    awardsCount: number;
    score: number;
  };
  awards: {
    postId: string;
  };
  enviroment: {
    weatherInfo: {
      icon: import("lucide-react-native").LucideIcon;
      /** Stable, untranslated identifier used to pick icon/color styling — the
       * displayed `label` is translated and must not be pattern-matched on. */
      type: string;
      label: string;
      value: string;
    }[];
    latitude?: number;
    longitude?: number;
    place?: string;
  };
}
