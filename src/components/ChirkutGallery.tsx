import React, { useState } from 'react';
import { ChirkutNote, ReactionType } from '../types';
import { CATEGORY_LABELS } from '../data/chirkutData';
import {
  Sparkles,
  Heart,
  Share2,
  Eye,
  MapPin,
  Feather,
  Check,
  MessageCircle,
  Play,
  Pause,
  Search,
  Flame,
  Volume2
} from 'lucide-react';

interface ChirkutGalleryProps {
  notes: ChirkutNote[];
  onSelectNote: (note: ChirkutNote) => void;
  onOpenWriteModal: () => void;
  onOpenComments: (note: ChirkutNote) => void;
  onReact: (noteId: string, reaction: ReactionType) => void;
  onOpenAuthorProfile?: (author: { name: string; id?: string; avatar?: string }) => void;
  commentsCountMap: Record<string, number>;
  lang: 'bn' | 'en';
}

const REACTION_EMOJIS: Record<ReactionType, { emoji: string; labelBn: string; labelEn: string }> = {
  love: { emoji: '❤️', labelBn: 'প্রেম', labelEn: 'Love' },
  tear: { emoji: '😢', labelBn: 'বিরহ', labelEn: 'Tears' },
  sparkle: { emoji: '✨', labelBn: 'মুগ্ধতা', labelEn: 'Awe' },
  fire: { emoji: '🔥', labelBn: 'ওম', labelEn: 'Fire' },
  calm: { emoji: '🕊️', labelBn: 'প্রশান্তি', labelEn: 'Calm' },
};

