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

export const MOCK_CONTESTS: ContestItem[] = [
  {
    id: "contest-1",
    title: "Himalayan Sunrise Challenge",
    description: "Capture the first light hitting the peaks near you.",
    status: "ACTIVE",
    prize: "₹15,000 + Spotlight Badge",
    entriesCount: 342,
    endsAt: now + DAY_MS * 3,
  },
  {
    id: "contest-2",
    title: "Street Stories of Uttarakhand",
    description: "Tell a story of daily life in a single candid frame.",
    status: "ACTIVE",
    prize: "₹8,000",
    entriesCount: 189,
    endsAt: now + DAY_MS * 6,
  },
  {
    id: "contest-3",
    title: "Monsoon Trails Reel Contest",
    description: "Short-form video of your favourite monsoon trek.",
    status: "UPCOMING",
    prize: "₹10,000 + Feature on Explore",
    entriesCount: 0,
    endsAt: now + DAY_MS * 10,
  },
  {
    id: "contest-4",
    title: "Wildlife of the Hills",
    description: "Best candid wildlife shot from the Himalayan region.",
    status: "UPCOMING",
    prize: "₹12,000",
    entriesCount: 0,
    endsAt: now + DAY_MS * 14,
  },
  {
    id: "contest-5",
    title: "Winter Portraits 2025",
    description: "Portraits that capture the character of hill-town winters.",
    status: "ENDED",
    prize: "₹6,000",
    entriesCount: 271,
    endsAt: now - DAY_MS * 20,
  },
  {
    id: "contest-6",
    title: "Food & Culture Spotlight",
    description: "Show us a dish that tells a story of your hometown.",
    status: "ENDED",
    prize: "₹5,000",
    entriesCount: 156,
    endsAt: now - DAY_MS * 45,
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
