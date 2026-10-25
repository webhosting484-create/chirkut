import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Image as ImageIcon,
  Users,
  MapPin,
  Sparkles,
  MoreHorizontal,
  ChevronDown,
  Globe,
  Tag,
  Check,
} from 'lucide-react';

interface ProfileTimelineComposerProps {
  displayName: string;
  photoURL: string;
  postQuote: string;
  setPostQuote: (val: string) => void;
  showImageInput: boolean;
  setShowImageInput: (val: boolean) => void;
  postImageUrl: string;
  setPostImageUrl: (val: string) => void;
  postScentTag: string;
  setPostScentTag: (val: string) => void;
  postLocation?: string;
  setPostLocation?: (val: string) => void;
  postPaperColor: 'parchment' | 'rose' | 'amber' | 'sage' | 'slate';
  setPostPaperColor: (val: 'parchment' | 'rose' | 'amber' | 'sage' | 'slate') => void;
  postCategory: 'scent' | 'memory' | 'rain' | 'love' | 'solitude';
  setPostCategory: (val: 'scent' | 'memory' | 'rain' | 'love' | 'solitude') => void;
  onCreateNote: () => void;
  isCreatingPost: boolean;
  lang: 'bn' | 'en';
}

const CATEGORY_NAMES: Record<string, { bn: string; en: string }> = {
  memory: { bn: 'স্মৃতি ও অতীত', en: 'Memory & Past' },
  scent: { bn: 'সুবাস ও আতর', en: 'Scent & Fragrance' },
  rain: { bn: 'বৃষ্টি ও মাটি', en: 'Rain & Earth' },
  love: { bn: 'প্রেম ও মায়া', en: 'Love & Affection' },
  solitude: { bn: 'নিঝুম একাকীত্ব', en: 'Solitude' },
};

const FB_COLOR_GRADIENTS = [
  // 5 Classic vintage / paper colors requested
  {
    id: 'parchment',
    nameBn: 'পুরোনো কাগজ (#F5EFE6)',
    nameEn: 'Parchment (#F5EFE6)',
    color: '#F5EFE6',
    textColor: '#261E18',
  },
  {
    id: 'amber',
    nameBn: 'সোনালী কার্তিক (#F6EFE0)',
    nameEn: 'Amber (#F6EFE0)',
    color: '#F6EFE0',
    textColor: '#2C2114',
  },
  {
    id: 'rose',
    nameBn: 'গোলাপি আভা (#F9ECE8)',
    nameEn: 'Rose Petal (#F9ECE8)',
    color: '#F9ECE8',
    textColor: '#2C1917',
  },
  {
    id: 'sage',
    nameBn: 'শালবন সবুজ (#EDF2EB)',
    nameEn: 'Sage (#EDF2EB)',
    color: '#EDF2EB',
    textColor: '#1D261C',
  },
  {
    id: 'slate',
    nameBn: 'পাহাড়ের কুয়াশা (#ECEEF2)',
    nameEn: 'Slate (#ECEEF2)',
    color: '#ECEEF2',
    textColor: '#191D24',
  },
  // Facebook Style Vibrant Gradients
  {
    id: 'fb-sunset',
    nameBn: 'সানসেট ফ্লেম (রঙিন)',
    nameEn: 'Sunset Flame',
    gradient: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'fb-royal',
    nameBn: 'রয়্যাল পার্পল (রঙিন)',
    nameEn: 'Royal Purple',
    gradient: 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'fb-ocean',
    nameBn: 'ওশান ব্লু (রঙিন)',
    nameEn: 'Ocean Blue',
    gradient: 'linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'fb-emerald',
    nameBn: 'এমারেল্ড গ্রিন (রঙিন)',
    nameEn: 'Emerald Green',
    gradient: 'linear-gradient(135deg, #0BA360 0%, #3CBA92 100%)',
    textColor: '#FFFFFF',
  },
  {
    id: 'fb-midnight',
    nameBn: 'মিডনাইট ড্রিম (রঙিন)',
    nameEn: 'Midnight Dream',
    gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
    textColor: '#FFFFFF',
  },
] as const;

