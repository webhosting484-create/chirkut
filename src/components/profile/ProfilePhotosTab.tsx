import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { ChirkutNote } from '../../types';

interface ProfilePhotosTabProps {
  userMediaNotes: ChirkutNote[];
  onSelectNote: (note: ChirkutNote) => void;
  lang: 'bn' | 'en';
}

export const ProfilePhotosTab: React.FC<ProfilePhotosTabProps> = ({
  userMediaNotes,
  onSelectNote,
  lang,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#1A1411] border border-[#2D231B] shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#281F17] mb-6">
        <div>
          <h3 className="font-serif text-base text-[#FAF3EB] font-medium">
            {lang === 'bn' ? 'ছবি ও ভিজ্যুয়াল আর্ট গ্যালারি' : 'Photos & Visual Media'}
          </h3>
          <p className="text-xs font-serif text-[#8C7A6B]">
            {lang === 'bn'
              ? 'চিরকুটের সাথে যুক্ত সমস্ত ভিজ্যুয়াল ছবি ও আর্টওয়ার্ক।'
              : 'All photography and artwork associated with these notes.'}
          </p>
        </div>
      </div>

      {userMediaNotes.length === 0 ? (
        <div className="py-16 text-center text-xs font-serif text-[#8C7A6B]">
          <ImageIcon className="w-10 h-10 text-[#C5A880]/30 mx-auto mb-3" />
          <p>{lang === 'bn' ? 'কোনো ছবি বা মিডিয়া পাওয়া যায়নি।' : 'No media attached yet.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userMediaNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className="group relative h-44 rounded-xl overflow-hidden border border-[#3A2E24] hover:border-[#C5A880] cursor-pointer shadow-md"
            >
              {note.bgImageUrl && note.bgImageUrl.trim() ? (
                <img
                  src={note.bgImageUrl}
                  alt={note.quote}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : note.videoUrl && note.videoUrl.trim() ? (
                <video
                  src={note.videoUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  muted
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-xs font-serif text-[#FAF3EB] line-clamp-2 italic">
                  "{note.quote}"
                </p>
                <span className="text-[10px] text-[#C5A880] font-serif mt-1">
                  {note.location || 'চিরকুট'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
