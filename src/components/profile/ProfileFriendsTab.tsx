import React, { useState } from 'react';
import { Users, Search, UserPlus, Check } from 'lucide-react';
import { DEFAULT_AUTHOR_PROFILES } from '../../data/authorProfiles';

interface ProfileFriendsTabProps {
  lang: 'bn' | 'en';
}

export const ProfileFriendsTab: React.FC<ProfileFriendsTabProps> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({
    'হুমায়ূন আহমেদ': true,
    'রবীন্দ্রনাথ ঠাকুর': true,
    'কাজী নজরুল ইসলাম': true,
  });

  const authorsList = Object.entries(DEFAULT_AUTHOR_PROFILES).map(([name, profile]) => ({
    name,
    username: profile.username,
    avatar: profile.photoURL,
    bio: profile.bio,
    mutualCount: Math.floor(Math.random() * 25) + 3,
  }));

  const filteredAuthors = authorsList.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (name: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="bg-[#1C1612] border border-[#3D3228] rounded-2xl p-5 text-[#E8DFD8] shadow-xl font-serif">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2C231B]">
        <div>
          <h3 className="font-serif font-bold text-base text-[#FAF3EB] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'অনুরাগী ও বন্ধু তালিকা' : 'Friends & Readers'}</span>
          </h3>
          <p className="text-xs text-[#8C7A6B] mt-0.5">
            {lang === 'bn'
              ? 'চিরকুটের লেখক, পাঠক ও আপনার পরিচিত বন্ধুদের তালিকা'
              : 'List of authors, readers and mutual connections'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'bn' ? 'বন্ধু খুঁজুন...' : 'Search friends...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#241C16] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
          />
        </div>
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
        {filteredAuthors.map((author) => {
          const isFollowing = !!followingMap[author.name];
          return (
            <div
              key={author.name}
              className="flex items-center justify-between p-3 rounded-xl bg-[#241C16] border border-[#3D3228] hover:border-[#C5A880]/60 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#C5A880]/60 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-serif font-medium text-xs text-[#FAF3EB] truncate group-hover:text-[#C5A880] transition-colors">
                    {author.name}
                  </h4>
                  <p className="text-[11px] text-[#8C7A6B] truncate">@{author.username}</p>
                  <p className="text-[10px] text-[#C5A880] mt-0.5">
                    {author.mutualCount} {lang === 'bn' ? 'জন যৌথ বন্ধু' : 'mutual friends'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(author.name)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-serif font-medium transition-all shrink-0 cursor-pointer ${
                  isFollowing
                    ? 'bg-[#2C231B] text-[#C5A880] border border-[#3D3228] hover:bg-[#3D3228]'
                    : 'bg-[#C5A880] text-[#14100E] hover:bg-[#D4AF37]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'যুক্ত' : 'Friends'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'যোগ করুন' : 'Add'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
