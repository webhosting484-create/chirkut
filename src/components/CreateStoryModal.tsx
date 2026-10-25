import React, { useState } from 'react';
import { X, Image, Video, Sparkles, Check, Upload, Feather } from 'lucide-react';
import { StoryItem, UserProfile } from '../types';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onStoryCreated: (story: StoryItem) => void;
  lang: 'bn' | 'en';
}

const PRESET_BACKGROUNDS = [
  {
    nameBn: 'গোধূলির আকাশ',
    nameEn: 'Sunset Sky',
    url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'বৃষ্টিভেজা পাতা',
    nameEn: 'Rain Drops',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'শুকনো গোলাপ',
    nameEn: 'Dried Rose',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'উষ্ণ ক্যাম্পফায়ার',
    nameEn: 'Campfire Glow',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
  },
  {
    nameBn: 'পুরোনো বইয়ের গন্ধ',
    nameEn: 'Vintage Books',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  },
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  user,
  onStoryCreated,
  lang,
}) => {
  const [text, setText] = useState('');
  const [bgImage, setBgImage] = useState(PRESET_BACKGROUNDS[0].url);
  const [videoUrl, setVideoUrl] = useState('');
  const [customImage, setCustomImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
        setBgImage(reader.result as string);
        setVideoUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !bgImage && !videoUrl) return;

    const newStory: StoryItem = {
      id: `story-${Date.now()}`,
      authorId: user?.uid || 'guest',
      authorName: user?.displayName || (lang === 'bn' ? 'অজ্ঞাত পরিব্রাজক' : 'Anonymous Traveler'),
      authorAvatar: user?.photoURL || undefined,
      text: text.trim(),
      bgImage: videoUrl ? undefined : customImage || bgImage,
      videoUrl: videoUrl || undefined,
      createdAt: Date.now(),
      hasViewed: false,
    };

    onStoryCreated(newStory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-[#181310] border border-[#3D3228] rounded-2xl p-6 shadow-2xl text-[#E8DFD8]">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#2C231B] mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <h3 className="font-serif text-xl text-[#FAF3EB]">
              {lang === 'bn' ? '২৪ ঘণ্টার স্টোরি দিন' : 'Share 24h Story'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#8C7A6B] hover:text-[#FAF3EB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Story Text */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-serif text-[#A39282] mb-1.5">
              {lang === 'bn' ? 'স্টোরির অনুভূতি বা উদ্ধৃতি' : 'Story Text / Thought'}
            </label>
            <input
              type="text"
              maxLength={120}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={lang === 'bn' ? 'যেমন: কার্তিক মাসের কুয়াশার ঘ্রাণ...' : 'A fleeting thought...'}
              className="w-full px-3.5 py-2.5 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
            />
          </div>

          {/* Background Preset Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-serif text-[#A39282] mb-2">
              {lang === 'bn' ? 'ব্যাকগ্রাউন্ড আবহাওয়া নির্বাচন' : 'Atmospheric Background'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_BACKGROUNDS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setBgImage(p.url);
                    setVideoUrl('');
                  }}
                  className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                    bgImage === p.url && !videoUrl
                      ? 'border-[#C5A880] ring-2 ring-[#C5A880]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.nameEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Video or Custom Image Upload */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-serif text-[#A39282] mb-1.5">
              {lang === 'bn' ? 'ভিডিও বা নিজস্ব ছবি আপলোড' : 'Upload Video or Custom Photo'}
            </label>
            <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#3D3228] hover:border-[#C5A880] bg-[#120E0C] text-xs font-serif text-[#A39282] hover:text-[#FAF3EB] cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>
                {videoUrl
                  ? lang === 'bn' ? 'ভিডিও যুক্ত হয়েছে ✓' : 'Video Attached ✓'
                  : customImage
                  ? lang === 'bn' ? 'ছবি যুক্ত হয়েছে ✓' : 'Photo Attached ✓'
                  : lang === 'bn' ? 'ফাইল নির্বাচন করুন (MP4 / JPG / PNG)' : 'Select file (MP4 / JPG / PNG)'}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview */}
          <div className="relative aspect-[9/12] max-h-48 w-full rounded-xl overflow-hidden border border-[#3D3228] bg-black flex items-center justify-center p-4">
            {videoUrl ? (
              <video src={videoUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-75" />
            ) : (
              <img src={customImage || bgImage} alt="Preview" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-75" />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <p className="relative z-10 font-handwriting text-2xl text-center text-[#FAF3EB] px-2 drop-shadow">
              "{text || (lang === 'bn' ? 'আপনার ভাবনা...' : 'Your thought...')}"
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#382E25] text-xs font-serif text-[#8C7A6B] hover:text-[#FAF3EB]"
            >
              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#C5A880] text-[#14100E] font-serif font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'পোস্ট করুন' : 'Share Story'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
