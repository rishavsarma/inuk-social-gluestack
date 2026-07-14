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

export const MOCK_DISCOVER_POSTS: DiscoverPost[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: `discover-post-${index + 1}`,
    type: index % 3 === 0 ? "video" : "image",
    likesCount: Math.round(200 + Math.sin(index) * 150 + index * 37),
  }),
);

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = HOUR_MS * 24;
const now = Date.now();

export const MOCK_ARENA_CONTESTS: ArenaContestItem[] = [
  {
    id: "contest-1",
    title: "Harela Green 2026",
    description: "Capture the first light hitting the peaks near you.",
    status: "ACTIVE",
    prize: "₹15,000 + Spotlight Badge",
    entriesCount: 1400,
    endsAt: now + DAY_MS * 3,
    category: "Nature",
    location: "Harela",
    tint: "green",
  },
  {
    id: "contest-2",
    title: "Street Stories of Uttarakhand",
    description: "Tell a story of daily life in a single candid frame.",
    status: "ACTIVE",
    prize: "₹8,000",
    entriesCount: 189,
    endsAt: now + DAY_MS * 6,
    category: "People",
    location: "Kumaon",
    tint: "amber",
  },
  {
    id: "contest-3",
    title: "Monsoon Trails Reel Contest",
    description: "Short-form video of your favourite monsoon trek.",
    status: "UPCOMING",
    prize: "₹10,000 + Feature on Explore",
    entriesCount: 0,
    endsAt: now + DAY_MS * 10,
    category: "Adventure",
    location: "Garhwal",
    tint: "sky",
  },
  {
    id: "contest-4",
    title: "Wildlife of the Hills",
    description: "Best candid wildlife shot from the Himalayan region.",
    status: "UPCOMING",
    prize: "₹12,000",
    entriesCount: 0,
    endsAt: now + DAY_MS * 14,
    category: "Wildlife",
    location: "Kumaon",
    tint: "emerald",
  },
  {
    id: "contest-5",
    title: "Winter Portraits 2025",
    description: "Portraits that capture the character of hill-town winters.",
    status: "ENDED",
    prize: "₹6,000",
    entriesCount: 271,
    endsAt: now - DAY_MS * 20,
    category: "People",
    location: "Garhwal",
    tint: "violet",
  },
  {
    id: "contest-6",
    title: "Food & Culture Spotlight",
    description: "Show us a dish that tells a story of your hometown.",
    status: "ENDED",
    prize: "₹5,000",
    entriesCount: 156,
    endsAt: now - DAY_MS * 45,
    category: "Food",
    location: "Kumaon",
    tint: "orange",
  },
];

export const MOCK_ARENA_QUIZZES: ArenaQuiz[] = [
  {
    id: "quiz-daily",
    title: "Daily Quiz",
    questionsCount: 10,
    streakDays: 7,
    sparksPerCorrect: 5,
  },
  {
    id: "quiz-weekly-trivia",
    title: "Weekly Hills Trivia",
    questionsCount: 15,
    streakDays: 0,
    sparksPerCorrect: 8,
  },
];

export const MOCK_ARENA_QUIZ_QUESTIONS: ArenaQuizQuestion[] = [
  {
    id: "q1",
    question: "Which river originates from the Gangotri glacier?",
    options: ["Bhagirathi", "Alaknanda", "Kali", "Yamuna"],
    correctIndex: 0,
  },
  {
    id: "q2",
    question: "Which hill station is known as the 'Lake District of India'?",
    options: ["Nainital", "Mussoorie", "Almora", "Ranikhet"],
    correctIndex: 0,
  },
  {
    id: "q3",
    question: "Harela festival marks the onset of which season?",
    options: ["Monsoon", "Winter", "Spring", "Autumn"],
    correctIndex: 0,
  },
  {
    id: "q4",
    question: "What is a high-altitude meadow in the Himalayas called?",
    options: ["Bugyal", "Naula", "Tal", "Dhara"],
    correctIndex: 0,
  },
  {
    id: "q5",
    question: "Which peak is the second-highest in Uttarakhand?",
    options: ["Trisul", "Nanda Devi", "Kedarnath", "Kamet"],
    correctIndex: 0,
  },
  {
    id: "q6",
    question: "A 'Naula' traditionally refers to a type of what?",
    options: ["Stepped water well", "Terrace farm", "Wooden bridge", "Prayer wheel"],
    correctIndex: 0,
  },
  {
    id: "q7",
    question: "Aipan is a traditional folk art from which region?",
    options: ["Kumaon", "Garhwal", "Jaunsar", "Tehri"],
    correctIndex: 0,
  },
  {
    id: "q8",
    question: "Which of these is a natural freshwater lake in Uttarakhand?",
    options: ["Bhimtal", "Rishikund", "Sattal Falls", "Corbett Dam"],
    correctIndex: 0,
  },
  {
    id: "q9",
    question: "Kedarnath temple is dedicated to which deity?",
    options: ["Shiva", "Vishnu", "Brahma", "Indra"],
    correctIndex: 0,
  },
  {
    id: "q10",
    question: "Munsiyari is a gateway town for treks to which peak group?",
    options: ["Panchachuli", "Dhauladhar", "Pir Panjal", "Zanskar"],
    correctIndex: 0,
  },
];

