import React from 'react';
import { Heart } from 'lucide-react';
import { ChirkutNote } from '../../types';

interface ProfileReactionsTabProps {
  reactedNotes: ChirkutNote[];
  onSelectNote: (note: ChirkutNote) => void;
  lang: 'bn' | 'en';
}

export const ProfileReactionsTab: React.FC<ProfileReactionsTabProps> = ({
  reactedNotes,
  onSelectNote,
  lang,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#1A1411] border border-[#2D231B] shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#281F17] mb-6">
        <div>
          <h3 className="font-serif text-base text-[#FAF3EB] font-medium">
            {lang === 'bn' ? 'পছন্দ ও রিঅ্যাকশন দেওয়া চিরকুট' : 'Reacted & Liked Notes'}
          </h3>
          <p className="text-xs font-serif text-[#8C7A6B]">
            {lang === 'bn'
              ? 'যেসব চিরকুটে আপনি ভালোবাসা বা প্রতিক্রিয়া জানিয়েছেন।'
              : 'Notes where you left a heartfelt reaction.'}
          </p>
        </div>
      </div>

      {reactedNotes.length === 0 ? (
        <div className="py-16 text-center text-xs font-serif text-[#8C7A6B]">
          <Heart className="w-10 h-10 text-[#C5A880]/30 mx-auto mb-3" />
          <p>
            {lang === 'bn'
              ? 'আপনি এখনও কোনো চিরকুটে রিঅ্যাক্ট করেননি।'
              : 'No reactions recorded yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reactedNotes.map((note) => (
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
                  — {note.author}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[10px] font-serif flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{note.userReaction}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
