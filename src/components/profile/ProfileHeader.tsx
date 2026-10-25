import React, { useRef, useState, useEffect } from 'react';
import {
  Feather,
  Minimize2,
  Maximize2,
  Share2,
  X,
  Camera,
  Check,
  CheckCircle2,
  Edit3,
  LogOut,
  Upload,
  Image as ImageIcon,
  Plus,
  MoreHorizontal,
  MapPin,
  Users,
  Instagram,
  Settings,
  Layers,
  Sparkles,
  Bookmark,
  Heart,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { COVER_PRESETS, AVATAR_PRESETS } from '../../data/authorProfiles';
import { db, doc, setDoc } from '../../lib/firebase';
import { ProfileTabType } from './ProfileNavTabs';

interface ProfileHeaderProps {
  isViewingSelf: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onShareProfile: () => void;
  onClose: () => void;
  displayName: string;
  username: string;
  bio: string;
  location?: string;
  instagramLink?: string;
  notesCount: number;
  savedCount?: number;
  reactionsCount?: number;
  mediaCount?: number;
  activeTab?: ProfileTabType;
  onSelectTab?: (tab: ProfileTabType) => void;
  coverPhoto: string;
  photoURL: string;
  user: UserProfile | null;
  isChangingCover: boolean;
  setIsChangingCover: (val: boolean) => void;
  isChangingAvatar: boolean;
  setIsChangingAvatar: (val: boolean) => void;
  setCoverPhoto: (val: string) => void;
  setPhotoURL: (val: string) => void;
  customCoverUrl: string;
  setCustomCoverUrl: (val: string) => void;
  customAvatarUrl: string;
  setCustomAvatarUrl: (val: string) => void;
  onEditProfile: () => void;
  onSignOut: () => void;
  isFollowing: boolean;
  setIsFollowing: (val: boolean) => void;
  onSelectTimeline: () => void;
  lang: 'bn' | 'en';
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isViewingSelf,
  isFullscreen,
  onToggleFullscreen,
  onShareProfile,
  onClose,
  displayName,
  username,
  bio,
  location = 'ঢাকা, বাংলাদেশ',
  instagramLink = 'aninislam.3',
  notesCount,
  savedCount = 0,
  reactionsCount = 0,
  mediaCount = 0,
  activeTab = 'timeline',
  onSelectTab,
  coverPhoto,
  photoURL,
  user,
  isChangingCover,
  setIsChangingCover,
  isChangingAvatar,
  setIsChangingAvatar,
  setCoverPhoto,
  setPhotoURL,
  customCoverUrl,
  setCustomCoverUrl,
  customAvatarUrl,
  setCustomAvatarUrl,
  onEditProfile,
  onSignOut,
  isFollowing,
  setIsFollowing,
  onSelectTimeline,
  lang,
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Close 3-dot dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreActions(false);
      }
    };
    if (showMoreActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMoreActions]);

  // Handle local file upload for cover photo
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCoverPhoto(result);
        setIsChangingCover(false);
        if (user) {
          try {
            const cached = localStorage.getItem(`user_profile_${user.uid}`);
            const parsed = cached ? JSON.parse(cached) : {};
            localStorage.setItem(
              `user_profile_${user.uid}`,
              JSON.stringify({ ...parsed, coverPhoto: result })
            );
            setDoc(doc(db, 'users', user.uid), { coverPhoto: result }, { merge: true });
          } catch {
            // ignore
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle local file upload for avatar
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoURL(result);
        setIsChangingAvatar(false);
        if (user) {
          try {
            const cached = localStorage.getItem(`user_profile_${user.uid}`);
            const parsed = cached ? JSON.parse(cached) : {};
            localStorage.setItem(
              `user_profile_${user.uid}`,
              JSON.stringify({ ...parsed, photoURL: result })
            );
            setDoc(doc(db, 'users', user.uid), { photoURL: result }, { merge: true });
          } catch {
            // ignore
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full bg-[#14100E] text-[#E8DFD8] select-none font-serif">
      {/* Top Floating Control Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#181310] border-b border-[#2C231B]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880]">
            <Feather className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-serif font-medium text-[#FAF3EB]">
              {isViewingSelf
                ? lang === 'bn'
                  ? 'আপনার প্রোফাইল'
                  : 'Your Profile'
                : `${displayName} — ${lang === 'bn' ? 'লেখক প্রোফাইল' : 'Profile'}`}
            </h3>
            <span className="text-[10px] text-[#8C7A6B]">
              @{username || 'chirkut.user'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#FAF3EB] hover:bg-[#241C16] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onShareProfile}
            className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#FAF3EB] hover:bg-[#241C16] transition-colors cursor-pointer"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* COVER PHOTO & HERO SECTION */}
      <div className="relative w-full bg-[#14100E] group">
        {/* Cover Photo Background Image */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-[#181310]">
          <img
            src={
              coverPhoto && coverPhoto.trim()
                ? coverPhoto
                : 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1400&q=80'
            }
            alt="Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
          />
          {/* Subtle bottom shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14100E] via-[#14100E]/60 to-transparent pointer-events-none" />

          {/* Edit cover photo button (Bottom right of cover) */}
          {isViewingSelf && (
            <div className="absolute bottom-4 right-4 sm:right-8 z-20">
              <button
                onClick={() => setIsChangingCover(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14100E]/90 hover:bg-[#14100E] backdrop-blur-md border border-[#3D3228] hover:border-[#C5A880]/60 text-[#FAF3EB] text-xs font-serif transition-all shadow-xl hover:scale-105 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#C5A880]" />
                <span>
                  {lang === 'bn' ? 'Edit cover photo' : 'Edit cover photo'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* HERO DETAILS ROW */}
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-8 -mt-20 sm:-mt-24 md:-mt-28 relative z-20 pb-6 border-b border-[#2C231B]">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-5">
            
            {/* Left: Avatar + Title + Bio & Meta */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
              
              {/* Circular Avatar with Gold Ring Border */}
              <div className="relative group/avatar shrink-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#C5A880] p-1 bg-[#241C16] overflow-hidden shadow-2xl flex items-center justify-center">
                  {photoURL && photoURL.trim() ? (
                    <img
                      src={photoURL}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#241C16] flex items-center justify-center font-serif font-bold text-4xl text-[#C5A880]">
                      {displayName && typeof displayName === 'string' && displayName.length > 0
                        ? displayName[0]
                        : 'চি'}
                    </div>
                  )}
                </div>

                {/* Camera Edit Button on Avatar */}
                {isViewingSelf && (
                  <button
                    onClick={() => setIsChangingAvatar(true)}
                    className="absolute bottom-2 right-2 p-2.5 rounded-full bg-[#241C16] hover:bg-[#2C231B] text-[#FAF3EB] border-2 border-[#14100E] hover:border-[#C5A880] hover:scale-110 transition-all shadow-lg cursor-pointer"
                    title={lang === 'bn' ? 'ছবি পরিবর্তন করুন' : 'Change Avatar'}
                  >
                    <Camera className="w-4 h-4 text-[#C5A880]" />
                  </button>
                )}
              </div>

              {/* Name, Verified Badge, Followers & Meta Details */}
              <div className="pt-2 sm:pt-0">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF3EB] font-bold tracking-tight">
                    {displayName}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-[#C5A880] fill-[#C5A880]/20" />
                </div>

                {/* Follower Count & Friends */}
                <p className="text-xs font-serif text-[#8C7A6B] mt-1 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-[#FAF3EB]">
                    <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Followed by 994,34 Peoples</span>
                  </span>
                  <span>•</span>
                  <span>{notesCount * 17 + 334} {lang === 'bn' ? 'জন অনুরাগী ও বন্ধু' : 'Friends'}</span>
                </p>

                {/* Location & Instagram Link */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs font-serif text-[#8C7A6B] flex-wrap">
                  {location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{location}</span>
                    </span>
                  )}
                  {instagramLink && (
                    <span className="flex items-center gap-1 text-[#C5A880]">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>{instagramLink}</span>
                    </span>
                  )}
                </div>

                {/* Bio Quote */}
                {bio && (
                  <p className="text-xs font-serif text-[#8C7A6B] mt-2 max-w-lg leading-relaxed">
                    {bio}
                  </p>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center sm:justify-end">
              {isViewingSelf ? (
                <>
                  {/* + Add to story / চিরকুট লিখুন */}
                  <button
                    onClick={onSelectTimeline}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-[#14100E] text-xs font-serif font-medium transition-all shadow-md hover:scale-105 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'bn' ? '+ Add to story / চিরকুট লিখুন' : '+ Add to story'}</span>
                  </button>

                  {/* Edit profile */}
                  <button
                    onClick={onEditProfile}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#241C16] hover:bg-[#2C231B] text-[#FAF3EB] border border-[#3D3228] hover:border-[#C5A880]/60 text-xs font-serif font-medium transition-colors shadow-md cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{lang === 'bn' ? 'Edit profile' : 'Edit profile'}</span>
                  </button>

                  {/* 3 Dot Settings & Navigation Options Menu */}
                  <div className="relative" ref={moreMenuRef}>
                    <button
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className={`p-2.5 rounded-xl text-xs font-serif transition-colors shadow-md cursor-pointer flex items-center justify-center ${
                        showMoreActions
                          ? 'bg-[#C5A880] text-[#14100E]'
                          : 'bg-[#241C16] hover:bg-[#2C231B] text-[#FAF3EB] border border-[#3D3228] hover:border-[#C5A880]/60'
                      }`}
                      title={lang === 'bn' ? 'মেন্যু ও অপশন্স (৩-ডট)' : 'Options & Settings'}
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#C5A880]" />
                    </button>

                    {showMoreActions && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-[#1C1612] border border-[#3D3228] rounded-2xl shadow-2xl p-2 z-50 text-xs font-serif animate-in fade-in">
                        {/* ১. সেকশন ও পেজ তালিকা */}
                        <div className="px-3 py-1.5 border-b border-[#2C231B] mb-1.5 flex items-center justify-between">
                          <span className="text-[10px] uppercase font-serif tracking-widest text-[#8C7A6B]">
                            {lang === 'bn' ? 'বিভাগ ও পাতা' : 'Navigation Tabs'}
                          </span>
                        </div>

                        {/* ১. টাইমলাইন ও পোস্ট */}
                        <button
                          onClick={() => {
                            onSelectTab?.('timeline');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'timeline'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'টাইমলাইন ও পোস্ট' : 'Timeline & Posts'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
                              {notesCount}
                            </span>
                            {activeTab === 'timeline' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                          </div>
                        </button>

                        {/* ২. পরিচিতি ও সুবাস */}
                        <button
                          onClick={() => {
                            onSelectTab?.('about');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'about'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'পরিচিতি ও সুবাস' : 'About & Fragrance'}</span>
                          </div>
                          {activeTab === 'about' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>

                        {/* ৩. অনুরাগী ও বন্ধু */}
                        <button
                          onClick={() => {
                            onSelectTab?.('friends');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'friends'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'অনুরাগী ও বন্ধু' : 'Fans & Friends'}</span>
                          </div>
                          {activeTab === 'friends' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>

                        {/* ৪. ছবি ও মিডিয়া */}
                        <button
                          onClick={() => {
                            onSelectTab?.('photos');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'photos'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ImageIcon className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'ছবি ও মিডিয়া' : 'Photos & Media'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {mediaCount !== undefined && (
                              <span className="px-1.5 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
                                {mediaCount}
                              </span>
                            )}
                            {activeTab === 'photos' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                          </div>
                        </button>

                        {/* ৫. সংরক্ষিত চিরকুট */}
                        {isViewingSelf && (
                          <button
                            onClick={() => {
                              onSelectTab?.('saved');
                              setShowMoreActions(false);
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
                              <span className="px-1.5 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
                                {savedCount}
                              </span>
                              {activeTab === 'saved' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                            </div>
                          </button>
                        )}

                        {/* ৬. পছন্দ ও রিঅ্যাকশন */}
                        <button
                          onClick={() => {
                            onSelectTab?.('reactions');
                            setShowMoreActions(false);
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
                            <span className="px-1.5 py-0.5 rounded-full bg-[#241C16] text-[10px] text-[#A39282] border border-[#3D3228]">
                              {reactionsCount}
                            </span>
                            {activeTab === 'reactions' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                          </div>
                        </button>

                        <div className="h-px bg-[#2C231B] my-2" />

                        {/* ২. প্রোফাইল সেটিংস ও নিয়ন্ত্রণ */}
                        <div className="px-3 py-1 text-[10px] uppercase font-serif tracking-widest text-[#8C7A6B]">
                          {lang === 'bn' ? 'সেটিংস ও কন্ট্রোল' : 'Settings & Options'}
                        </div>

                        {/* Profile Edit & Settings */}
                        <button
                          onClick={() => {
                            onEditProfile();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[#FAF3EB] hover:bg-[#241C16] rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#C5A880]" />
                          <span>{lang === 'bn' ? 'প্রোফাইল সেটিংস ও সম্পাদনা' : 'Profile Settings & Edit'}</span>
                        </button>

                        {/* Change Cover Photo */}
                        <button
                          onClick={() => {
                            setIsChangingCover(true);
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[#FAF3EB] hover:bg-[#241C16] rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <ImageIcon className="w-4 h-4 text-[#C5A880]" />
                          <span>{lang === 'bn' ? 'কভার ফটো পরিবর্তন' : 'Change Cover Photo'}</span>
                        </button>

                        {/* Change Avatar */}
                        <button
                          onClick={() => {
                            setIsChangingAvatar(true);
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[#FAF3EB] hover:bg-[#241C16] rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Camera className="w-4 h-4 text-[#C5A880]" />
                          <span>{lang === 'bn' ? 'প্রোফাইল ছবি পরিবর্তন' : 'Change Avatar'}</span>
                        </button>

                        {/* Share Profile Link */}
                        <button
                          onClick={() => {
                            onShareProfile();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[#FAF3EB] hover:bg-[#241C16] rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-[#C5A880]" />
                          <span>{lang === 'bn' ? 'প্রোফাইল লিংক শেয়ার' : 'Share Profile Link'}</span>
                        </button>

                        {/* Fullscreen toggle */}
                        <button
                          onClick={() => {
                            onToggleFullscreen();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[#FAF3EB] hover:bg-[#241C16] rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          {isFullscreen ? (
                            <>
                              <Minimize2 className="w-4 h-4 text-[#C5A880]" />
                              <span>{lang === 'bn' ? 'ছোট পর্দায় দেখুন' : 'Exit Fullscreen'}</span>
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                              <span>{lang === 'bn' ? 'পূর্ণ পর্দায় দেখুন' : 'Fullscreen'}</span>
                            </>
                          )}
                        </button>

                        <div className="h-px bg-[#2C231B] my-1.5" />

                        {/* Sign Out */}
                        <button
                          onClick={() => {
                            onSignOut();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{lang === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-serif font-medium transition-all shadow-md cursor-pointer ${
                      isFollowing
                        ? 'bg-[#241C16] text-[#C5A880] border border-[#C5A880]/60'
                        : 'bg-[#C5A880] text-[#14100E] hover:bg-[#D4AF37]'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {isFollowing
                        ? lang === 'bn'
                          ? 'Following'
                          : 'Following'
                        : lang === 'bn'
                        ? 'Follow'
                        : 'Follow'}
                    </span>
                  </button>

                  <button
                    onClick={onSelectTimeline}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#241C16] hover:bg-[#2C231B] text-[#FAF3EB] border border-[#3D3228] text-xs font-serif transition-colors cursor-pointer"
                  >
                    <Feather className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{lang === 'bn' ? 'Message / চিরকুট' : 'Message'}</span>
                  </button>

                  {/* 3 Dot Navigation Options for Visitor */}
                  <div className="relative" ref={moreMenuRef}>
                    <button
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className={`p-2.5 rounded-xl text-xs font-serif transition-colors shadow-md cursor-pointer flex items-center justify-center ${
                        showMoreActions
                          ? 'bg-[#C5A880] text-[#14100E]'
                          : 'bg-[#241C16] hover:bg-[#2C231B] text-[#FAF3EB] border border-[#3D3228] hover:border-[#C5A880]/60'
                      }`}
                      title={lang === 'bn' ? 'মেন্যু ও পাতা (৩-ডট)' : 'Options'}
                    >
                      <MoreHorizontal className="w-4 h-4 text-[#C5A880]" />
                    </button>

                    {showMoreActions && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-[#1C1612] border border-[#3D3228] rounded-2xl shadow-2xl p-2 z-50 text-xs font-serif animate-in fade-in">
                        <div className="px-3 py-1.5 border-b border-[#2C231B] mb-1.5">
                          <span className="text-[10px] uppercase font-serif tracking-widest text-[#8C7A6B]">
                            {lang === 'bn' ? 'বিভাগ ও পাতা' : 'Navigation Tabs'}
                          </span>
                        </div>

                        {/* ১. টাইমলাইন ও পোস্ট */}
                        <button
                          onClick={() => {
                            onSelectTab?.('timeline');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'timeline'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Layers className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'টাইমলাইন ও পোস্ট' : 'Timeline & Posts'}</span>
                          </div>
                          {activeTab === 'timeline' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>

                        {/* ২. পরিচিতি ও সুবাস */}
                        <button
                          onClick={() => {
                            onSelectTab?.('about');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'about'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'পরিচিতি ও সুবাস' : 'About & Fragrance'}</span>
                          </div>
                          {activeTab === 'about' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>

                        {/* ৩. অনুরাগী ও বন্ধু */}
                        <button
                          onClick={() => {
                            onSelectTab?.('friends');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'friends'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Users className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'অনুরাগী ও বন্ধু' : 'Fans & Friends'}</span>
                          </div>
                          {activeTab === 'friends' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>

                        {/* ৪. ছবি ও মিডিয়া */}
                        <button
                          onClick={() => {
                            onSelectTab?.('photos');
                            setShowMoreActions(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-serif transition-colors cursor-pointer mb-1 ${
                            activeTab === 'photos'
                              ? 'bg-[#C5A880]/20 text-[#FAF3EB] font-medium border border-[#C5A880]/50'
                              : 'text-[#C8BCB0] hover:bg-[#241C16] hover:text-[#FAF3EB]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <ImageIcon className="w-4 h-4 text-[#C5A880]" />
                            <span>{lang === 'bn' ? 'ছবি ও মিডিয়া' : 'Photos & Media'}</span>
                          </div>
                          {activeTab === 'photos' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>

                        {/* ৫. পছন্দ ও রিঅ্যাকশন */}
                        <button
                          onClick={() => {
                            onSelectTab?.('reactions');
                            setShowMoreActions(false);
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
                          {activeTab === 'reactions' && <Check className="w-3.5 h-3.5 text-[#C5A880]" />}
                        </button>

                        <div className="h-px bg-[#2C231B] my-2" />

                        {/* Share */}
                        <button
                          onClick={() => {
                            onShareProfile();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[#FAF3EB] hover:bg-[#241C16] rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Share2 className="w-4 h-4 text-[#C5A880]" />
                          <span>{lang === 'bn' ? 'প্রোফাইল লিংক শেয়ার' : 'Share Profile Link'}</span>
                        </button>

                        {/* Fullscreen */}
                        <button
                          onClick={() => {
                            onToggleFullscreen();
                            setShowMoreActions(false);
                          }}
                          className="w-full px-3 py-2 text-left text-[#FAF3EB] hover:bg-[#241C16] rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          {isFullscreen ? (
                            <>
                              <Minimize2 className="w-4 h-4 text-[#C5A880]" />
                              <span>{lang === 'bn' ? 'ছোট পর্দায় দেখুন' : 'Exit Fullscreen'}</span>
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                              <span>{lang === 'bn' ? 'পূর্ণ পর্দায় দেখুন' : 'Fullscreen'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COVER PHOTO PICKER MODAL */}
      {/* ========================================================================= */}
      {isChangingCover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsChangingCover(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-[#1C1612] border border-[#3D3228] rounded-2xl shadow-2xl p-6 text-[#FAF3EB] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2C231B] mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#C5A880]" />
                <h3 className="text-sm font-serif font-bold text-[#FAF3EB]">
                  {lang === 'bn' ? 'কভার ফটো পরিবর্তন ও আপলোড' : 'Change Cover Photo'}
                </h3>
              </div>
              <button
                onClick={() => setIsChangingCover(false)}
                className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#FAF3EB] hover:bg-[#241C16] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Device Upload Button */}
            <div className="mb-5">
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileUpload}
                className="hidden"
              />
              <button
                onClick={() => coverFileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-[#241C16] border-2 border-dashed border-[#C5A880]/40 hover:border-[#C5A880] flex items-center justify-center gap-2.5 text-xs font-serif font-medium text-[#C5A880] hover:bg-[#C5A880]/10 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{lang === 'bn' ? '📁 আপনার ডিভাইস থেকে কভার ছবি আপলোড করুন' : 'Upload from device'}</span>
              </button>
            </div>

            {/* Presets Gallery */}
            <div className="mb-5">
              <span className="block text-xs font-serif text-[#8C7A6B] mb-2.5">
                {lang === 'bn' ? 'অথবা গ্যালারি থেকে আর্ট বেছে নিন:' : 'Or choose from presets:'}
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {COVER_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setCoverPhoto(preset.url);
                      setIsChangingCover(false);
                      if (user) {
                        try {
                          const cached = localStorage.getItem(`user_profile_${user.uid}`);
                          const parsed = cached ? JSON.parse(cached) : {};
                          localStorage.setItem(
                            `user_profile_${user.uid}`,
                            JSON.stringify({ ...parsed, coverPhoto: preset.url })
                          );
                          setDoc(doc(db, 'users', user.uid), { coverPhoto: preset.url }, { merge: true });
                        } catch {
                          // ignore
                        }
                      }
                    }}
                    className="h-16 rounded-xl overflow-hidden border border-[#3D3228] hover:border-[#C5A880] cursor-pointer relative group/item transition-transform hover:scale-105"
                  >
                    <img src={preset.url} alt={preset.nameBn} className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/item:opacity-100 text-[10px] text-[#FAF3EB] text-center px-1 font-serif">
                      {lang === 'bn' ? preset.nameBn : preset.nameEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div>
              <span className="block text-xs font-serif text-[#8C7A6B] mb-2">
                {lang === 'bn' ? 'ইন্টারনেট থেকে সরাসরি ছবির লিংক:' : 'Or enter image URL:'}
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/cover.jpg"
                  value={customCoverUrl}
                  onChange={(e) => setCustomCoverUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#241C16] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customCoverUrl.trim()) {
                      setCoverPhoto(customCoverUrl.trim());
                      setCustomCoverUrl('');
                      setIsChangingCover(false);
                    }
                  }}
                  className="px-4 py-2 bg-[#C5A880] text-[#14100E] rounded-xl text-xs font-serif font-medium hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সেট করুন' : 'Apply'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AVATAR PICKER MODAL */}
      {/* ========================================================================= */}
      {isChangingAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsChangingAvatar(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-[#1C1612] border border-[#3D3228] rounded-2xl shadow-2xl p-6 text-[#FAF3EB] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2C231B] mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#C5A880]" />
                <h3 className="text-sm font-serif font-bold text-[#FAF3EB]">
                  {lang === 'bn' ? 'প্রোফাইল ছবি পরিবর্তন ও আপলোড' : 'Change Profile Picture'}
                </h3>
              </div>
              <button
                onClick={() => setIsChangingAvatar(false)}
                className="p-1.5 rounded-lg text-[#8C7A6B] hover:text-[#FAF3EB] hover:bg-[#241C16] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Device Upload Button */}
            <div className="mb-5">
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileUpload}
                className="hidden"
              />
              <button
                onClick={() => avatarFileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl bg-[#241C16] border-2 border-dashed border-[#C5A880]/40 hover:border-[#C5A880] flex items-center justify-center gap-2.5 text-xs font-serif font-medium text-[#C5A880] hover:bg-[#C5A880]/10 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>{lang === 'bn' ? '📁 আপনার ডিভাইস থেকে প্রোফাইল ছবি আপলোড করুন' : 'Upload photo from device'}</span>
              </button>
            </div>

            {/* Presets Gallery */}
            <div className="mb-5">
              <span className="block text-xs font-serif text-[#8C7A6B] mb-2.5">
                {lang === 'bn' ? 'অথবা প্রিভিউ অবতার বেছে নিন:' : 'Or choose preset avatar:'}
              </span>
              <div className="grid grid-cols-3 gap-3">
                {AVATAR_PRESETS.map((presetUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPhotoURL(presetUrl);
                      setIsChangingAvatar(false);
                      if (user) {
                        try {
                          const cached = localStorage.getItem(`user_profile_${user.uid}`);
                          const parsed = cached ? JSON.parse(cached) : {};
                          localStorage.setItem(
                            `user_profile_${user.uid}`,
                            JSON.stringify({ ...parsed, photoURL: presetUrl })
                          );
                          setDoc(doc(db, 'users', user.uid), { photoURL: presetUrl }, { merge: true });
                        } catch {
                          // ignore
                        }
                      }
                    }}
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#3D3228] hover:border-[#C5A880] cursor-pointer mx-auto transition-transform hover:scale-110 shadow-lg"
                  >
                    <img src={presetUrl} alt="Avatar Preset" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div>
              <span className="block text-xs font-serif text-[#8C7A6B] mb-2">
                {lang === 'bn' ? 'ইন্টারনেট থেকে সরাসরি ছবির লিংক:' : 'Or enter image URL:'}
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#241C16] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (customAvatarUrl.trim()) {
                      setPhotoURL(customAvatarUrl.trim());
                      setCustomAvatarUrl('');
                      setIsChangingAvatar(false);
                    }
                  }}
                  className="px-4 py-2 bg-[#C5A880] text-[#14100E] rounded-xl text-xs font-serif font-medium hover:bg-[#D4AF37] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'সেট করুন' : 'Apply'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
