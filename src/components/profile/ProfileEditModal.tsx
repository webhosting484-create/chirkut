import React from 'react';
import { Edit3, X, Check } from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  setDisplayName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  joinedDate: string;
  setJoinedDate: (val: string) => void;
  favoriteScent: string;
  setFavoriteScent: (val: string) => void;
  favoriteMood: string;
  setFavoriteMood: (val: string) => void;
  website: string;
  setWebsite: (val: string) => void;
  facebookLink: string;
  setFacebookLink: (val: string) => void;
  instagramLink: string;
  setInstagramLink: (val: string) => void;
  twitterLink: string;
  setTwitterLink: (val: string) => void;
  onSaveProfile: () => void;
  savingProfile: boolean;
  lang: 'bn' | 'en';
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  displayName,
  setDisplayName,
  username,
  setUsername,
  bio,
  setBio,
  location,
  setLocation,
  joinedDate,
  setJoinedDate,
  favoriteScent,
  setFavoriteScent,
  favoriteMood,
  setFavoriteMood,
  website,
  setWebsite,
  facebookLink,
  setFacebookLink,
  instagramLink,
  setInstagramLink,
  twitterLink,
  setTwitterLink,
  onSaveProfile,
  savingProfile,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#181310] border border-[#3D3228] rounded-2xl p-6 sm:p-7 shadow-2xl text-xs font-serif text-[#E8DFD8] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#2C231B] mb-5">
          <h3 className="font-serif text-base text-[#FAF3EB] font-medium flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'প্রোফাইল তথ্য সম্পাদনা' : 'Edit Profile Info'}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-[#8C7A6B] hover:text-[#FAF3EB]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#A39282] mb-1">
              {lang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#A39282] mb-1">
              {lang === 'bn' ? 'ইউজারনেম' : 'Username'} (@)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#A39282] mb-1">
              {lang === 'bn' ? 'এক লাইনের বায়ো (Bio)' : 'Bio / Quote'}
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A39282] mb-1">
                {lang === 'bn' ? 'শহর / অবস্থান' : 'Location'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A39282] mb-1">
                {lang === 'bn' ? 'যুক্ত হওয়ার তারিখ' : 'Joined Date'}
              </label>
              <input
                type="text"
                value={joinedDate}
                onChange={(e) => setJoinedDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#A39282] mb-1">
                {lang === 'bn' ? 'প্রিয় সুবাস' : 'Favorite Scent'}
              </label>
              <input
                type="text"
                value={favoriteScent}
                onChange={(e) => setFavoriteScent(e.target.value)}
                className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A39282] mb-1">
                {lang === 'bn' ? 'অনুভূতির মেজাজ' : 'Mood / Vibe'}
              </label>
              <input
                type="text"
                value={favoriteMood}
                onChange={(e) => setFavoriteMood(e.target.value)}
                className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A39282] mb-1">
              {lang === 'bn' ? 'ওয়েবসাইট / পোর্টফোলিও' : 'Website URL'}
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs text-[#FAF3EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-[#A39282] mb-1">Facebook</label>
              <input
                type="text"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-2.5 py-1.5 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-lg text-[11px] text-[#FAF3EB] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#A39282] mb-1">Instagram</label>
              <input
                type="text"
                value={instagramLink}
                onChange={(e) => setInstagramLink(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-2.5 py-1.5 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-lg text-[11px] text-[#FAF3EB] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#A39282] mb-1">X / Twitter</label>
              <input
                type="text"
                value={twitterLink}
                onChange={(e) => setTwitterLink(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-2.5 py-1.5 bg-[#120E0C] border border-[#3D3228] focus:border-[#C5A880] rounded-lg text-[11px] text-[#FAF3EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2C231B] mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#8C7A6B] hover:text-[#FAF3EB] text-xs font-serif"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={onSaveProfile}
              disabled={savingProfile}
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-[#14100E] text-xs font-serif font-medium shadow-lg"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {savingProfile
                  ? lang === 'bn'
                    ? 'সংরক্ষণ হচ্ছে...'
                    : 'Saving...'
                  : lang === 'bn'
                  ? 'সংরক্ষণ করুন'
                  : 'Save Changes'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
