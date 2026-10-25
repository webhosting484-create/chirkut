import { ChirkutComment } from '../types';

export const INITIAL_COMMENTS: ChirkutComment[] = [
  {
    id: 'c-1',
    chirkutId: 'chirkut-14',
    authorId: 'user-1',
    authorName: 'অদিতি রায়',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    text: 'এই পঙ্‌ক্তিটি হৃদয় ছুঁয়ে গেল। সুবাসের গভীরতা সত্যিই স্মৃতির সাথে মিশে থাকে।',
    createdAt: '২ ঘণ্টা আগে',
  },
  {
    id: 'c-2',
    chirkutId: 'chirkut-14',
    authorId: 'user-2',
    authorName: 'ফারহান আহমেদ',
    text: 'অপূর্ব চিরকুট! কাগজের রং আর লেখার ভাব প্রকাশ সত্যিই অতুলনীয়।',
    createdAt: '৪ ঘণ্টা আগে',
  },
  {
    id: 'c-3',
    chirkutId: 'chirkut-1',
    authorId: 'user-3',
    authorName: 'বৃষ্টির সখা',
    text: 'বৃষ্টিভেজা মাটির সোঁদা গন্ধ যেন এই চিরকুট পড়ার সময় নাকে ভেসে এলো।',
    createdAt: '১ দিন আগে',
  },
];
