import React from 'react';
import { Bookmark, Eye } from 'lucide-react';
import { ChirkutNote } from '../../types';

interface ProfileSavedTabProps {
  savedNotes: ChirkutNote[];
  onSelectNote: (note: ChirkutNote) => void;
  lang: 'bn' | 'en';
}

export const ProfileSavedTab: React.FC<ProfileSavedTabProps> = ({
  savedNotes,
  onSelectNote,
  lang,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#1A1411] border border-[#2D231B] shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#281F17] mb-6">
        <div>
          <h3 className="font-serif text-base text-[#FAF3EB] font-medium">
            {lang === 'bn' ? 'সংরক্ষিত চিরকুট সংকলন' : 'Saved & Bookmarked Notes'}
          </h3>
          <p className="text-xs font-serif text-[#8C7A6B]">
            {lang === 'bn'
              ? 'যেসব চিরকুট আপনি পরবর্তীতে পড়ার জন্য বুকমার্ক করে রেখেছেন।'
              : 'Notes you have pinned to read again later.'}
          </p>
        </div>
      </div>

      {savedNotes.length === 0 ? (
        <div className="py-16 text-center text-xs font-serif text-[#8C7A6B]">
          <Bookmark className="w-10 h-10 text-[#C5A880]/30 mx-auto mb-3" />
          <p>
            {lang === 'bn'
              ? 'আপনার বুকমার্কে কোনো চিরকুট নেই। ফিড থেকে পছন্দের চিরকুটে বুকমার্ক চাপুন।'
              : 'No bookmarked notes yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className="cursor-pointer p-4 rounded-xl border border-[#2D241E] bg-[#201915] hover:border-[#C5A880] transition-all flex items-center justify-between group"
            >
              <div>
                <p className="font-serif text-xs text-[#FAF3EB] line-clamp-1 italic group-hover:text-[#C5A880]">
                  "{note.quote}"
                </p>
                <span className="text-[10px] font-serif text-[#A05D46] mt-1 block">
                  — {note.author} • {note.location}
                </span>
              </div>
              <Eye className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#FAF3EB] shrink-0 ml-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
