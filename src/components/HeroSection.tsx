import React from 'react';
import { ArrowRight, Compass, Sparkles, BookOpen, Quote } from 'lucide-react';
import { ChirkutNote } from '../types';
import { INITIAL_CHIRKUT_NOTES } from '../data/chirkutData';

interface HeroSectionProps {
  heroNote?: ChirkutNote;
  onSelectNote: (note: ChirkutNote) => void;
  onExploreClick: () => void;
  lang: 'bn' | 'en';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroNote,
  onSelectNote,
  onExploreClick,
  lang
}) => {
  const note = heroNote || INITIAL_CHIRKUT_NOTES[0];

  return (
    <section id="hero" className="relative pt-12 pb-24 overflow-hidden">
      {/* Subtle radial ambient warmth backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(197,168,128,0.09)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Text Editorial Block - Exactly matching the user's reference */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          
          {/* Main Display Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#FAF3EB] tracking-tight leading-[1.15] font-light">
            {lang === 'bn' ? (
              <>একটি মুহূর্ত। একটি স্থান। একটি অনুভূতি।</>
            ) : (
              <>A moment. A place. A feeling.</>
            )}
          </h1>

          {/* Golden Flourish / Vine Divider - from screenshot */}
          <div className="flex items-center gap-3 my-4 text-[#C5A880]/70">
            <span className="h-[1px] w-8 bg-[#C5A880]/40"></span>
            <span className="text-sm font-serif italic tracking-widest">𖥸</span>
            <span className="h-[1px] w-8 bg-[#C5A880]/40"></span>
          </div>

          {/* Italic Serif Subtitle */}
          <p className="font-serif italic text-xl sm:text-2xl text-[#D8C7B5] font-light mb-3">
            {lang === 'bn' ? (
              <>প্রতিটি স্মৃতির শুরু কোথাও না কোথাও।</>
            ) : (
              <>Every scent begins somewhere.</>
            )}
          </p>

          {/* Description */}
          <p className="text-[#A39282] text-sm sm:text-base leading-relaxed font-light mb-6 max-w-xl">
            {lang === 'bn' ? (
              <>আবিষ্কার করুন সেইসব মুহূর্ত, শিল্পী এবং স্মৃতির স্বরলিপি যা সমকালীন সুবাস ও অনুভূতির চিরকুটকে রূপ দেয়।</>
            ) : (
              <>Discover the stories, artists, and voices shaping contemporary fragrance and poetic memory.</>
            )}
          </p>

          {/* Action Button - exactly matching the screenshot's 'LEARN MORE ---->' */}
          <div>
            <button
              onClick={onExploreClick}
              className="group inline-flex items-center gap-3 px-6 py-3 border border-[#C5A880]/60 hover:border-[#D4AF37] text-[#FAF3EB] text-xs uppercase tracking-[0.2em] font-serif transition-all duration-300 hover:bg-[#C5A880]/10 hover:shadow-[0_0_25px_rgba(197,168,128,0.2)]"
            >
              <span>{lang === 'bn' ? 'চিরকুট অন্বেষণ' : 'LEARN MORE'}</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>

        </div>

        {/* Visual Composition / Collage matching the screenshot layout */}
        <div className="relative rounded-2xl overflow-hidden border border-[#2A231C] bg-[#16120F] shadow-2xl p-2 sm:p-4">
          
          {/* 4-Image Grid Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 aspect-[4/3] sm:aspect-[16/10] max-h-[640px] w-full relative">
            
            {/* Top-Left: Petals Texture */}
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80"
                alt="Delicate scattered flower petals on raw linen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.82] sepia-[0.15] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-3 left-3 text-[11px] font-serif italic text-[#E8DFD8]/80">
                {lang === 'bn' ? 'রোদমাখা পাপড়ি' : 'Top notes • Petals & linen'}
              </div>
            </div>

            {/* Top-Right: Golden Hour Garden & Cypress Trees with sunlight */}
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80"
                alt="Sunbeams streaming through hills, cypress trees and wild garden flowers"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.88] sepia-[0.2] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-3 right-3 text-[11px] font-serif italic text-[#E8DFD8]/80 text-right">
                {lang === 'bn' ? 'গোধূলির উদ্যান' : 'Golden hour • Tuscany hillside'}
              </div>
            </div>

            {/* Bottom-Left: Mountain Wild Grasses in Twilight Breeze */}
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                alt="Wild grasses and mountain peaks under warm evening breeze"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.78] sepia-[0.25] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 text-[11px] font-serif italic text-[#E8DFD8]/80">
                {lang === 'bn' ? 'পাহাড়ের বাতাস' : 'Base notes • Twilight air'}
              </div>
            </div>

            {/* Bottom-Right: Campfire glowing warm embers */}
            <div className="relative overflow-hidden rounded-lg group">
              <img
                src="https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=800&q=80"
                alt="Warm flickering campfire embers in the evening dusk"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 right-3 text-[11px] font-serif italic text-[#E8DFD8]/80 text-right">
                {lang === 'bn' ? 'উষ্ণ আগুনের ওম' : 'Heart • Embers & cedar'}
              </div>
            </div>

          </div>

          {/* THE CENTERPIECE: The Real Tactile "চিরকুট" (Handwritten Paper Note) */}
          {/* Positioned directly overlapping the center of the 4 photos, matching the sample */}
          <div className="relative md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[480px] lg:w-[520px] mt-4 md:mt-0 z-20">
            <div
              onClick={() => onSelectNote(note)}
              className="cursor-pointer group relative bg-[#F4EFE6] text-[#241C16] p-6 sm:p-8 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.75)] border border-[#D5C5B0] transition-all duration-500 hover:scale-[1.02] hover:-rotate-0.5 hover:shadow-[0_25px_70px_rgba(0,0,0,0.85)] rotate-[-1deg]"
            >
              
              {/* Paper deckle edge and texture simulation */}
              <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#ab947a_0.8px,transparent_0.8px)] [background-size:16px_16px]" />
              
              {/* Top dried botanical sprig decoration */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D8C7B5] mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9E4738]/80 inline-block shadow-sm"></span>
                  <span className="text-[10px] tracking-[0.25em] uppercase font-serif text-[#786352] font-semibold">
                    {lang === 'bn' ? 'আর্কাইভ নং ১৪' : 'NOTE ARCHIVE NO. 14'}
                  </span>
                </div>
                <span className="text-[11px] font-serif italic text-[#8A7360]">
                  {note?.location || ''}
                </span>
              </div>

              {/* The exact quote from the user's reference screenshot */}
              <div className="my-3 px-2">
                <p className="font-handwriting text-2xl sm:text-3xl text-[#1E1712] leading-snug tracking-wide font-medium">
                  {lang === 'bn' ? (
                    <>"{note?.quoteBn || note?.quote || ''}"</>
                  ) : (
                    <>"{note?.quote || note?.quoteBn || ''}"</>
                  )}
                </p>
                {lang === 'bn' && note?.quote && (
                  <p className="text-xs font-serif italic text-[#635345] mt-2 border-t border-[#E0D3C3] pt-2">
                    Original note: "{note.quote}"
                  </p>
                )}
              </div>

              {/* Fragrance Notes Bar inside the paper */}
              <div className="mt-6 pt-4 border-t border-[#D8C7B5] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#786352] font-serif">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A37B48]" />
                  <span>
                    <strong className="font-semibold text-[#4A3B2E]">
                      {lang === 'bn' ? 'সুবাস নির্ঘণ্ট: ' : 'Scent notes: '}
                    </strong>
                    {note?.scentProfile?.base || 'ভেজা মাটি ও অ্যাম্বার'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#8A3A2F] group-hover:translate-x-1 transition-transform">
                  <span className="text-[10px] tracking-wider uppercase font-semibold">
                    {lang === 'bn' ? 'পুরো চিরকুট পড়ুন' : 'Read backstory'}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Vintage Postal Seal / Stamp in the corner */}
              <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full border-2 border-dashed border-[#A05D46]/70 flex items-center justify-center rotate-12 bg-[#F4EFE6]/90 shadow-md">
                <span className="text-[9px] uppercase tracking-widest font-serif text-[#A05D46] font-bold text-center leading-tight">
                  চিরকুট<br />SEAL
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
