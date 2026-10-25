import React from 'react';
import { Feather, Trash2, Sparkles, Heart, MessageSquare, Eye, Tag } from 'lucide-react';
import { ChirkutNote, ReactionType } from '../../types';

interface ProfileTimelineFeedProps {
  authorNotes: ChirkutNote[];
  isViewingSelf: boolean;
  displayName: string;
  photoURL: string;
  onSelectNote: (note: ChirkutNote) => void;
  onDeleteNote?: (noteId: string) => void;
  onOpenComments?: (note: ChirkutNote) => void;
  onReact?: (noteId: string, reaction: ReactionType) => void;
  lang: 'bn' | 'en';
}

const CATEGORY_NAMES: Record<string, { bn: string; en: string }> = {
  memory: { bn: 'স্মৃতি ও অতীত', en: 'Memory & Past' },
  scent: { bn: 'সুবাস ও আতর', en: 'Scent & Fragrance' },
  rain: { bn: 'বৃষ্টি ও মাটি', en: 'Rain & Earth' },
  love: { bn: 'প্রেম ও মায়া', en: 'Love & Affection' },
  solitude: { bn: 'নিঝুম একাকীত্ব', en: 'Solitude' },
};

export const ProfileTimelineFeed: React.FC<ProfileTimelineFeedProps> = ({
  authorNotes,
  isViewingSelf,
  displayName,
  photoURL,
  onSelectNote,
  onDeleteNote,
  onOpenComments,
  onReact,
  lang,
}) => {
  const getPaperBg = (color?: string, hasImage?: boolean) => {
    if (hasImage) return 'bg-[#181310] text-white border-[#3D3228]';
    switch (color) {
      case 'fb-sunset':
        return 'bg-gradient-to-tr from-[#FF512F] to-[#DD2476] text-white border-transparent shadow-lg';
      case 'fb-royal':
        return 'bg-gradient-to-tr from-[#8A2387] via-[#E94057] to-[#F27121] text-white border-transparent shadow-lg';
      case 'fb-ocean':
        return 'bg-gradient-to-tr from-[#0052D4] via-[#4364F7] to-[#6FB1FC] text-white border-transparent shadow-lg';
      case 'fb-emerald':
        return 'bg-gradient-to-tr from-[#0BA360] to-[#3CBA92] text-white border-transparent shadow-lg';
      case 'fb-midnight':
        return 'bg-gradient-to-tr from-[#232526] to-[#414345] text-white border-[#4A4D50] shadow-lg';
      case 'rose':
        return 'bg-[#F9ECE8] text-[#2C1917] border-[#E8C5BE]';
      case 'amber':
        return 'bg-[#F6EFE0] text-[#2C2114] border-[#E2D2B5]';
      case 'sage':
        return 'bg-[#EDF2EB] text-[#1D261C] border-[#CCD9CA]';
      case 'slate':
        return 'bg-[#ECEEF2] text-[#191D24] border-[#CBD2DC]';
      case 'parchment':
      default:
        return 'bg-[#F5EFE6] text-[#261E18] border-[#DECDB8]';
    }
  };

  return (
    <div className="space-y-5">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-serif text-[#8C7A6B] uppercase tracking-wider">
          {lang === 'bn' ? 'প্রকাশিত সকল চিরকুট' : 'Published Timeline Notes'} ({authorNotes.length})
        </span>
      </div>

      {/* Notes Feed List */}
      {authorNotes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1A1411] border border-[#2D231B] text-xs font-serif text-[#8C7A6B]">
          <Feather className="w-8 h-8 text-[#C5A880]/30 mx-auto mb-3" />
          <p>
            {isViewingSelf
              ? lang === 'bn'
                ? 'আপনি এখনও কোনো চিরকুট প্রকাশ করেননি। উপরের বক্সে লিখে এখনই প্রথম চিরকুটটি প্রকাশ করুন!'
                : 'You have not published any notes yet. Write in the box above to publish!'
              : lang === 'bn'
              ? 'এই লেখকের কোনো চিরকুট পোস্ট পাওয়া যায়নি।'
              : 'No notes posted by this author yet.'}
          </p>
        </div>
      ) : (
        authorNotes.map((note) => {
          const paperStyle = getPaperBg(note.paperColor, Boolean(note.bgImageUrl || note.videoUrl));
          return (
            <div
              key={note.id}
              className={`p-6 sm:p-7 rounded-2xl border transition-all shadow-xl relative overflow-hidden group ${paperStyle}`}
            >
              {/* Background Media if any, otherwise vintage dotted paper texture */}
              {note.bgImageUrl && note.bgImageUrl.trim() ? (
                <div className="absolute inset-0 z-0">
                  <img
                    src={note.bgImageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover filter brightness-[0.40] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/50 pointer-events-none" />
                </div>
              ) : !note.paperColor?.startsWith('fb-') ? (
                <div className="absolute inset-0 opacity-35 pointer-events-none bg-[radial-gradient(#968270_1px,transparent_1px)] [background-size:14px_14px]" />
              ) : null}

              <div className="relative z-10">
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-black/20 overflow-hidden flex items-center justify-center text-[10px] font-serif border border-current/20">
                      {photoURL && photoURL.trim() ? (
                        <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        displayName?.[0] || 'চি'
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold tracking-wide">
                        {displayName}
                      </h4>
                      <span className="text-[10px] opacity-70">
                        {note.date || 'তারিখহীন'} • {note.location || 'চিরকুট আর্কাইভ'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Category Pill (স্মৃতি ও অতীত / সুবাস ও আতর ইত্যাদি) */}
                    {note.category && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/15 border border-current/15 text-[11px] font-serif font-semibold text-current shadow-xs">
                        <Sparkles className="w-3 h-3 text-[#C5A880]" />
                        <span>{CATEGORY_NAMES[note.category]?.[lang] || note.category}</span>
                      </span>
                    )}

                    {/* Owner Delete Button */}
                    {isViewingSelf && onDeleteNote && (
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quote Content */}
                <blockquote
                  onClick={() => onSelectNote(note)}
                  className="cursor-pointer my-3 font-handwriting text-2xl sm:text-[26px] leading-snug tracking-wide drop-shadow-sm hover:opacity-90"
                >
                  "{lang === 'bn' ? note.quoteBn || note.quote : note.quote}"
                </blockquote>

                {/* Scent & Note Tags */}
                {note.scentProfile && (
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-current/10 text-[11px] font-serif opacity-90">
                    <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>
                      <strong className="font-bold">{lang === 'bn' ? 'সুবাস নির্ঘণ্ট:' : 'Scent:'}</strong>{' '}
                      {note.scentProfile.top || note.scentProfile.heart || note.scentProfile.base}
                    </span>
                  </div>
                )}

                {/* Card Footer Actions (Like, Comment, Share) */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-current/15 text-xs font-serif">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onReact && onReact(note.id, 'love')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
                        note.userReaction
                          ? 'bg-rose-900/40 border-rose-600 text-rose-300'
                          : 'border-current/20 hover:bg-black/10'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>
                        {(note.likesCount || 0) + (note.userReaction ? 1 : 0)}
                      </span>
                    </button>

                    {onOpenComments && (
                      <button
                        onClick={() => onOpenComments(note)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-current/20 hover:bg-black/10 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'মন্তব্য' : 'Comments'}</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectNote(note)}
                    className="flex items-center gap-1 text-[11px] hover:underline"
                  >
                    <span>{lang === 'bn' ? 'সম্পূর্ণ পড়ুন' : 'Read full'}</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