export const ChirkutGallery: React.FC<ChirkutGalleryProps> = ({
  notes,
  onSelectNote,
  onOpenWriteModal,
  onOpenComments,
  onReact,
  onOpenAuthorProfile,
  commentsCountMap,
  lang,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [hoveredReactionId, setHoveredReactionId] = useState<string | null>(null);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('chirkut_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((item) => item !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('chirkut_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const copyQuote = (note: ChirkutNote, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `"${lang === 'bn' ? note.quoteBn || note.quote : note.quote}" — ${note.author} (চিরকুট)`;
    if (navigator.share) {
      navigator.share({
        title: 'চিরকুট (Chirkut)',
        text: textToCopy,
        url: window.location.href,
      }).catch(() => {
        navigator.clipboard.writeText(textToCopy);
      });
    } else {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter((n, idx, arr) => {
    if (arr.findIndex((item) => item.id === n.id) !== idx) return false;
    const matchesCategory = activeCategory === 'all' || n.category === activeCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      n.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.quoteBn && n.quoteBn.includes(searchQuery)) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.location && n.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const getPaperBg = (color?: string, hasImage?: boolean, hasVideo?: boolean) => {
    if (hasVideo || hasImage) {
      return 'bg-[#181310] text-white border-[#3D3228]';
    }
    switch (color) {
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
    <section id="gallery" className="py-16 bg-[#161210] relative border-t border-[#261E18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#C5A880] text-xs uppercase tracking-[0.25em] font-serif mb-2">
              <Feather className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'চিরকুট সংকলন ও ফিড' : 'Chirkut Feed & Wall'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF3EB] font-light">
              {lang === 'bn'
                ? 'কাগজ, কালির সুবাস ও স্মৃতির পোস্ট'
                : 'Scents, Stories & Real-time Notes'}
            </h2>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8C7A6B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'bn' ? 'চিরকুট খুঁজুন...' : 'Search notes...'}
                className="w-full pl-9 pr-4 py-2 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-full text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
              />
            </div>

            <button
              onClick={onOpenWriteModal}
              className="shrink-0 flex items-center gap-2 px-5 py-2 rounded-full border border-[#C5A880] bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#FAF3EB] text-xs font-serif tracking-wider uppercase transition-all shadow-md"
            >
              <Feather className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{lang === 'bn' ? 'লিখুন' : 'Post'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {Object.entries(CATEGORY_LABELS).map(([key, labelObj]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-serif tracking-wide whitespace-nowrap transition-all duration-200 border ${
                activeCategory === key
                  ? 'border-[#C5A880] bg-[#C5A880] text-[#161210] font-medium shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                  : 'border-[#2F2620] bg-[#1C1613] text-[#A39282] hover:border-[#4A3B31] hover:text-[#FAF3EB]'
              }`}
            >
              {lang === 'bn' ? labelObj.bn : labelObj.en}
            </button>
          ))}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredNotes.map((note, index) => {
            const isBookmarked = bookmarkedIds.includes(note.id);
            const isCopied = copiedId === note.id;
            const commentsCount = commentsCountMap[note.id] || note.commentsCount || 0;
            const hasMedia = Boolean(note.bgImageUrl || note.videoUrl);

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`group cursor-pointer rounded-xl border p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between min-h-[320px] overflow-hidden ${getPaperBg(
                  note.paperColor,
                  Boolean(note.bgImageUrl),
                  Boolean(note.videoUrl)
                )}`}
              >
                {/* Background Image / Video if present */}
                {note.videoUrl ? (
                  <div className="absolute inset-0 z-0">
                    <video
                      src={note.videoUrl}
                      loop
                      muted
                      playsInline
                      autoPlay
                      className="w-full h-full object-cover filter brightness-[0.38]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />
                  </div>
                ) : note.bgImageUrl ? (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={note.bgImageUrl}
                      alt={note.author}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.42] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />
                  </div>
                ) : (
                  <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#968270_0.75px,transparent_0.75px)] [background-size:12px_12px]" />
                )}

                {/* Top Note Metadata */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between pb-3 border-b border-current/15 mb-4">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenAuthorProfile) {
                          onOpenAuthorProfile({
                            name: note.author,
                            id: note.authorId,
                            avatar: note.authorAvatar,
                          });
                        }
                      }}
                      className="flex items-center gap-2 cursor-pointer group/author hover:opacity-100"
                      title={lang === 'bn' ? `${note.author}-এর প্রোফাইল দেখুন` : `View ${note.author}'s profile`}
                    >
                      <div className="w-6 h-6 rounded-full bg-black/20 overflow-hidden flex items-center justify-center text-[10px] font-serif border border-current/20 group-hover/author:border-[#C5A880] transition-colors">
                        {note.authorAvatar && note.authorAvatar.trim() ? (
                          <img src={note.authorAvatar} alt={note.author || 'Author'} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          (note.author && typeof note.author === 'string' && note.author.length > 0 ? note.author[0] : 'চি')
                        )}
                      </div>
                      <span className="text-[11px] tracking-[0.15em] uppercase font-serif font-bold opacity-85 group-hover/author:text-[#C5A880] transition-colors">
                        {note.author || (lang === 'bn' ? 'অজ্ঞাত লেখক' : 'Anonymous')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {note.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/10 border border-current/10 text-[10px] font-serif font-medium opacity-85">
                          <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
                          <span>{CATEGORY_LABELS[note.category]?.[lang] || note.category}</span>
                        </span>
                      )}
                      {note.location && (
                        <span className="flex items-center gap-1 text-[11px] font-serif italic opacity-75">
                          <MapPin className="w-3 h-3 text-[#A05D46]" />
                          {note.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Quote */}
                  <blockquote className="my-2 font-handwriting text-2xl sm:text-[26px] leading-snug tracking-wide drop-shadow-sm">
                    "{lang === 'bn' ? note.quoteBn || note.quote : note.quote}"
                  </blockquote>

                  {lang === 'bn' && note.quoteBn && note.quoteBn !== note.quote && (
                    <p className="text-[11px] font-serif italic opacity-70 mt-3 pt-2 border-t border-current/10 line-clamp-2">
                      {note.quote}
                    </p>
                  )}
                </div>

                {/* Bottom Interactive Bar (Reactions, Comments, Share) */}
                <div className="relative z-10 mt-6 pt-4 border-t border-current/15">
                  
                  {/* Scent Tag */}
                  {note.scentProfile && (
                    <div className="mb-3 text-[11px] font-serif flex items-center gap-1.5 opacity-85">
                      <Sparkles className="w-3 h-3 text-[#C5A880]" />
                      <span className="truncate">
                        <strong>{lang === 'bn' ? 'সুবাস নির্ঘণ্ট: ' : 'Scent: '}</strong>
                        {note.scentProfile.top || note.scentProfile.heart || note.scentProfile.base}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-1 pt-1">
                    
                    {/* Reactions Button with hover picker */}
                    <div
                      className="relative"
                      onMouseEnter={() => setHoveredReactionId(note.id)}
                      onMouseLeave={() => setHoveredReactionId(null)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReact(note.id, note.userReaction || 'love');
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-serif transition-colors ${
                          note.userReaction
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'hover:bg-current/10 opacity-75'
                        }`}
                      >
                        <span>{note.userReaction ? REACTION_EMOJIS[note.userReaction].emoji : '❤️'}</span>
                        <span>{note.likesCount || 0}</span>
                      </button>

                      {/* Multi-reaction floating picker */}
                      {hoveredReactionId === note.id && (
                        <div
                          className="absolute bottom-full left-0 mb-2 p-1.5 rounded-full bg-[#1C1512] border border-[#3D3228] shadow-2xl flex items-center gap-1 z-30 animate-in zoom-in-90 duration-150"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((rKey) => (
                            <button
                              key={rKey}
                              onClick={(e) => {
                                e.stopPropagation();
                                onReact(note.id, rKey);
                                setHoveredReactionId(null);
                              }}
                              className="hover:scale-130 active:scale-150 transition-transform p-1.5 text-base"
                              title={lang === 'bn' ? REACTION_EMOJIS[rKey].labelBn : REACTION_EMOJIS[rKey].labelEn}
                            >
                              {REACTION_EMOJIS[rKey].emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Comments Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenComments(note);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-serif hover:bg-current/10 opacity-75 transition-colors"
                      title={lang === 'bn' ? 'মন্তব্য দেখুন বা লিখুন' : 'Comments'}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{commentsCount}</span>
                    </button>

                    {/* Share / Copy */}
                    <button
                      onClick={(e) => copyQuote(note, e)}
                      className="p-1.5 rounded-full hover:bg-current/10 opacity-75 transition-colors"
                      title={lang === 'bn' ? 'শেয়ার বা কপি করুন' : 'Share'}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => toggleBookmark(note.id, e)}
                      className="p-1.5 rounded-full hover:bg-current/10 transition-colors"
                      title={lang === 'bn' ? 'সংরক্ষণ' : 'Bookmark'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isBookmarked ? 'fill-rose-500 text-rose-500' : 'opacity-75'
                        }`}
                      />
                    </button>

                    {/* Open full reader */}
                    <button
                      onClick={() => onSelectNote(note)}
                      className="text-[11px] font-serif italic flex items-center gap-0.5 opacity-80 hover:opacity-100 text-[#C5A880]"
                    >
                      <span>{lang === 'bn' ? 'বিস্তারিত' : 'Open'}</span>
                      <Eye className="w-3 h-3" />
                    </button>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
