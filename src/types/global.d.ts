type AppTheme = "light" | "dark" | "system";

type AccountType = "USER" | "ADMIN";

/** Matches AwardBadgeProps.shape in AwardBadge.tsx — every producer of an
 * Award (post.service.ts, mock data) must use one of these literal values. */
type AwardShape = "shield" | "octagon" | "octagon-round" | "scallop" | "circle";

interface Award {
  id: string;
  postId: string;
  shape: AwardShape;
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
  data?: string[] | string;
}

interface User {
  accountId: string;
  accountType: string;
  accountStatus: string;
  tenantId: string;
  profileId: string;
  profileStatus: string;
  avatar: string;
  coverPhoto: string;
  name: string;
  mobile: string;
  email: string;
  expiry: string;
}

interface AuthResponse {
  user: User;
  token: string;
  isNewUser?: boolean;
}

interface AuthUserSummary {
  accountId?: string;
  accountType?: string;
  accountStatus?: string;
  tenantId?: string;
  profileId?: string;
  profileStatus?: string;
  avatar?: string;
  coverPhoto?: string;
  name?: string;
  mobile?: string;
  email?: string;
  expiry?: string;
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
    user?: AuthUserSummary;
  };
}

interface SetPasswordPayload {
  password: string;
  confirmPassword: string;
}

interface SetPasswordResponse {
  status: "PROFILE_PENDING" | string;
  data?: unknown;
}

interface SetProfilePayload {
  avatar: string;
  username: string;
  givenName: string;
  dob: string;
  location: string;
  referredBy: string;
}

