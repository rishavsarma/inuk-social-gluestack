export const MOCK_SEARCH_PROFILES: NetworkProfileItem[] = [
  {
    id: "mock-profile-1",
    firstName: "Aarav",
    lastName: "Sharma",
    username: "aarav.clicks",
    bio: "Landscape photographer from Nainital",
    isFollowing: false,
  },
  {
    id: "mock-profile-2",
    firstName: "Priya",
    lastName: "Verma",
    username: "priya.travels",
    bio: "Chasing waterfalls across Uttarakhand",
    isFollowing: true,
  },
  {
    id: "mock-profile-3",
    firstName: "Rohan",
    lastName: "Mehta",
    username: "rohan.mehta",
    bio: "Street photography enthusiast",
    isFollowing: false,
  },
  {
    id: "mock-profile-4",
    firstName: "Ishita",
    lastName: "Rawat",
    username: "ishita.rawat",
    bio: "Mountains & monasteries",
    isFollowing: false,
  },
  {
    id: "mock-profile-5",
    firstName: "Vikram",
    lastName: "Singh",
    username: "vikram.singh",
    bio: "Wildlife & nature photographer",
    isFollowing: true,
  },
  {
    id: "mock-profile-6",
    firstName: "Ananya",
    lastName: "Bisht",
    username: "ananya.bisht",
    bio: "Documenting hidden Himalayan trails",
    isFollowing: false,
  },
  {
    id: "mock-profile-7",
    firstName: "Kabir",
    lastName: "Negi",
    username: "kabir.negi",
    bio: "Sunrise chaser",
    isFollowing: false,
  },
  {
    id: "mock-profile-8",
    firstName: "Meera",
    lastName: "Joshi",
    username: "meera.joshi",
    bio: "Food & culture of the hills",
    isFollowing: false,
  },
];

export const MOCK_TRENDING_TOPICS: TrendingTopic[] = [
  { id: "topic-1", tag: "Himalayas", postsCount: 12800 },
  { id: "topic-2", tag: "Nainital", postsCount: 4300 },
  { id: "topic-3", tag: "StreetPhotography", postsCount: 9100 },
  { id: "topic-4", tag: "MonsoonTrails", postsCount: 2600 },
  { id: "topic-5", tag: "WildlifeIndia", postsCount: 7400 },
  { id: "topic-6", tag: "SunriseChasers", postsCount: 1900 },
];

export const FEED_CATEGORIES: FeedCategory[] = [
  {
    id: "nature",
    labelKey: "feed.categories.nature",
    ringClassName: "border-emerald-500",
    imageUrl:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=150&h=150",
  },
  {
    id: "photography",
    labelKey: "feed.categories.photography",
    ringClassName: "border-blue-500",
    imageUrl: "https://picsum.photos/seed/inuk-photography/200/200",
  },
  {
    id: "design",
    labelKey: "feed.categories.design",
    ringClassName: "border-violet-500",
    imageUrl: "https://picsum.photos/seed/inuk-design/200/200",
  },
  {
    id: "travel",
    labelKey: "feed.categories.travel",
    ringClassName: "border-orange-500",
    imageUrl: "https://picsum.photos/seed/inuk-travel/200/200",
  },
  {
    id: "food",
    labelKey: "feed.categories.food",
    ringClassName: "border-red-500",
    imageUrl: "https://picsum.photos/seed/inuk-food/200/200",
  },
  {
    id: "fashion",
    labelKey: "feed.categories.fashion",
    ringClassName: "border-pink-500",
    imageUrl: "https://picsum.photos/seed/inuk-fashion/200/200",
  },
];

const HOUR_MS = 60 * 60 * 1000;
const now = Date.now();

// ---- Arena data (byte-exact port of inuk.social-web's ARENA_* constants, screens.js ~L2371-2391) ----

export const ARENA_FEATURED: WebArenaFeatured = {
  tag: "NATURE · HARELA",
  title: "Harela Green 2026",
  days: 3,
  entries: "1.4k",
  grad0: "#2E7D32",
  grad1: "#7CB342",
};