const PAPER_SHADES = [
  { id: 'parchment', nameBn: 'পুরোনো কাগজ (Parchment)', nameEn: 'Parchment', color: '#F5EFE6', textColor: '#261E18' },
  { id: 'amber', nameBn: 'সোনালী কার্তিক (Amber)', nameEn: 'Amber', color: '#F6EFE0', textColor: '#2C2114' },
  { id: 'rose', nameBn: 'গোলাপি আভা (Rose Petal)', nameEn: 'Rose Petal', color: '#F9ECE8', textColor: '#2C1917' },
  { id: 'sage', nameBn: 'শালবন সবুজ (Sage)', nameEn: 'Sage', color: '#EDF2EB', textColor: '#1D261C' },
  { id: 'slate', nameBn: 'পাহাড়ের কুয়াশা (Slate)', nameEn: 'Slate', color: '#ECEEF2', textColor: '#191D24' },
] as const;

export const ProfileTimelineComposer: React.FC<ProfileTimelineComposerProps> = ({
  displayName,
  photoURL,
  postQuote,
  setPostQuote,
  showImageInput,
  setShowImageInput,
  postImageUrl,
  setPostImageUrl,
  postScentTag,
  setPostScentTag,
  postLocation,
  setPostLocation,
  postPaperColor,
  setPostPaperColor,
  postCategory,
  setPostCategory,
  onCreateNote,
  isCreatingPost,
  lang,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(true);
  const [showPaperColorMenu, setShowPaperColorMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [audience, setAudience] = useState<'friends' | 'public'>('friends');
  const [locationTag, setLocationTag] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract first name for personalized prompt e.g. "Anin"
  const firstName = displayName ? displayName.split(' ')[0] : 'চিরকুট';

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  const isValidPost = Boolean(postQuote.trim() && postScentTag.trim() && postCategory);

  const handleSubmit = () => {
    if (!isValidPost) return;
    onCreateNote();
    setIsModalOpen(false);
    setShowLocationInput(false);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FEED COMPOSER TRIGGER BAR (Sitting on timeline) */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[#1C1612] border border-[#2C231B] shadow-xl text-[#FAF3EB]">
        {/* Top: Avatar + Clickable Input Pill */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#C5A880]/50 overflow-hidden bg-[#241C16] shrink-0 flex items-center justify-center text-xs font-serif text-[#FAF3EB]">
            {photoURL && photoURL.trim() ? (
              <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              displayName?.[0] || 'চি'
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-[#241C16] hover:bg-[#2C231B] border border-[#3A2E24] text-xs sm:text-sm font-serif text-[#8C7A6B] hover:text-[#C8BCB0] transition-colors cursor-pointer truncate"
          >
            {lang === 'bn'
              ? `আপনার মনে কী সুবাস বা স্মৃতি জমে আছে, ${firstName}?`
              : `What's on your mind, ${firstName}?`}
          </button>
        </div>

        <div className="h-px bg-[#2C231B] my-3" />

        {/* Bottom Quick Action Buttons */}
        <div className="flex items-center justify-between gap-1 text-xs font-serif">
          {/* 1. চিরকুট পোস্ট বাটন */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-[#241C16] text-[#FAF3EB] transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span className="text-xs font-medium">{lang === 'bn' ? 'চিরকুট লিখুন' : 'Write Note'}</span>
          </button>

          {/* 2. ছবি যুক্ত বাটন */}
          <button
            type="button"
            onClick={() => {
              setShowImageInput(true);
              setIsModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-[#241C16] text-[#FAF3EB] transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium">{lang === 'bn' ? 'ছবি / মিডিয়া' : 'Photo/video'}</span>
          </button>

          {/* 3. সুবাস বাটন */}
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-[#241C16] text-[#FAF3EB] transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium">{lang === 'bn' ? 'সুবাসের চিরকুট' : 'Scent Note'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FACEBOOK STYLE "CREATE POST" MODAL (Matching Image 2 Reference) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          {/* Backdrop dismiss */}
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-lg bg-[#242526] border border-[#3A3B3C] rounded-2xl shadow-2xl overflow-hidden text-[#E4E6EB] font-sans">
            {/* Modal Header */}
            <div className="relative px-4 py-3.5 border-b border-[#393A3B] flex items-center justify-center">
              <h2 className="text-base sm:text-lg font-bold text-center text-[#E4E6EB]">
                {lang === 'bn' ? 'পোস্ট তৈরি করুন' : 'Create post'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#B0B3B8] hover:text-[#E4E6EB] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto">
              {/* User Row: Avatar + Name + Audience Pills */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[#4E4F50] overflow-hidden bg-[#3A3B3C] shrink-0 flex items-center justify-center text-xs font-bold text-[#E4E6EB]">
                  {photoURL && photoURL.trim() ? (
                    <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    displayName?.[0] || 'U'
                  )}
                </div>

                <div>
                  <div className="text-sm font-semibold text-[#E4E6EB] leading-tight">
                    {displayName || 'Anin Islam Saad'}
                  </div>

                  {/* Pills Row */}
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {/* Audience selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAudienceMenu(!showAudienceMenu);
                          setShowCategoryMenu(false);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#B0B3B8] text-xs font-medium transition-colors cursor-pointer"
                      >
                        {audience === 'friends' ? (
                          <>
                            <Users className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'Friends' : 'Friends'}</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3" />
                            <span>{lang === 'bn' ? 'Public' : 'Public'}</span>
                          </>
                        )}
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>

                      {showAudienceMenu && (
                        <div className="absolute left-0 top-full mt-1 w-36 bg-[#242526] border border-[#3A3B3C] rounded-xl shadow-xl py-1 z-30 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setAudience('friends');
                              setShowAudienceMenu(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-[#E4E6EB] hover:bg-[#3A3B3C] flex items-center gap-2"
                          >
                            <Users className="w-3.5 h-3.5 text-[#2D88FF]" />
                            <span>Friends</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAudience('public');
                              setShowAudienceMenu(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-[#E4E6EB] hover:bg-[#3A3B3C] flex items-center gap-2"
                          >
                            <Globe className="w-3.5 h-3.5 text-[#2D88FF]" />
                            <span>Public</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Category / Scent Tag Selector Pill */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryMenu(!showCategoryMenu);
                          setShowPaperColorMenu(false);
                          setShowAudienceMenu(false);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#B0B3B8] text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#C5A880]" />
                        <span>{CATEGORY_NAMES[postCategory]?.[lang] || 'স্মৃতি ও অতীত'}</span>
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>

                      {showCategoryMenu && (
                        <div className="absolute left-0 top-full mt-1 w-44 bg-[#242526] border border-[#3A3B3C] rounded-xl shadow-xl py-1 z-30 text-xs font-serif">
                          {(['memory', 'scent', 'rain', 'love', 'solitude'] as const).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setPostCategory(cat);
                                setShowCategoryMenu(false);
                              }}
                              className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#3A3B3C] ${
                                postCategory === cat ? 'text-[#C5A880] font-bold' : 'text-[#E4E6EB]'
                              }`}
                            >
                              <span>{CATEGORY_NAMES[cat]?.[lang]}</span>
                              {postCategory === cat && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* সুবাসের নাম / ট্যাগ Input Field (স্মৃতি ও অতীত এর পাশে) */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#3A3B3C] border border-[#4E4F50] focus-within:border-[#C5A880] transition-colors">
                      <Tag className="w-3 h-3 text-[#C5A880] shrink-0" />
                      <input
                        type="text"
                        value={postScentTag}
                        onChange={(e) => setPostScentTag(e.target.value)}
                        placeholder={
                          lang === 'bn'
                            ? 'সুবাসের নাম / ট্যাগ: যেমন: ভেজা কদম, হাসনাহেনা...'
                            : 'Scent note: e.g. Jasmine, Petrichor...'
                        }
                        className="bg-transparent text-xs font-serif text-[#FAF3EB] placeholder-[#8C7A6B] focus:outline-none w-48 sm:w-64"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* Main Text Area (Textured Paper Card - Enlarged) */}
              {/* ========================================================= */}
              {(() => {
                const selectedFBColor = FB_COLOR_GRADIENTS.find((c) => c.id === postPaperColor);
                const selectedPaperShade = PAPER_SHADES.find((s) => s.id === postPaperColor) || PAPER_SHADES[0];
                const isGradient = Boolean(selectedFBColor && 'gradient' in selectedFBColor);

                const activeBackground = isGradient
                  ? (selectedFBColor as any)?.gradient
                  : (selectedFBColor as any)?.color || selectedPaperShade.color;

                const activeTextColor = selectedFBColor?.textColor || selectedPaperShade.textColor;

                return (
                  <div
                    style={
                      isGradient
                        ? { background: activeBackground }
                        : { backgroundColor: activeBackground }
                    }
                    className="relative min-h-[200px] rounded-xl p-4 transition-all shadow-inner border border-[#3D3228] overflow-hidden flex flex-col justify-between"
                  >
                    {/* Subtle Dotted Texture background (Only for vintage Chirkut paper / pastel shades) */}
                    {!isGradient && (
                      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#8C7A6B_1px,transparent_1px)] [background-size:14px_14px]" />
                    )}

                    <textarea
                      ref={textareaRef}
                      rows={isGradient ? 5 : 6}
                      value={postQuote}
                      onChange={(e) => setPostQuote(e.target.value)}
                      placeholder={
                        lang === 'bn'
                          ? `What's on your mind, ${firstName}?`
                          : `What's on your mind, ${firstName}?`
                      }
                      style={{
                        color: activeTextColor,
                      }}
                      className={`relative z-10 w-full bg-transparent focus:outline-none border-0 resize-none font-serif text-base sm:text-lg leading-relaxed ${
                        isGradient
                          ? 'placeholder-white/60 font-semibold drop-shadow-sm'
                          : 'placeholder-black/40 font-medium'
                      }`}
                    />

                    {/* Bottom Toolbar inside Text Area: Separate controls for Color (Aa), Old Paper (পুরোনো কাগজ), and Photo */}
                    <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-2">
                      {/* ১. কালার অপশন (Aa বাটন ও সকল কালার ডট) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setShowColorPalette(!showColorPalette)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 cursor-pointer shadow-md ${
                            showColorPalette
                              ? 'ring-2 ring-[#C5A880] scale-105'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{
                            background:
                              'linear-gradient(135deg, #FF512F 0%, #DD2476 50%, #8A2387 100%)',
                            color: '#FFFFFF',
                          }}
                          title="কালার ব্যাকগ্রাউন্ড নির্বাচন"
                        >
                          Aa
                        </button>

                        {/* কালার ডটসমূহ (রঙিন ও পেপার কালারসহ) */}
                        {showColorPalette && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#18191A]/95 backdrop-blur-sm border border-[#3A3B3C] shadow-md animate-in fade-in zoom-in-95 duration-100 overflow-x-auto max-w-[280px] sm:max-w-none">
                            {FB_COLOR_GRADIENTS.map((fb) => {
                              const isSelected = postPaperColor === fb.id;
                              const bgStyle = 'gradient' in fb ? fb.gradient : fb.color;
                              return (
                                <button
                                  key={fb.id}
                                  type="button"
                                  onClick={() => setPostPaperColor(fb.id)}
                                  className={`w-5 h-5 rounded-full shrink-0 transition-transform cursor-pointer border ${
                                    'gradient' in fb ? 'border-white/30' : 'border-black/30'
                                  } ${
                                    isSelected
                                      ? 'ring-2 ring-[#C5A880] ring-offset-2 ring-offset-[#18191A] scale-110'
                                      : 'opacity-85 hover:opacity-100 hover:scale-105'
                                  }`}
                                  style={{ background: bgStyle }}
                                  title={lang === 'bn' ? fb.nameBn : fb.nameEn}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* ২. পুরোনো কাগজ (চিরকুট কাগজের টেক্সচার ও শেড মেনু) */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPaperColorMenu(!showPaperColorMenu)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-serif transition-colors cursor-pointer shadow-md ${
                            !isGradient
                              ? 'bg-[#18191A] border-[#C5A880] text-[#FAF3EB]'
                              : 'bg-[#18191A]/90 border-[#3A3B3C] text-[#FAF3EB] hover:bg-[#242526]'
                          }`}
                          title="পুরোনো কাগজ ও টেক্সচার"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0"
                            style={{
                              backgroundColor: !isGradient
                                ? selectedPaperShade.color
                                : '#F5EFE6',
                            }}
                          />
                          <span className="font-medium whitespace-nowrap">
                            {!isGradient
                              ? lang === 'bn'
                                ? selectedPaperShade.nameBn
                                : selectedPaperShade.nameEn
                              : lang === 'bn'
                              ? 'পুরোনো কাগজ'
                              : 'Old Paper'}
                          </span>
                          <ChevronDown className="w-3 h-3 ml-0.5 text-[#C5A880]" />
                        </button>

                        {showPaperColorMenu && (
                          <div className="absolute left-0 bottom-full mb-1 w-56 bg-[#18191A] border border-[#3A3B3C] rounded-xl shadow-2xl py-1 z-40 text-xs font-serif">
                            {PAPER_SHADES.map((shade) => {
                              const isSelected = !isGradient && postPaperColor === shade.id;
                              return (
                                <button
                                  key={shade.id}
                                  type="button"
                                  onClick={() => {
                                    setPostPaperColor(shade.id);
                                    setShowPaperColorMenu(false);
                                  }}
                                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#242526] transition-colors ${
                                    isSelected
                                      ? 'text-[#C5A880] font-bold bg-[#2A241E]'
                                      : 'text-[#FAF3EB]'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                                      style={{ backgroundColor: shade.color }}
                                    />
                                    <span>{lang === 'bn' ? shade.nameBn : shade.nameEn}</span>
                                  </div>
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                  {/* ৩. ফটো আপলোড (ছোট আইকন বাটন) */}
                  <label
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#18191A] hover:bg-[#251D17] border border-[#3A3B3C] text-emerald-400 hover:text-emerald-300 transition-transform hover:scale-105 cursor-pointer shadow-md"
                    title={lang === 'bn' ? 'ছবি আপলোড করুন' : 'Upload photo'}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setPostImageUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            );
          })()}

              {/* ========================================================= */}
              {/* স্থান / মুহূর্ত (Location / Moment) Field */}
              {/* ========================================================= */}
              <div className="space-y-1">
                <label className="text-xs font-serif text-[#C5A880] font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C5A880]" />
                  <span>{lang === 'bn' ? 'স্থান / মুহূর্ত' : 'Location / Moment'}</span>
                </label>
                <input
                  type="text"
                  value={postLocation || locationTag}
                  onChange={(e) => {
                    if (setPostLocation) setPostLocation(e.target.value);
                    setLocationTag(e.target.value);
                  }}
                  placeholder={lang === 'bn' ? 'যেমন: ধানমন্ডি লেক বা বকুলতলা' : 'e.g. Dhanmondi Lake, Cafe'}
                  className="w-full px-3 py-2 bg-[#1C1612] border border-[#3D3228] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#8C7A6B] focus:outline-none transition-colors"
                />
              </div>

              {/* Image Preview (Only appears when an image is selected) */}
              {postImageUrl && (
                <div className="relative rounded-xl overflow-hidden border border-[#3D3228] shadow-md bg-black/40">
                  <img
                    src={postImageUrl}
                    alt="Preview"
                    className="w-full max-h-48 object-cover"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                  />
                  <button
                    type="button"
                    onClick={() => setPostImageUrl('')}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-rose-900/90 text-white flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Big Full-Width "Post" Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValidPost || isCreatingPost}
                className={`w-full py-2.5 rounded-xl font-serif font-semibold text-sm transition-all shadow-md cursor-pointer ${
                  isValidPost
                    ? 'bg-[#9E4738] hover:bg-[#853B2E] text-[#FAF3EB] border border-[#C5A880]/30'
                    : 'bg-[#3A3B3C] text-[#8A8D91] cursor-not-allowed opacity-60'
                }`}
              >
                {isCreatingPost
                  ? lang === 'bn'
                    ? 'পোস্ট হচ্ছে...'
                    : 'Posting...'
                  : lang === 'bn'
                  ? 'পোস্ট করুন (Post)'
                  : 'Post Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
