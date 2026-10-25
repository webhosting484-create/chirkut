import React, { useState } from 'react';
import { ChirkutNote } from '../types';
import { CATEGORY_LABELS } from '../data/chirkutData';
import { X, Sparkles, MapPin, Calendar, Share2, Check, Heart, BookOpen } from 'lucide-react';

interface ChirkutModalProps {
  note: ChirkutNote | null;
  onClose: () => void;
  onOpenAuthorProfile?: (author: { name: string; id?: string; avatar?: string }) => void;
  lang: 'bn' | 'en';
}

export const ChirkutModal: React.FC<ChirkutModalProps> = ({
  note,
  onClose,
  onOpenAuthorProfile,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!note) return null;

  const handleCopy = () => {
    const text = `"${lang === 'bn' ? note.quoteBn : note.quote}"\n— ${note.author}\n${note.location ? `স্থান: ${note.location}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPaperBg = (color?: string) => {
    switch (color) {
      case 'rose':
        return 'bg-[#FDF6F4] text-[#2C1917] border-[#E8C5BE]';
      case 'amber':
        return 'bg-[#FBF6EC] text-[#2C2114] border-[#E2D2B5]';
      case 'sage':
        return 'bg-[#F4F7F2] text-[#1D261C] border-[#CCD9CA]';
      case 'slate':
        return 'bg-[#F3F4F7] text-[#191D24] border-[#CBD2DC]';
      case 'parchment':
      default:
        return 'bg-[#FAF5ED] text-[#261E18] border-[#DECDB8]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm border p-6 sm:p-10 shadow-2xl ${getPaperBg(
          note.paperColor
        )}`}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-current/60 hover:text-current transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Paper texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#968270_0.75px,transparent_0.75px)] [background-size:12px_12px]" />

        {/* Header line */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-current/15 mb-6">
          <div
            onClick={() => {
              if (onOpenAuthorProfile) {
                onClose();
                onOpenAuthorProfile({
                  name: note.author,
                  id: note.authorId,
                  avatar: note.authorAvatar,
                });
              }
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-100 group"
            title={lang === 'bn' ? `${note.author}-এর প্রোফাইল দেখুন` : `View ${note.author}'s profile`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#9E4738] inline-block shadow-sm group-hover:scale-125 transition-transform"></span>
            <span className="text-xs uppercase tracking-[0.2em] font-serif font-bold opacity-80 group-hover:text-[#9E4738] transition-colors underline decoration-dotted">
              {note.author}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-serif italic opacity-85 flex-wrap">
            {note.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/10 border border-current/15 text-[11px] font-sans font-semibold not-italic">
                <Sparkles className="w-3 h-3 text-[#9E4738]" />
                <span>{CATEGORY_LABELS[note.category]?.[lang] || note.category}</span>
              </span>
            )}
            {note.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#A05D46]" />
                {note.location}
              </span>
            )}
            {note.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#A05D46]" />
                {note.date}
              </span>
            )}
          </div>
        </div>

        {/* Main Handwritten Quote */}
        <div className="my-6">
          <blockquote className="font-handwriting text-3xl sm:text-4xl leading-relaxed text-[#1F1712]">
            "{lang === 'bn' ? note.quoteBn : note.quote}"
          </blockquote>

          {lang === 'bn' && note.quoteBn !== note.quote && (
            <p className="mt-4 font-serif italic text-xs text-[#6B5A4B] border-t border-current/10 pt-3">
              Original English Note: "{note.quote}"
            </p>
          )}
        </div>

        {/* Full Backstory Reflection */}
        {(note.fullStory || note.fullStoryBn) && (
          <div className="my-6 p-5 rounded-sm bg-current/5 border border-current/10">
            <h4 className="font-serif text-sm uppercase tracking-widest text-[#8A4537] mb-2 font-semibold flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'চিরকুটের অন্তর্নিহিত গল্প' : 'The Origin & Memory'}</span>
            </h4>
            <p className="font-serif text-sm leading-relaxed text-current/85">
              {lang === 'bn' ? note.fullStoryBn || note.fullStory : note.fullStory || note.fullStoryBn}
            </p>
          </div>
        )}

        {/* Sensory Olfactory Pyramid Notes */}
        {note.scentProfile && (
          <div className="my-6 p-5 rounded-sm bg-black/5 border border-current/10">
            <h4 className="font-serif text-xs uppercase tracking-widest text-[#78614F] mb-4 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#9E4738]" />
              <span>{lang === 'bn' ? 'স্মৃতির সুবাস নির্ঘণ্ট (Fragrance Pyramid)' : 'Sensory Fragrance Pyramid'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-serif">
              <div className="p-3 bg-white/40 rounded border border-current/5">
                <span className="block text-[10px] tracking-wider uppercase text-[#8C6D58] font-semibold mb-1">
                  {lang === 'bn' ? 'শীর্ষ সুবাস (Top)' : 'Top Notes'}
                </span>
                <span className="font-medium text-current/90">{note.scentProfile.top}</span>
              </div>

              <div className="p-3 bg-white/40 rounded border border-current/5">
                <span className="block text-[10px] tracking-wider uppercase text-[#8C6D58] font-semibold mb-1">
                  {lang === 'bn' ? 'হৃদয় সুবাস (Heart)' : 'Heart Notes'}
                </span>
                <span className="font-medium text-current/90">{note.scentProfile.heart}</span>
              </div>

              <div className="p-3 bg-white/40 rounded border border-current/5">
                <span className="block text-[10px] tracking-wider uppercase text-[#8C6D58] font-semibold mb-1">
                  {lang === 'bn' ? 'ভিত্তি সুবাস (Base)' : 'Base Notes'}
                </span>
                <span className="font-medium text-current/90">{note.scentProfile.base}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions inside modal */}
        <div className="mt-8 pt-4 border-t border-current/15 flex items-center justify-between">
          <div className="text-[11px] font-serif italic opacity-70">
            {lang === 'bn' ? 'চিরকুট সংকলন • চিরন্তনী অনুভূতি' : 'Chirkut Notes Archive'}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded border border-current/30 text-xs font-serif hover:bg-current/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-800 font-medium">
                    {lang === 'bn' ? 'কপি সম্পন্ন' : 'Copied'}
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'শেয়ার ও কপি' : 'Share Quote'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded bg-[#2B211A] text-[#FAF3EB] text-xs font-serif uppercase tracking-wider hover:bg-[#43352B] transition-colors"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