export const MOCK_ARENA_LEADERBOARD: ArenaLeaderboardEntry[] = [
  { id: "lb-1", rank: 1, username: "aarti.lens", categoryLabel: "Culture · Almora", score: 11100 },
  { id: "lb-2", rank: 2, username: "mnegi", categoryLabel: "People · Kunja", score: 5800 },
  { id: "lb-3", rank: 3, username: "rohan.mehta", categoryLabel: "Adventure · Garhwal", score: 4200 },
  { id: "lb-4", rank: 4, username: "priya.travels", categoryLabel: "Nature · Kumaon", score: 3650 },
  { id: "lb-5", rank: 5, username: "ishita.rawat", categoryLabel: "Food · Nainital", score: 2900 },
  { id: "lb-6", rank: 6, username: "aarav.clicks", categoryLabel: "Nature · Munsiyari", score: 2100 },
];

export const MOCK_ARENA_REWARDS: ArenaReward[] = [
  { id: "reward-homestay", title: "Homestay voucher", cost: 200, tint: "green" },
  { id: "reward-trekpack", title: "Trek pack", cost: 500, tint: "sky" },
  { id: "reward-tee", title: "INUK tee", cost: 150, tint: "amber" },
  { id: "reward-eventpass", title: "Event pass", cost: 300, tint: "violet" },
];

export const MOCK_ARENA_WINNINGS: ArenaWinning[] = [
  {
    id: "winning-1",
    label: "Contest Winner",
    amountLabel: "₹ voucher",
    sparksValue: 250,
  },
];

export const MOCK_DISCOVER_REGIONS: DiscoverRegion[] = [
  { id: "region-kumaon", name: "Kumaon", postsCount: 1240, districtsCount: 6 },
  { id: "region-garhwal", name: "Garhwal", postsCount: 980, districtsCount: 7 },
];

export const MOCK_DISCOVER_PLACES: DiscoverPlace[] = [
  {
    id: "place-kunja",
    name: "Kunja",
    type: "Village",
    region: "Kumaon",
    district: "Almora",
    coveragePercent: 62,
    postsCount: 128,
    contributorsCount: 34,
    themesCount: 9,
    tint: "green",
  },
  {
    id: "place-munsiyari",
    name: "Munsiyari",
    type: "Town",
    region: "Kumaon",
    district: "Pithoragarh",
    coveragePercent: 48,
    postsCount: 402,
    contributorsCount: 87,
    themesCount: 14,
    tint: "sky",
  },
];

export const MOCK_DISCOVER_CATEGORIES: DiscoverCategory[] = [
  {
    id: "cat-nature",
    labelKey: "discover.category_nature",
    icon: "Trees",
    subcategories: ["Peaks", "Glaciers", "Rivers", "Lakes (tals)", "Waterfalls", "Bugyals", "Forests", "Naulas"],
    tint: "green",
  },
  {
    id: "cat-culture",
    labelKey: "discover.category_culture",
    icon: "Landmark",
    subcategories: ["Festivals", "Folk Art", "Music", "Dance", "Costumes"],
    tint: "amber",
  },
  {
    id: "cat-food",
    labelKey: "discover.category_food",
    icon: "UtensilsCrossed",
    subcategories: ["Pahadi Thali", "Sweets", "Street Food", "Beverages"],
    tint: "orange",
  },
  {
    id: "cat-temples",
    labelKey: "discover.category_temples",
    icon: "Building2",
    subcategories: ["Shiva Temples", "Devi Temples", "Ashrams", "Pilgrim Routes"],
    tint: "sky",
  },
  {
    id: "cat-people",
    labelKey: "discover.category_people",
    icon: "Users",
    subcategories: ["Portraits", "Daily Life", "Artisans", "Farmers"],
    tint: "rose",
  },
  {
    id: "cat-adventure",
    labelKey: "discover.category_adventure",
    icon: "Mountain",
    subcategories: ["Trekking", "Camping", "River Rafting", "Skiing"],
    tint: "blue",
  },
  {
    id: "cat-wildlife",
    labelKey: "discover.category_wildlife",
    icon: "PawPrint",
    subcategories: ["Birds", "Big Cats", "Reptiles", "Insects"],
    tint: "emerald",
  },
  {
    id: "cat-crafts",
    labelKey: "discover.category_crafts",
    icon: "Hammer",
    subcategories: ["Weaving", "Woodwork", "Pottery", "Aipan Art"],
    tint: "violet",
  },
];

export const MOCK_DISCOVER_TAGS: TrendingTopic[] = [
  { id: "tag-harela", tag: "Harela2026", postsCount: 2340 },
  { id: "tag-munsiyari", tag: "Munsiyari", postsCount: 1180 },
  { id: "tag-aipan", tag: "AipanArt", postsCount: 870 },
  { id: "tag-pahaditali", tag: "PahadiThali", postsCount: 640 },
  { id: "tag-kedarnath", tag: "Kedarnath", postsCount: 590 },
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
