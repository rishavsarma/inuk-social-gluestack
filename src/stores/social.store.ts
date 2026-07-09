import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CommentItem {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface PostItem {
  id: string;
  username: string;
  avatarUrl?: string;
  imageUrl: string;
  caption: string;
  likesCount: number;
  isLikedByUser: boolean;
  comments: CommentItem[];
  timestamp: string; // ISO String
  contestId?: string;
  filterName?: string;
}

export interface ContestItem {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  prize: string;
  deadline: string; // ISO String
  participantCount: number;
  isJoined: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress?: number; // 0 to 100
}

export interface SparkTransactionItem {
  id: string;
  /** i18n key under `sparks.*` describing why the points changed */
  reasonKey: string;
  amount: number; // positive = earned, negative = spent
  timestamp: string; // ISO String
}

interface SocialState {
  posts: PostItem[];
  contests: ContestItem[];
  achievements: AchievementItem[];
  points: number;
  transactions: SparkTransactionItem[];
  addPost: (post: Omit<PostItem, 'id' | 'likesCount' | 'isLikedByUser' | 'comments' | 'timestamp'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string, username: string) => void;
  joinContest: (contestId: string) => void;
  addPoints: (amount: number) => void;
}

function createTransaction(reasonKey: string, amount: number): SparkTransactionItem {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    reasonKey,
    amount,
    timestamp: new Date().toISOString(),
  };
}

// Initial mock contests
const INITIAL_CONTESTS: ContestItem[] = [
  {
    id: 'contest_golden_hour',
    title: 'Golden Hour Shaders',
    description: 'Capture the warm, rich colors of sunset and sunrise. Enhance with warm and sepia filters to highlight golden gradients.',
    coverUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    prize: '150 pts + Sun Lord Badge',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    participantCount: 42,
    isJoined: false,
  },
  {
    id: 'contest_retro_pixel',
    title: 'Retro Pixelation Art',
    description: 'Turn modern photos into vintage 8-bit or 16-bit video game environments. Use the pixelate effect shader to stylize your entries.',
    coverUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=60',
    prize: '300 pts + Retro King Badge',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    participantCount: 89,
    isJoined: false,
  },
  {
    id: 'contest_liquid_warp',
    title: 'Liquid Wave Distortion',
    description: 'Manipulate spatial reality! Apply liquid ripple and distortion waves on water, glass, or neon lights to create abstract physics.',
    coverUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=60',
    prize: '500 pts + Fluid Wizard Badge',
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    participantCount: 61,
    isJoined: false,
  },
];

// Initial mock posts
const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post_1',
    username: 'alex_explorer',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
    caption: 'Chasing morning fog in the deep pine forests. Applied the Cool Filter for that early mountain freeze vibe.',
    likesCount: 142,
    isLikedByUser: false,
    filterName: 'Cool',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c1', username: 'nature_seeker', text: 'Stunning colors! That fog looks magical.', timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString() },
      { id: 'c2', username: 'pixel_purist', text: 'The cooler tint fits the valley outline perfectly.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ],
  },
  {
    id: 'post_2',
    username: 'sophia_pixel',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=60',
    caption: 'Neon arcade nights. Pixelated the background to isolate the central neon sign, giving it a classic retro cyberpunk atmosphere.',
    likesCount: 95,
    isLikedByUser: true,
    filterName: 'Vintage',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    comments: [
      { id: 'c3', username: 'tokyo_drift', text: 'Gives off massive retro cabinet vibes. Love the shader work here.', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() }
    ],
    contestId: 'contest_retro_pixel',
  },
];

// Initial mock spark transactions — matches the seeded `points: 120`
const INITIAL_TRANSACTIONS: SparkTransactionItem[] = [
  {
    id: 'txn_welcome',
    reasonKey: 'sparks.txn_welcome',
    amount: 100,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn_first_post',
    reasonKey: 'sparks.txn_post',
    amount: 20,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initial mock achievements
const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'badge_first_edit',
    title: 'Shader Pioneer',
    description: 'Apply your first color lookup filter or custom GPU shader in the editor.',
    icon: 'Sparkles',
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    progress: 100,
  },
  {
    id: 'badge_contest_join',
    title: 'Challenger Spirit',
    description: 'Submit an edited photo to any active contest.',
    icon: 'Trophy',
    isUnlocked: false,
    progress: 0,
  },
  {
    id: 'badge_liquid_warp',
    title: 'Fluid Wizard',
    description: 'Use the Liquid Warp shader effects to distort neon lights or cityscapes.',
    icon: 'Droplet',
    isUnlocked: false,
    progress: 30,
  },
  {
    id: 'badge_popular_creator',
    title: 'Trending Star',
    description: 'Accumulate more than 100 total likes on your published edits.',
    icon: 'Zap',
    isUnlocked: true,
    unlockedAt: new Date().toISOString(),
    progress: 100,
  },
];

export const useSocialStore = create<SocialState>()(
  persist(
    (set) => ({
      posts: INITIAL_POSTS,
      contests: INITIAL_CONTESTS,
      achievements: INITIAL_ACHIEVEMENTS,
      points: 120,
      transactions: INITIAL_TRANSACTIONS,

      addPost: (post) =>
        set((state) => {
          const newPostItem: PostItem = {
            ...post,
            id: `post_${Date.now()}`,
            likesCount: 0,
            isLikedByUser: false,
            comments: [],
            timestamp: new Date().toISOString(),
          };

          // award some points for posting
          const bonusPoints = post.contestId ? 50 : 20;

          // update contest participant count if submitted to contest
          const updatedContests = state.contests.map((c) => {
            if (c.id === post.contestId) {
              return { ...c, participantCount: c.participantCount + 1, isJoined: true };
            }
            return c;
          });

          // check badge progress on submission
          const updatedAchievements = state.achievements.map((ach) => {
            if (ach.id === 'badge_contest_join' && post.contestId) {
              return { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString(), progress: 100 };
            }
            return ach;
          });

          return {
            posts: [newPostItem, ...state.posts],
            contests: updatedContests,
            achievements: updatedAchievements,
            points: state.points + bonusPoints,
            transactions: [
              createTransaction(
                post.contestId ? 'sparks.txn_contest_post' : 'sparks.txn_post',
                bonusPoints,
              ),
              ...state.transactions,
            ],
          };
        }),

      likePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id === postId) {
              const isLiked = !p.isLikedByUser;
              return {
                ...p,
                isLikedByUser: isLiked,
                likesCount: p.likesCount + (isLiked ? 1 : -1),
              };
            }
            return p;
          }),
        })),

      addComment: (postId, text, username) =>
        set((state) => ({
          posts: state.posts.map((p) => {
            if (p.id === postId) {
              const newComment: CommentItem = {
                id: `comm_${Date.now()}`,
                username,
                text,
                timestamp: new Date().toISOString(),
              };
              return {
                ...p,
                comments: [...p.comments, newComment],
              };
            }
            return p;
          }),
        })),

      joinContest: (contestId) =>
        set((state) => ({
          contests: state.contests.map((c) => {
            if (c.id === contestId) {
              return {
                ...c,
                isJoined: true,
                participantCount: c.participantCount + 1,
              };
            }
            return c;
          }),
          points: state.points + 10, // minor points for registering interest
          transactions: [
            createTransaction('sparks.txn_join_contest', 10),
            ...state.transactions,
          ],
        })),

      addPoints: (amount) =>
        set((state) => ({
          points: state.points + amount,
          transactions: [
            createTransaction('sparks.txn_activity', amount),
            ...state.transactions,
          ],
        })),
    }),
    {
      name: 'social-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
