import { StoryItem } from '../types';

export const INITIAL_STORIES: StoryItem[] = [
  {
    id: 'story-1',
    authorId: 'author-1',
    authorName: 'মেঘবালিকা',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: 'শ্রাবণ মাসের মেঘে এক ফোঁটা চন্দন সুবাস...',
    bgImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now() - 3600000 * 2,
    hasViewed: false,
  },
  {
    id: 'story-2',
    authorId: 'author-2',
    authorName: 'অনীক চক্রবর্তী',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    text: 'শহরের বাতি নিভে গেলে কেবল পুরোনো গানের রেশ থাকে।',
    bgImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now() - 3600000 * 5,
    hasViewed: false,
  },
  {
    id: 'story-3',
    authorId: 'author-3',
    authorName: 'সায়াহ্নের কবি',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    text: 'সব হারিয়ে ফেলার পরেও যে সুরটি থেকে যায়, সেটিই চিরকুট।',
    bgImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now() - 3600000 * 8,
    hasViewed: false,
  },
  {
    id: 'story-4',
    authorId: 'author-4',
    authorName: 'বকুলতলা',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    text: 'ঝরে পড়া বকুলগুলোরও একটি না-বলা ভাষা থাকে।',
    bgImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now() - 3600000 * 12,
    hasViewed: false,
  },
];