export const ARENA_OPEN: WebArenaContest[] = [
  { title: "Devbhoomi Thursday — Kedarnath", meta: "Temples · Photo/Story", colour: "#E65100", days: 1, entries: "820" },
  { title: "Summit Saturday — Roopkund", meta: "Adventure · Video/Reel", colour: "#00695C", days: 4, entries: "610" },
  { title: "Flavours Wednesday — Bal Mithai", meta: "Food · Photo/Recipe", colour: "#E64A19", days: 2, entries: "540" },
];

export const ARENA_PODIUM: WebArenaPodiumEntry[] = [
  { rank: 1, handle: "aarti.lens", meta: "Culture · Almora", pts: "11.1k", medal: "#E6B325" },
  { rank: 2, handle: "mnegi", meta: "People · Kunja", pts: "5.8k", medal: "#9AA3AE" },
  { rank: 3, handle: "himalayan.tales", meta: "Adventure · Munsiyari", pts: "4.2k", medal: "#CD7F32" },
];

export const ARENA_QUIZ: WebArenaQuizQuestion[] = [
  { q: "Which river originates from the Gangotri glacier?", opts: ["Bhagirathi", "Alaknanda", "Kali", "Yamuna"], a: 0 },
  { q: "Uttarakhand is fondly called Devbhoomi — meaning?", opts: ["Land of Gods", "Land of Rivers", "Land of Snow", "Land of Forts"], a: 0 },
  { q: "What is the winter seat of the Kedarnath deity?", opts: ["Ukhimath", "Guptkashi", "Joshimath", "Rudraprayag"], a: 0 },
];

export const ARENA_REWARDS: WebArenaReward[] = [
  { name: "Homestay voucher", pts: 200, col: "#EFE0CE" },
  { name: "Trek pack", pts: 500, col: "#DCE9E4" },
  { name: "INUK tee", pts: 150, col: "#EFE0CE" },
  { name: "Event pass", pts: 300, col: "#D9E5F0" },
];

/** Multi-quiz teaser list used outside the Arena screen (theme/[themeId].tsx's Quizzes tab). */
export const MOCK_ARENA_QUIZZES: ArenaQuiz[] = [
  {
    id: "quiz-daily",
    title: "Daily Quiz",
    questionsCount: ARENA_QUIZ.length,
    streakDays: 7,
    sparksPerCorrect: 5,
  },
];

export const MOCK_ARENA_WINNINGS: ArenaWinning[] = [
  {
    id: "winning-1",
    label: "Contest Winner",
    amountLabel: "₹ voucher",
    sparksValue: 250,
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "mock-notif-1",
    type: "LIKE",
    message: "Priya Verma liked your post",
    actor: { name: "Priya Verma", username: "priya.travels" },
    isRead: false,
    createdAt: now - HOUR_MS * 1,
  },
  {
    id: "mock-notif-2",
    type: "FOLLOW",
    message: "Vikram Singh started following you",
    actor: { name: "Vikram Singh", username: "vikram.singh" },
    isRead: false,
    createdAt: now - HOUR_MS * 3,
  },
  {
    id: "mock-notif-3",
    type: "COMMENT",
    message: 'Rohan Mehta commented: "This view is unreal!"',
    actor: { name: "Rohan Mehta", username: "rohan.mehta" },
    isRead: true,
    createdAt: now - HOUR_MS * 8,
  },
  {
    id: "mock-notif-4",
    type: "AWARD",
    message: "You won Spotlight of the Week 🏆",
    isRead: true,
    createdAt: now - HOUR_MS * 26,
  },
  {
    id: "mock-notif-5",
    type: "LIKE",
    message: "Ananya Bisht and 12 others liked your post",
    actor: { name: "Ananya Bisht", username: "ananya.bisht" },
    isRead: true,
    createdAt: now - HOUR_MS * 50,
  },
  {
    id: "mock-notif-6",
    type: "FOLLOW",
    message: "Meera Joshi started following you",
    actor: { name: "Meera Joshi", username: "meera.joshi" },
    isRead: true,
    createdAt: now - HOUR_MS * 96,
  },
];