interface SetProfileResponse {
  status: string;
  data?: {
    user?: AuthUserSummary;
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
  data?: unknown;
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
  data?: unknown;
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
  location?: string;
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

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  gender?: string;
  dob?: number;
  visibility?: string;
  avatar?: string;
  coverPhoto?: string;
  location?: string;
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
  thumbnailUrl?: string;
}

type media = {
  url?: string;
  blurHash?: string;
  media_id?: string | number;
};

/** ALL — everyone; FOLLOWERS — accepted followers only; SHARED — specific
 * users the content is shared with; SELF — only the owner. */
type PostVisibility = "ALL" | "SELF" | "SHARED" | "FOLLOWERS";

interface UploadOptions {
  title?: string;
  fileUri: string;
  fileName: string;
  contentType: string;
  visibility?: PostVisibility;
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
  onFollowPress?: () => void;
  isFollowLoading?: boolean;
}

interface PostCommentAuthorProfile {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  givenName?: string;
  avatar?: string;
}

interface PostComment {
  id: string;
  contentId: string;
  contentType?: string;
  profileId: string;
  text: string;
  parentCommentId?: string | null;
  dateCreated: string | number;
  profile?: PostCommentAuthorProfile;
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

interface NetworkProfileItem {
  id: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  isFollowing?: boolean;
}

interface FollowConnectionResponse {
  followerId?: string;
  followedId?: string;
  type?: "SINGLE" | "MUTUAL";
  status?: "PENDING" | "ACTIVE" | "DECLINED" | "BLOCKED";
}

interface TrendingTopic {
  id: string;
  tag: string;
  postsCount: number;
}

interface FeedCategory {
  id: string;
  labelKey: string;
  ringClassName: string;
  imageUrl: string;
}

interface FeedPostItem {
  id: string | number;
  type: string;
  profileId?: string;
  author?: {
    id?: string;
    avatar_url?: string | null;
    display_name?: string;
    username?: string;
    is_me?: boolean;
    is_following?: boolean;
    is_verified?: boolean;
  };
  created_at?: string;
  updated_at?: string;
  caption?: string;
  media?: { id?: string; url?: string; thumbnail_url?: string }[];
  is_liked?: boolean;
  is_saved?: boolean;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  saves_count?: number;
  location?: string | null;
  location_id?: string | null;
  tags?: string[];
}

/** Mirrors the keys of `POST_METADATA_TINTS` in
 * `src/constants/post-metadata-tints.ts` — kept as a literal union here
 * (rather than imported) since this file is an ambient global script. */
type MetadataTintKey =
  | "blue"
  | "violet"
  | "rose"
  | "red"
  | "orange"
  | "amber"
  | "sky"
  | "emerald"
  | "green";

/* ---- Taxonomy (byte-exact port of inuk.social-web's src/taxonomy.json) ---- */

interface TaxonomySubcategory {
  title: string;
  icon: string;
  colour: string;
  onColour: string;
  entities: string[];
}

interface TaxonomyCategory {
  theme: string;
  title: string;
  displayTitle: string;
  summary: string;
  icon: string;
  colour: string;
  background: string;
  text: string;
  onColour: string;
  subCount: number;
  entCount: number;
  subs: TaxonomySubcategory[];
}

interface TaxonomyData {
  themes: string[];
  categories: TaxonomyCategory[];
}

/** Unified shape the PlaceHub modal renders — built on the fly from whichever source opened
 * it (a taxonomy entity, a tag, or a popular place), mirroring web's `subject` object. */
interface DiscoverSubject {
  name: string;
  breadcrumb: string;
  colour: string;
  onColour: string;
  icon: string;
  theme: string | null;
}

/* ---- Arena (byte-exact port of inuk.social-web's ARENA_* constants) ---- */

interface WebArenaFeatured {
  tag: string;
  title: string;
  days: number;
  entries: string;
  grad0: string;
  grad1: string;
}

interface WebArenaContest {
  title: string;
  meta: string;
  colour: string;
  days: number;
  entries: string;
}

interface WebArenaPodiumEntry {
  rank: number;
  handle: string;
  meta: string;
  pts: string;
  medal: string;
}

interface WebArenaQuizQuestion {
  q: string;
  opts: string[];
  a: number;
}

interface WebArenaReward {
  name: string;
  pts: number;
  col: string;
}

/** Multi-quiz list shown outside the Arena screen itself (theme/[themeId].tsx's Quizzes tab
 * deep-links into /arena/quiz) — web's own mockup only ever has the one "Daily Quiz". */
interface ArenaQuiz {
  id: string;
  title: string;
  questionsCount: number;
  streakDays: number;
  sparksPerCorrect: number;
}

interface ArenaWinning {
  id: string;
  label: string;
  amountLabel: string;
  sparksValue: number;
}

interface PaginatedListResponse<T> {
  data: T[];
  total?: number;
  offset?: number;
  limit?: number;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  status?: string;
  data?: unknown;
}

interface ValidateUsernameResponse {
  status: "AVAILABLE" | "UNAVAILABLE" | string;
  message?: string;
  data?: null;
}

interface ReferralCodeReferrer {
  givenName?: string;
  coverPhoto?: string | null;
  avatar?: string;
  username?: string;
}

interface ValidateReferralCodeResponse {
  status: "VALID" | "INVALID" | string;
  message?: string;
  data?: ReferralCodeReferrer | null;
}

interface LocationSearchResult {
  id: string;
  slug: string;
  type: string;
  settlementClass: string | null;
  name: string;
  nameEn?: string;
  localName?: string;
  breadcrumb?: string;
  centroid?: {
    lat: number;
    lng: number;
  };
  primaryPinCode?: string | null;
  matchedAlias?: string | null;
}

/** Full settlement record from GET /bhugol/api/locations/{id} — most of the
 * demographic/amenity fields are frequently null depending on how well the
 * source data (LGD, census, etc.) covers that particular place. */
interface LocationDetail {
  id: string;
  slug: string;
  type: string;
  settlementClass: string | null;
  name: string;
  localName?: string | null;
  breadcrumb?: string | null;
  centroid?: { lat: number; lng: number } | null;
  areaSqKm?: number | null;
  elevationMinM?: number | null;
  elevationMaxM?: number | null;
  population?: number | null;
  censusYear?: number | null;
  households?: number | null;
  sexRatio?: number | null;
  literacyRate?: number | null;
  roadConnectivity?: string | null;
  nearestRailwayKm?: number | null;
  nearestAirportKm?: number | null;
  hasHealthcare?: boolean | null;
  hasSchool?: boolean | null;
  hasBank?: boolean | null;
  hasPostOffice?: boolean | null;
  hasInternet?: boolean | null;
  isTouristSpot?: boolean | null;
  touristCategory?: string | null;
  bestSeason?: string | null;
  primaryOccupation?: string | null;
  mainCrops?: string | null;
  forestCoverPct?: number | null;
  inhabited?: boolean | null;
  forestVillage?: boolean | null;
  ruralUrban?: string | null;
  description?: string | null;
  wikipediaUrl?: string | null;
  imageUrl?: string | null;
}

interface NotificationItem {
  id: string;
  type?: string;
  title?: string;
  message?: string;
  body?: string;
  actor?: {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
  };
  isRead?: boolean;
  read?: boolean;
  createdAt?: string | number;
  dateCreated?: string | number;
  postId?: string;
  mediaId?: string;
}
