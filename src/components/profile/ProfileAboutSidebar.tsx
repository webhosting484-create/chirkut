import React from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Droplets,
  Wind,
  Globe,
  Image as ImageIcon,
  Eye,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { ChirkutNote } from '../../types';

interface ProfileAboutSidebarProps {
  location: string;
  joinedDate: string;
  favoriteScent: string;
  favoriteMood: string;
  website: string;
  facebookLink: string;
  instagramLink: string;
  twitterLink: string;
  isViewingSelf: boolean;
  onEditProfile: () => void;
  userMediaNotes: ChirkutNote[];
  onSelectNote: (note: ChirkutNote) => void;
  onViewAllPhotos: () => void;
  lang: 'bn' | 'en';
}

export const ProfileAboutSidebar: React.FC<ProfileAboutSidebarProps> = ({
  location,
  joinedDate,
  favoriteScent,
  favoriteMood,
  website,
  facebookLink,
  instagramLink,
  twitterLink,
  isViewingSelf,
  onEditProfile,
  userMediaNotes,
  onSelectNote,
  onViewAllPhotos,
  lang,
}) => {
  return (
    <div className="lg:col-span-4 space-y-5 font-serif">
      {/* Intro Box */}
      <div className="p-5 rounded-2xl bg-[#1C1612] border border-[#3D3228] shadow-xl text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#2C231B] mb-4">
          <h3 className="font-serif text-sm text-[#FAF3EB] font-bold flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'পরিচিতি ও তথ্য' : 'Intro'}</span>
          </h3>
          {isViewingSelf && (
            <button
              onClick={onEditProfile}
              className="text-[#C5A880] font-medium hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'সম্পাদনা' : 'Edit bio'}
            </button>
          )}
        </div>

        <div className="space-y-3.5 text-[#8C7A6B]">
          {location && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                {lang === 'bn' ? 'বসবাস করেন:' : 'Lives in'}{' '}
                <strong className="text-[#FAF3EB] font-medium">{location}</strong>
              </span>
            </div>
          )}

          {joinedDate && (
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>
                {lang === 'bn' ? 'যুক্ত হয়েছেন:' : 'Joined'}{' '}
                <strong className="text-[#FAF3EB] font-medium">{joinedDate}</strong>
              </span>
            </div>
          )}

          {favoriteScent && (
            <div className="flex items-start gap-2.5">
              <Droplets className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[#8C7A6B] block text-[11px]">
                  {lang === 'bn' ? 'প্রিয় সুবাস নোট:' : 'Favorite Scent:'}
                </span>
                <span className="text-[#FAF3EB] font-medium">{favoriteScent}</span>
              </div>
            </div>
          )}

          {favoriteMood && (
            <div className="flex items-center gap-2.5">
              <Wind className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {lang === 'bn' ? 'মনন:' : 'Atmosphere:'}{' '}
                <strong className="text-[#FAF3EB] font-medium">{favoriteMood}</strong>
              </span>
            </div>
          )}

          {website && (
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-[#C5A880] shrink-0" />
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#C5A880] hover:underline truncate"
              >
                {website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {instagramLink && (
            <div className="flex items-center gap-2.5">
              <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="text-[#C5A880] font-medium">@{instagramLink}</span>
            </div>
          )}
        </div>

        {/* Social Links Row */}
        {(facebookLink || instagramLink || twitterLink) && (
          <div className="pt-4 mt-4 border-t border-[#2C231B] flex items-center gap-2 flex-wrap">
            {facebookLink && (
              <a
                href={facebookLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241C16] border border-[#3D3228] text-[#FAF3EB] text-xs hover:border-[#C5A880] transition-colors"
              >
                <Facebook className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Facebook</span>
              </a>
            )}
            {instagramLink && (
              <a
                href={`https://instagram.com/${instagramLink.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241C16] border border-[#3D3228] text-[#FAF3EB] text-xs hover:border-[#C5A880] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Instagram</span>
              </a>
            )}
            {twitterLink && (
              <a
                href={twitterLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241C16] border border-[#3D3228] text-[#FAF3EB] text-xs hover:border-[#C5A880] transition-colors"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>X / Twitter</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Photos Box */}
      {userMediaNotes.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#1C1612] border border-[#3D3228] shadow-xl text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#2C231B] mb-3">
            <h3 className="font-serif text-sm text-[#FAF3EB] font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#C5A880]" />
              <span>{lang === 'bn' ? 'ছবি ও স্মৃতি' : 'Photos'}</span>
            </h3>
            <button
              onClick={onViewAllPhotos}
              className="text-[#C5A880] font-medium hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'সব দেখুন' : 'See all'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {userMediaNotes.slice(0, 6).map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className="h-20 rounded-xl overflow-hidden border border-[#3D3228] hover:border-[#C5A880] cursor-pointer group relative shadow-sm"
              >
                {note.bgImageUrl && note.bgImageUrl.trim() ? (
                  <img
                    src={note.bgImageUrl}
                    alt="Media preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : note.videoUrl && note.videoUrl.trim() ? (
                  <video
                    src={note.videoUrl}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    muted
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-4 h-4 text-[#FAF3EB]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
