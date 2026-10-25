import React from 'react';
import { Plus, Sparkles, Flame, Eye } from 'lucide-react';
import { StoryItem, UserProfile } from '../types';

interface StoriesBarProps {
  stories: StoryItem[];
  user: UserProfile | null;
  onOpenStory: (story: StoryItem, index: number) => void;
  onOpenCreateStory: () => void;
  lang: 'bn' | 'en';
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  user,
  onOpenStory,
  onOpenCreateStory,
  lang,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar">
        
        {/* Your Story (Create New) */}
        <div
          onClick={onOpenCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#3D3228] to-[#69584B] group-hover:from-[#C5A880] group-hover:to-[#E5D2BA] transition-all">
            <div className="w-full h-full rounded-full bg-[#1A1411] border-2 border-[#14110F] overflow-hidden flex items-center justify-center">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-serif text-[#FAF3EB] text-base">
                  {user?.displayName && typeof user.displayName === 'string' && user.displayName.length > 0 ? user.displayName[0] : 'চি'}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#C5A880] text-[#14100E] border-2 border-[#14110F] flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-[11px] font-serif text-[#FAF3EB] max-w-[70px] truncate text-center">
            {lang === 'bn' ? 'আপনার স্টোরি' : 'Your Story'}
          </span>
        </div>

        {/* Community Stories */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => onOpenStory(story, idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105 ${
                story.hasViewed
                  ? 'bg-[#3A3028]'
                  : 'bg-gradient-to-tr from-[#A05D46] via-[#C5A880] to-[#E5D2BA] shadow-[0_0_12px_rgba(197,168,128,0.25)]'
              }`}
            >
              <div className="w-full h-full rounded-full bg-[#181310] border-2 border-[#14110F] overflow-hidden flex items-center justify-center relative">
                {story.bgImage ? (
                  <img
                    src={story.bgImage}
                    alt={story.authorName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#4A382A] to-[#1E1712] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                  </div>
                )}
              </div>
            </div>
            <span className="text-[11px] font-serif text-[#C8BCB0] max-w-[72px] truncate text-center group-hover:text-[#FAF3EB]">
              {story.authorName}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};
