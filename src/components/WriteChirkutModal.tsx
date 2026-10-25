import React, { useState } from 'react';
import { X, Feather, Sparkles, MapPin, Check, Image, Video, Upload, Trash2 } from 'lucide-react';
import { ChirkutNote, NewNoteSubmission, UserProfile } from '../types';

interface WriteChirkutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNote: (note: ChirkutNote) => void;
  user: UserProfile | null;
  lang: 'bn' | 'en';
}

const AI_BG_PRESETS = [
  {
    nameBn: 'কোনো ছবি নয় (কাগজ)',
    nameEn: 'Pure Paper',
    url: '',
  },
  {
    nameBn: 'গোধূলির উদ্যান',
    nameEn: 'Golden Garden',
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'বৃষ্টিভেজা পাতা',
    nameEn: 'Rain Drops',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'রোদমাখা পাপড়ি',
    nameEn: 'Rose Petals',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'ক্যাম্পফায়ার ওম',
    nameEn: 'Campfire',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'পুরোনো বইয়ের গন্ধ',
    nameEn: 'Vintage Books',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'পাহাড়ের কুয়াশা',
    nameEn: 'Misty Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
];

export const WriteChirkutModal: React.FC<WriteChirkutModalProps> = ({
  isOpen,
  onClose,
  onSubmitNote,
  user,
  lang,
}) => {
  const [form, setForm] = useState<NewNoteSubmission>({
    quote: '',
    author: user?.displayName || '',
    location: '',
    category: 'memory',
    paperColor: 'parchment',
    scentTag: 'বৃষ্টির মাটি ও হাসনাহেনা',
    bgImageUrl: '',
    videoUrl: '',
    mediaType: 'text',
  });

  const [activeMediaTab, setActiveMediaTab] = useState<'paper' | 'image' | 'video'>('paper');
  const [customFilePreview, setCustomFilePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setCustomFilePreview(url);
      setForm((prev) => ({
        ...prev,
        videoUrl: url,
        bgImageUrl: '',
        mediaType: 'video',
      }));
      setActiveMediaTab('video');
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        setCustomFilePreview(res);
        setForm((prev) => ({
          ...prev,
          bgImageUrl: res,
          videoUrl: '',
          mediaType: 'image',
        }));
        setActiveMediaTab('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetBg = (url: string) => {
    setCustomFilePreview(null);
    if (!url) {
      setForm((prev) => ({ ...prev, bgImageUrl: '', mediaType: 'text' }));
      setActiveMediaTab('paper');
    } else {
      setForm((prev) => ({ ...prev, bgImageUrl: url, videoUrl: '', mediaType: 'image' }));
      setActiveMediaTab('image');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quote.trim()) {
      setError(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার চিরকুটের কথামালা লিখুন।'
          : 'Please write your message in the note.'
      );
      return;
    }

    const newNote: ChirkutNote = {
      id: `chirkut-${Date.now()}`,
      quote: form.quote.trim(),
      quoteBn: form.quote.trim(),
      author: form.author.trim() || (lang === 'bn' ? 'অজ্ঞাত চিরকুট সন্ধানী' : 'Anonymous Seeker'),
      authorId: user?.uid,
      authorAvatar: user?.photoURL || undefined,
      location: form.location.trim() || (lang === 'bn' ? 'স্মৃতির নির্জন কোণ' : 'A Quiet Corner'),
      date: lang === 'bn' ? 'এইমাত্র পিন করা' : 'Just now',
      category: form.category,
      paperColor: form.paperColor,
      bgImageUrl: form.bgImageUrl || undefined,
      videoUrl: form.videoUrl || undefined,
      mediaType: form.videoUrl ? 'video' : form.bgImageUrl ? 'image' : 'text',
      scentProfile: {
        top: form.scentTag || 'শুকনো বেলি',
        heart: 'হৃদয়ের না-বলা কথা',
        base: 'স্মৃতির নিবিড় মায়া',
      },
      fullStory: form.quote.trim(),
      fullStoryBn: form.quote.trim(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      reactions: { love: 0, tear: 0, sparkle: 0, fire: 0, calm: 0 },
      createdAt: Date.now(),
    };

    onSubmitNote(newNote);
    onClose();
  };

  const getPaperClasses = (color: string) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#1A1512] border border-[#3D322B] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#E8DFD8] max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C241E] mb-5">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-2xl text-[#FAF3EB] font-light">
              {lang === 'bn' ? 'একটি নতুন চিরকুট লিখুন' : 'Leave a Handwritten Note'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 text-xs bg-rose-950/50 border border-rose-800/50 text-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Media Format Selector: Paper vs AI Background Photo vs Video */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-2">
              {lang === 'bn' ? 'চিরকুটের ব্যাকগ্রাউন্ড বা মাধ্যম নির্বাচন করুন' : 'Post Format & Background Style'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveMediaTab('paper');
                  setForm((prev) => ({ ...prev, bgImageUrl: '', videoUrl: '', mediaType: 'text' }));
                }}
                className={`p-2.5 rounded-xl border text-xs font-serif transition-all flex items-center justify-center gap-2 ${
                  activeMediaTab === 'paper'
                    ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB] font-medium'
                    : 'border-[#382E25] bg-[#120E0C] text-[#8C7A6B]'
                }`}
              >
                <Feather className="w-4 h-4 text-[#C5A880]" />
                <span>{lang === 'bn' ? 'ভিন্টেজ কাগজ' : 'Vintage Paper'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMediaTab('image');
                  if (!form.bgImageUrl) {
                    setForm((prev) => ({ ...prev, bgImageUrl: AI_BG_PRESETS[1].url, videoUrl: '', mediaType: 'image' }));
                  }
                }}
                className={`p-2.5 rounded-xl border text-xs font-serif transition-all flex items-center justify-center gap-2 ${
                  activeMediaTab === 'image'
                    ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB] font-medium'
                    : 'border-[#382E25] bg-[#120E0C] text-[#8C7A6B]'
                }`}
              >
                <Image className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'ব্যাকগ্রাউন্ড ছবি (AI)' : 'AI Image Card'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMediaTab('video');
                  setForm((prev) => ({ ...prev, mediaType: 'video' }));
                }}
                className={`p-2.5 rounded-xl border text-xs font-serif transition-all flex items-center justify-center gap-2 ${
                  activeMediaTab === 'video'
                    ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB] font-medium'
                    : 'border-[#382E25] bg-[#120E0C] text-[#8C7A6B]'
                }`}
              >
                <Video className="w-4 h-4 text-amber-400" />
                <span>{lang === 'bn' ? 'ভিডিও চিরকুট' : 'Video Note'}</span>
              </button>
            </div>
          </div>

          {/* Conditional Sub-settings: Paper styles or Image presets or Video upload */}
          {activeMediaTab === 'paper' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#A39282] font-serif mb-1.5">
                {lang === 'bn' ? 'কাগজের শেড:' : 'Paper Shade:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'parchment', label: 'পুরোনো কাগজ (Parchment)', color: '#FAF5ED' },
                  { id: 'amber', label: 'সোনালী কার্তিক (Amber)', color: '#FBF6EC' },
                  { id: 'rose', label: 'গোলাপি আভা (Rose Petal)', color: '#FDF6F4' },
                  { id: 'sage', label: 'শালবন সবুজ (Sage)', color: '#F4F7F2' },
                  { id: 'slate', label: 'পাহাড়ের কুয়াশা (Slate)', color: '#F3F4F7' },
                ].map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setForm({ ...form, paperColor: p.id as any })}
                    className={`px-3 py-1 rounded-full border text-[11px] font-serif flex items-center gap-1.5 transition-all ${
                      form.paperColor === p.id
                        ? 'border-[#C5A880] ring-1 ring-[#C5A880] text-[#FAF3EB]'
                        : 'border-[#382E27] text-[#8C7A6B]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMediaTab === 'image' && (
            <div className="space-y-3">
              <label className="block text-[11px] uppercase tracking-wider text-[#A39282] font-serif">
                {lang === 'bn' ? 'AI আবহাওয়া ব্যাকগ্রাউন্ড থিম নির্বাচন করুন:' : 'Choose Atmospheric AI Preset:'}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {AI_BG_PRESETS.filter((p) => p.url).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetBg(p.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                      form.bgImageUrl === p.url
                        ? 'border-[#C5A880] ring-2 ring-[#C5A880]'
                        : 'border-[#3D3228] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.nameEn} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Or Custom Upload */}
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-[#3D3228] hover:border-[#C5A880] bg-[#120E0C] text-xs font-serif text-[#A39282] hover:text-[#FAF3EB] cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>
                  {customFilePreview
                    ? lang === 'bn' ? 'নিজস্ব ছবি যুক্ত হয়েছে ✓' : 'Custom Image Uploaded ✓'
                    : lang === 'bn' ? 'নিজের কোনো ছবি আপলোড করুন' : 'Upload your own background photo'}
                </span>
                <input type="file" accept="image/*" onChange={handleMediaUpload} className="hidden" />
              </label>
            </div>
          )}

          {activeMediaTab === 'video' && (
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#A39282] font-serif">
                {lang === 'bn' ? 'ভিডিও আপলোড অথবা ভিডিও লিংক:' : 'Upload Video or Enter URL:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => {
                    setForm({ ...form, videoUrl: e.target.value, bgImageUrl: '', mediaType: 'video' });
                    setCustomFilePreview(null);
                  }}
                  placeholder="https://example.com/ambient-rain.mp4"
                  className="flex-1 px-3 py-2 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
                />
                <label className="px-3 py-2 bg-[#201915] border border-[#382E25] hover:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] cursor-pointer flex items-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{lang === 'bn' ? 'ফাইল' : 'File'}</span>
                  <input type="file" accept="video/*" onChange={handleMediaUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Quote Textarea */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1.5">
              {lang === 'bn' ? 'চিরকুটের কথা (Message or Poetry) *' : 'Your Note Text *'}
            </label>
            <textarea
              required
              rows={3}
              value={form.quote}
              onChange={(e) => {
                setForm({ ...form, quote: e.target.value });
                if (error) setError(null);
              }}
              placeholder={
                lang === 'bn'
                  ? 'যেমন: কিছু স্মৃতি কখনো পুরানো হয় না, যেমন প্রথম বৃষ্টির গন্ধ...'
                  : 'Write a fleeting thought, memory, or sensory note...'
              }
              className="w-full px-4 py-3 bg-[#130F0D] border border-[#3D322B] focus:border-[#C5A880] rounded-xl text-sm font-serif text-[#FAF3EB] placeholder-[#69584B] focus:outline-none"
            />
          </div>

          {/* Live Preview Box */}
          {form.quote.trim() && (
            <div className="p-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C7A6B] font-serif block mb-1">
                {lang === 'bn' ? 'লাইভ চিরকুট প্রাকদর্শন:' : 'Live Note Preview:'}
              </span>
              <div
                className={`relative overflow-hidden p-6 rounded-sm border shadow-lg transition-all min-h-[140px] flex flex-col justify-between ${
                  form.bgImageUrl || form.videoUrl
                    ? 'text-white border-[#4A3B31]'
                    : getPaperClasses(form.paperColor)
                }`}
              >
                {form.videoUrl ? (
                  <video src={form.videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-50" />
                ) : form.bgImageUrl ? (
                  <img src={form.bgImageUrl} alt="Background" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover brightness-[0.45]" />
                ) : null}

                <div className="relative z-10">
                  <p className="font-handwriting text-2xl sm:text-3xl leading-snug drop-shadow-md">
                    "{form.quote}"
                  </p>
                </div>

                <div className="relative z-10 mt-4 pt-2 border-t border-current/20 text-[11px] font-serif italic flex justify-between opacity-85">
                  <span>— {form.author || (lang === 'bn' ? 'অজ্ঞাত' : 'Anonymous')}</span>
                  <span>{form.location || 'স্মৃতির প্রান্তর'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Author & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder={lang === 'bn' ? 'যেমন: কোনো এক পথিক' : 'e.g., A quiet soul'}
                className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#3D322B] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#69584B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                {lang === 'bn' ? 'স্থান / মুহূর্ত' : 'Place or Moment'}
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder={lang === 'bn' ? 'যেমন: ধানমন্ডি লেক' : 'e.g., Mountain cabin'}
                className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#3D322B] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#69584B] focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Scent Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                {lang === 'bn' ? 'বিভাগ (Mood)' : 'Mood Category'}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#3D322B] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] focus:outline-none"
              >
                <option value="scent">{lang === 'bn' ? 'সুবাস ও সুগন্ধি' : 'Scent & Fragrance'}</option>
                <option value="memory">{lang === 'bn' ? 'স্মৃতি ও অতীত' : 'Memories'}</option>
                <option value="rain">{lang === 'bn' ? 'বৃষ্টি ও পেটরিকর' : 'Rain & Earth'}</option>
                <option value="love">{lang === 'bn' ? 'প্রেম ও মায়া' : 'Love & Affection'}</option>
                <option value="solitude">{lang === 'bn' ? 'নিঝুম একাকীত্ব' : 'Solitude'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[#A39282] font-serif mb-1">
                {lang === 'bn' ? 'স্মৃতির সুবাস ট্যাগ' : 'Scent Association'}
              </label>
              <input
                type="text"
                value={form.scentTag}
                onChange={(e) => setForm({ ...form, scentTag: e.target.value })}
                placeholder={lang === 'bn' ? 'যেমন: ভেজা মাটি, চন্দন, বেলি' : 'e.g., Cedar, Rain, Jasmine'}
                className="w-full px-3.5 py-2 bg-[#130F0D] border border-[#3D322B] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#69584B] focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-[#2C241E] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#382E27] text-xs font-serif text-[#A39282] hover:text-[#FAF3EB]"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C5A880] text-[#14110F] font-serif font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] transition-all shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>{lang === 'bn' ? 'চিরকুট পিন করুন' : 'Pin Note'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
