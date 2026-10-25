export type ReactionType = 'love' | 'tear' | 'sparkle' | 'fire' | 'calm';

export interface ReactionCounts {
  love: number;
  tear: number;
  sparkle: number;
  fire: number;
  calm: number;
}

export interface ChirkutComment {
  id: string;
  chirkutId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface ChirkutNote {
  id: string;
  quote: string;
  quoteBn?: string;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  location?: string;
  date?: string;
  category: 'scent' | 'memory' | 'rain' | 'love' | 'solitude';
  scentProfile?: {
    top: string;
    heart: string;
    base: string;
  };
  paperColor?: 'parchment' | 'rose' | 'amber' | 'sage' | 'slate' | 'custom' | string;
  bgImageUrl?: string;
  videoUrl?: string;
  mediaType?: 'text' | 'image' | 'video';
  fullStory?: string;
  fullStoryBn?: string;
  isPinnedHero?: boolean;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  reactions?: ReactionCounts;
  userReaction?: ReactionType | null;
  createdAt?: string | number;
}

export interface StoryItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  text?: string;
  bgImage?: string;
  videoUrl?: string;
  createdAt: number;
  hasViewed?: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  coverPhoto?: string;
  username?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  website?: string;
  favoriteScent?: string;
  favoriteMood?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  isAnonymous?: boolean;
  savedNotesCount?: number;
  notesCount?: number;
}

export type ProfileVisibility = 'public' | 'friends' | 'only_me';

export interface UserSettings {
  userId: string;
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showLocation: boolean;
  showFriendsList: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: 'bn' | 'en';
  theme: 'dark' | 'light' | 'auto';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  toUserId: string;
  toUserName?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: string;
}

export interface Friendship {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  friendId: string;
  friendName: string;
  friendAvatar?: string;
  createdAt: string;
  status: 'active' | 'blocked';
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'friend_request' | 'friend_accepted' | 'mention' | 'system';
  title: string;
  message: string;
  fromUserId?: string;
  fromUserName?: string;
  fromUserAvatar?: string;
  targetId?: string;
  targetType?: 'chirkut' | 'comment' | 'profile';
  isRead: boolean;
  createdAt: string;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showLocation: boolean;
  showFriendsList: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;
}

export interface AccountSettings {
  displayName: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  favoriteScent: string;
  favoriteMood: string;
}

export interface UserStats {
  notesCount: number;
  friendsCount: number;
  followersCount: number;
  followingCount: number;
  likesReceived: number;
  commentsReceived: number;
}

export interface FriendSuggestion {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  mutualFriends: number;
  reason: string;
}

export interface NewNoteSubmission {
  quote: string;
  author: string;
  location: string;
  category: 'scent' | 'memory' | 'rain' | 'love' | 'solitude';
  paperColor: 'parchment' | 'rose' | 'amber' | 'sage' | 'slate' | 'custom';
  scentTag: string;
  bgImageUrl?: string;
  videoUrl?: string;
  mediaType: 'text' | 'image' | 'video';
}

