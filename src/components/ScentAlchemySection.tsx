import React, { useState } from 'react';
import { Sparkles, Wind, Droplets, Sun, Flame, Feather, ChevronRight } from 'lucide-react';

interface ScentAlchemySectionProps {
  lang: 'bn' | 'en';
  onFilterCategory?: (cat: string) => void;
}

interface ScentStory {
  id: string;
  nameBn: string;
  nameEn: string;
  familyBn: string;
  familyEn: string;
  notesBn: string[];
  notesEn: string[];
  descriptionBn: string;
  descriptionEn: string;
  image: string;
}

export const ScentAlchemySection: React.FC<ScentAlchemySectionProps> = ({ lang }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const stories: ScentStory[] = [
    {
      id: 'petrichor',
      nameBn: 'প্রথম বৃষ্টির ভেজা মাটি (Petrichor)',
      nameEn: 'Petrichor & Red Earth',
      familyBn: 'মাটি ও ওজোন',
      familyEn: 'Mineral & Ozone',
      notesBn: ['তৃষ্ণার্ত মাটি', 'আকাশের ওজোন', 'ভেজা কদম পাতা', 'পোড়ামাটি'],
      notesEn: ['Parched clay', 'Atmospheric ozone', 'Monsoon leaves', 'Geosmin'],
      descriptionBn:
        'তপ্ত রোদের পর এক পশলা বৃষ্টির জলে মাটির বুক থেকে যে সুবাস ওঠে, তা কোনো রসায়নাগারে তৈরি হয়নি। এ প্রকৃতির নিজের লেখা চিরকুট, যা কোটি বছর ধরে মানবজাতিকে বেঁচে থাকার আশ্বাস দিয়ে আসছে।',
      descriptionEn:
        'When rain kisses sun-baked earth, geosmin is unlocked into the air. It is the oldest memory preserved by the planet, signaling life, renewal, and calm.',
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'night-jasmine',
      nameBn: 'নিশুতি রাতের হাসনাহেনা ও বকুল',
      nameEn: 'Nocturnal Jasmine & Bakul',
      familyBn: 'হোয়াইট ফ্লোরাল',
      familyEn: 'White Floral',
      notesBn: ['ফোটা হাসনাহেনা', 'শিশিরভেজা ঘাস', 'শুকনো চামেলী', 'সবুজ কাণ্ড'],
      notesEn: ['Night-blooming jasmine', 'Morning dew', 'Spanish cherry', 'Green stems'],
      descriptionBn:
        'দিনের কোলাহল যখন স্তব্ধ হয়ে যায়, নিঝুম অন্ধকারে বকুলের গাছ আর হাসনাহেনা তাদের নির্জন সুবাস ছড়িয়ে দেয়। এ ঘ্রাণে মিশে থাকে ফেলে আসা কৈশোরের গল্প আর জানালায় রাখা পুরোনো চিঠি।',
      descriptionEn:
        'Blossoms that only reveal their intoxicating breath after twilight. A scent of nocturnal longing, window sills, and memories too tender to speak in daylight.',
      image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'sandalwood-amber',
      nameBn: 'চন্দন কাঠ ও অম্বর (Sandalwood & Amber)',
      nameEn: 'Sacred Sandalwood & Amber',
      familyBn: 'কাঠ ও অ্যাম্বার',
      familyEn: 'Woody & Resinous',
      notesBn: ['শ্বেত চন্দন', 'উষ্ণ রজন', 'ধোঁয়াটে আগর', 'জাফরান'],
      notesEn: ['Mysore sandalwood', 'Golden amber', 'Soft agarwood', 'Saffron threads'],
      descriptionBn:
        'প্রাচীন পুথি, মন্দিরের প্রাঙ্গণ আর ধোঁয়া ওঠা নিভৃত সন্ধ্যার গন্ধ। চন্দন কাঠের মিষ্টি গভীরতা মনকে শান্ত করে, মনে করিয়ে দেয় কোনো কিছুই চিরতরে হারিয়ে যায় না।',
      descriptionEn:
        'A sacred warmth distilled from ancient trees. Rich, meditative, and timeless, anchoring restless thoughts into deep serenity.',
      image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'old-books',
      nameBn: 'হলদে পুরোনো বই ও ভ্যানিলিন',
      nameEn: 'Vintage Parchment & Lignin',
      familyBn: 'নস্টালজিক পেপার',
      familyEn: 'Paper & Vanilla',
      notesBn: ['শুকনো লিগনিন', 'হালকা মিষ্টি ভ্যানিলা', 'পুরোনো চামড়ার বাইন্ডিং', 'ধূলিমাখা স্মৃতি'],
      notesEn: ['Cellulose breakdown', 'Faint vanillin', 'Leather binding', 'Time-worn dust'],
      descriptionBn:
        'কাগজের ভেতরে জমে থাকা সেলুলোজ যখন যুগের পর যুগ পার করে, তখন তা মিষ্টি ভ্যানিলা আর কাঠের এক সুবাস ছড়ায়। প্রতিটি পুরোনো বই তাই নিজেই এক সুবাসিত ইতিহাস।',
      descriptionEn:
        'As linen paper ages, lignin breaks down into trace vanillin compounds. The aroma of a beloved second-hand bookstore is literally the scent of time speaking.',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const current = stories[activeStoryIndex];

  return (
    <section id="scent-alchemy" className="py-24 bg-[#14100E] border-t border-[#261E18] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-[#C5A880] text-xs uppercase tracking-[0.25em] font-serif mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'স্মৃতি ও সুবাসের নির্ঘণ্ট' : 'The Olfactory Spectrum'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF3EB] font-light mb-4">
            {lang === 'bn'
              ? 'প্রতিটি সুবাসের শুরু এক টুকরো স্মৃতিতে'
              : 'Every Scent Begins Somewhere'}
          </h2>
          <p className="text-sm font-serif text-[#A39282] leading-relaxed">
            {lang === 'bn'
              ? 'সুবাস কেবল সুগন্ধি নয়; এটি মানুষের মস্তিষ্কে সংরক্ষিত স্মৃতির সবচেয়ে জীবন্ত চাবিকাঠি।'
              : 'Fragrance is the most intimate form of memory — bypassing logic to instantly awaken who we once were.'}
          </p>
        </div>

        {/* Interactive Story Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#1B1613] border border-[#2D231B] rounded-2xl p-6 sm:p-10 shadow-2xl">
          
          {/* Left Navigation Selector */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-[#8C7A6B] font-serif block mb-2">
              {lang === 'bn' ? 'সুবাসের স্বরলিপি বেছে নিন:' : 'Select Fragrance Profile:'}
            </span>

            {stories.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveStoryIndex(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                  activeStoryIndex === idx
                    ? 'border-[#C5A880] bg-[#C5A880]/10 text-[#FAF3EB] shadow-md'
                    : 'border-[#2D241E] bg-[#16110E] text-[#8C7A6B] hover:border-[#4A3B31] hover:text-[#D4C3B2]'
                }`}
              >
                <div>
                  <h4 className="font-serif text-sm font-medium">
                    {lang === 'bn' ? item.nameBn : item.nameEn}
                  </h4>
                  <span className="text-[11px] opacity-75 font-serif italic">
                    {lang === 'bn' ? item.familyBn : item.familyEn}
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    activeStoryIndex === idx ? 'text-[#C5A880] translate-x-1' : 'opacity-40'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Right Detailed Showcase */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Visual Photo Card */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#382E25] shadow-xl group">
              <img
                src={current.image}
                alt={current.nameEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-90 sepia-[0.15] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-2.5 py-1 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#FAF3EB] text-[10px] font-serif uppercase tracking-wider mb-2 backdrop-blur-sm">
                  {lang === 'bn' ? current.familyBn : current.familyEn}
                </span>
                <h3 className="font-serif text-xl text-[#FAF3EB] font-light">
                  {lang === 'bn' ? current.nameBn : current.nameEn}
                </h3>
              </div>
            </div>

            {/* Poetic Description and Notes */}
            <div className="space-y-5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-serif text-[#C5A880] block mb-2">
                  {lang === 'bn' ? 'ভাবপ্রকাশ ও রূপক' : 'Poetic Narrative'}
                </span>
                <p className="font-serif text-sm sm:text-base leading-relaxed text-[#DCD1C4] italic font-light">
                  "{lang === 'bn' ? current.descriptionBn : current.descriptionEn}"
                </p>
              </div>

              {/* Scent Accord Elements */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-serif text-[#8C7A6B] block mb-2.5">
                  {lang === 'bn' ? 'সুবাসের মূল উপাদানসমূহ:' : 'Key Olfactory Accords:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {(lang === 'bn' ? current.notesBn : current.notesEn).map((note, nIdx) => (
                    <span
                      key={nIdx}
                      className="px-3 py-1 rounded-full border border-[#3D3228] bg-[#221A16] text-[#D8C7B5] text-xs font-serif"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Philosophical note */}
              <div className="p-4 rounded-lg bg-[#14100E] border border-[#2D231B] text-xs font-serif text-[#9A897A] leading-relaxed">
                <span className="text-[#C5A880] font-semibold block mb-1">
                  {lang === 'bn' ? 'চিরকুট ভাবনা:' : 'Chirkut Thought:'}
                </span>
                {lang === 'bn'
                  ? 'আমরা হয়তো স্থান কাল পাত্র ভুলে যাই, কিন্তু বাতাসে ভেসে আসা ঘ্রাণ কখনো ভুল ঠিকানা মনে করায় না।'
                  : 'Time drifts and memories fade into mist, but a fleeting scent returns you home in a single heartbeat.'}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
