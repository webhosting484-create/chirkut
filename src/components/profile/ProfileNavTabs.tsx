import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  Image as ImageIcon,
  Bookmark,
  Heart,
  Sparkles,
  Users,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';

export type ProfileTabType = 'timeline' | 'about' | 'friends' | 'photos' | 'saved' | 'reactions';

interface ProfileNavTabsProps {
  activeTab: ProfileTabType;
  setActiveTab: (tab: ProfileTabType) => void;
  isViewingSelf: boolean;
  notesCount: number;
  mediaCount: number;
  savedCount: number;
  reactionsCount: number;
  isScrolled?: boolean;
  displayName?: string;
  photoURL?: string;
  onCreateNoteClick?: () => void;
  lang: 'bn' | 'en';
}

export const ProfileNavTabs: React.FC<ProfileNavTabsProps> = ({
  activeTab,
  setActiveTab,
  isViewingSelf,
  notesCount,
  mediaCount,
  savedCount,
  reactionsCount,
  isScrolled = false,
  displayName = 'User',
  photoURL,
  onCreateNoteClick,
  lang,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMoreTabActive = activeTab === 'saved' || activeTab === 'reactions';

  return (
    <div className="sticky top-0 z-30 bg-[#181310]/95 backdrop-blur-md border-b border-[#2C231B] px-4 sm:px-8 py-1.5 transition-all duration-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left / Primary Tabs List */}
        <div className="flex items-center gap-1 sm:gap-2 py-1 text-xs font-serif overflow-visible">
          
          {/* Scrolled Mini Profile Header in Sticky Bar */}
          {isScrolled && (
            <div className="flex items-center gap-2 pr-3 mr-2 border-r border-[#2C231B] shrink-0 animate-in fade-in">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C5A880]/70">
                {photoURL && photoURL.trim() ? (
                  <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#241C16] flex items-center justify-center text-xs text-[#C5A880]">
                    {displayName[0] || 'চি'}
                  </div>
                )}
              </div>
              <span className="font-medium text-xs text-[#FAF3EB] max-w-[120px] truncate hidden md:inline font-serif">
                {displayName}
              </span>
            </div>
          )}

          {/* 1. টাইমলাইন ও পোস্ট */}
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-[#C5A880]/15 text-[#FAF3EB] border border-[#C5A880]/60 shadow-sm'
                : 'text-[#8C7A6B] hover:bg-[#251E19] hover:text-[#FAF3EB] border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'টাইমলাইন ও পোস্ট' : 'Timeline & Posts'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
              {notesCount}
            </span>
          </button>

          {/* 2. পরিচিতি ও সুবাস */}
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#C5A880]/15 text-[#FAF3EB] border border-[#C5A880]/60 shadow-sm'
                : 'text-[#8C7A6B] hover:bg-[#251E19] hover:text-[#FAF3EB] border border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'পরিচিতি ও সুবাস' : 'About & Scent'}</span>
          </button>

          {/* 3. অনুরাগী ও বন্ধু */}
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'friends'
                ? 'bg-[#C5A880]/15 text-[#FAF3EB] border border-[#C5A880]/60 shadow-sm'
                : 'text-[#8C7A6B] hover:bg-[#251E19] hover:text-[#FAF3EB] border border-transparent'
            }`}
          >
            <Users className="w-4 h-4 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'অনুরাগী ও বন্ধু' : 'Friends & Readers'}</span>
          </button>

          {/* 4. ছবি ও মিডিয়া */}
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-[#C5A880]/15 text-[#FAF3EB] border border-[#C5A880]/60 shadow-sm'
                : 'text-[#8C7A6B] hover:bg-[#251E19] hover:text-[#FAF3EB] border border-transparent'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'ছবি ও মিডিয়া' : 'Photos & Media'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
              {mediaCount}
            </span>
          </button>

          {/* 5. ৩-ডট (•••) ড্রপডাউন বাটন - সংরক্ষিত চিরকুট, পছন্দ ও রিঅ্যাকশন */}
          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
                isMoreTabActive || showMoreMenu
                  ? 'bg-[#C5A880]/15 text-[#FAF3EB] border border-[#C5A880]/60 shadow-sm'
                  : 'text-[#8C7A6B] hover:bg-[#251E19] hover:text-[#FAF3EB] border border-transparent'
              }`}
              title={lang === 'bn' ? '৩-ডট আরও মেন্যু (সংরক্ষিত ও রিঅ্যাকশন)' : 'More options (3-dots)'}
            >
              <MoreHorizontal className="w-4.5 h-4.5 text-[#C5A880]" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'আরও' : 'More'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#8C7A6B] transition-transform duration-200 ${
                  showMoreMenu ? 'rotate-180 text-[#FAF3EB]' : ''
                }`}
              />
            </button>

            {/* ৩-ডট ড্রপডাউন মেন্যু প্যানেল */}
            {showMoreMenu && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 bg-[#1C1612] border border-[#3D3228] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-[#2C231B] mb-1.5">
                  <span className="text-[10px] uppercase font-serif tracking-widest text-[#8C7A6B]">
                    {lang === 'bn' ? 'অতিরিক্ত সেকশন ও অপশন' : 'Additional Sections'}
                  </span>
                </div>

                {/* ৫.১ সংরক্ষিত চিরকুট */}
                {isViewingSelf && (
                  <button
                    onClick={() => {
                      setActiveTab('saved');
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                      activeTab === 'saved'
                        ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                        : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Bookmark className="w-4 h-4 text-[#C5A880]" />
                      <span>{lang === 'bn' ? 'সংরক্ষিত চিরকুট' : 'Saved Notes'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
                        {savedCount}
                      </span>
                      {activeTab === 'saved' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                    </div>
                  </button>
                )}

                {/* ৫.২ পছন্দ ও রিঅ্যাকশন */}
                <button
                  onClick={() => {
                    setActiveTab('reactions');
                    setShowMoreMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                    activeTab === 'reactions'
                      ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                      : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-[#C5A880]" />
                    <span>{lang === 'bn' ? 'পছন্দ ও রিঅ্যাকশন' : 'Reactions & Likes'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
                      {reactionsCount}
                    </span>
                    {activeTab === 'reactions' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                  </div>
                </button>

                {/* মোবাইল / অতিরিক্ত ব্যাকআপ শর্টকাট */}
                <div className="pt-1.5 mt-1 border-t border-[#2C231B]">
                  <button
                    onClick={() => {
                      setActiveTab('photos');
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif text-[#8C7A6B] hover:bg-[#241C16] hover:text-[#FAF3EB] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#8C7A6B]" />
                      <span>{lang === 'bn' ? 'ছবি ও ভিজ্যুয়াল মিডিয়া' : 'Photos & Visual Media'}</span>
                    </div>
                    <span className="text-[10px] text-[#8C7A6B]">{mediaCount}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('about');
                      setShowMoreMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-serif text-[#8C7A6B] hover:bg-[#241C16] hover:text-[#FAF3EB] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8C7A6B]" />
                      <span>{lang === 'bn' ? 'পরিচিতি ও সম্পূর্ণ বায়ো' : 'About & Full Bio'}</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action button on scroll */}
        {isViewingSelf && isScrolled && (
          <div className="flex items-center gap-2 shrink-0 animate-in fade-in">
            <button
              onClick={onCreateNoteClick}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-[#14100E] text-xs font-serif font-medium transition-colors shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'চিরকুট লিখুন' : 'Create Note'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

