import React from 'react';
import { Feather, Compass, Heart, Scroll } from 'lucide-react';

interface AboutSectionProps {
  lang: 'bn' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  return (
    <section id="about" className="py-24 bg-[#110D0B] border-t border-[#261E18] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#C5A880] text-xs uppercase tracking-[0.25em] font-serif mb-3">
            <Scroll className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'আমাদের দর্শন' : 'Our Philosophy'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF3EB] font-light">
            {lang === 'bn'
              ? 'চিরকুট: না-বলা কথার এক টুকরো কাগজ'
              : 'The Art of the Handwritten Slip'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          
          <div className="p-6 rounded-xl bg-[#181310] border border-[#2B211A]">
            <div className="w-10 h-10 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] mb-4 mx-auto sm:mx-0 bg-[#C5A880]/10">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF3EB] font-normal mb-2">
              {lang === 'bn' ? 'চিরন্তন চিরকুট' : 'Tactile Sincerity'}
            </h3>
            <p className="text-xs font-serif leading-relaxed text-[#A39282]">
              {lang === 'bn'
                ? 'ডিজিটাল বার্তার ভিড়ে আমরা হারিয়ে ফেলেছি কাগজের খসখসে অনুভূতি। একটি চিরকুট হলো যত্ন নিয়ে লেখা এমন এক নীরব কথা যা বুক পকেটে থেকে যায় সারাজীবন।'
                : 'In an era of fleeting notifications, handwritten chirkuts capture vulnerability that pixels can never hold.'}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#181310] border border-[#2B211A]">
            <div className="w-10 h-10 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] mb-4 mx-auto sm:mx-0 bg-[#C5A880]/10">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF3EB] font-normal mb-2">
              {lang === 'bn' ? 'সুবাস ও মুহূর্ত' : 'Scent & Stillness'}
            </h3>
            <p className="text-xs font-serif leading-relaxed text-[#A39282]">
              {lang === 'bn'
                ? 'যেকোনো অনুভূতির পেছনে একটা অদৃশ্য সুবাস থাকে। কখনো তা ভেজা মাটির, কখনো পুরোনো চন্দনের, কিংবা কার্তিক মাসের কুয়াশার।'
                : 'Every memory carries an olfactory signature — rain-soaked soil, dried jasmine petals, or the smoky chill of early winter.'}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#181310] border border-[#2B211A]">
            <div className="w-10 h-10 rounded-full border border-[#C5A880]/40 flex items-center justify-center text-[#C5A880] mb-4 mx-auto sm:mx-0 bg-[#C5A880]/10">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg text-[#FAF3EB] font-normal mb-2">
              {lang === 'bn' ? 'স্মৃতির সেতু' : 'Timeless Connection'}
            </h3>
            <p className="text-xs font-serif leading-relaxed text-[#A39282]">
              {lang === 'bn'
                ? 'চিরকুট কেবল একা পড়ার নয়, অন্যের হৃদয়ে পৌঁছে দেওয়ার এক কোমল সেতুবন্ধন। পৃথিবীর যে প্রান্তেই থাকুন না কেন, অনুভব ছড়িয়ে দিন।'
                : 'Notes left for strangers, lovers, and travelers. A quiet bridge connecting human souls across distances and years.'}
            </p>
          </div>

        </div>

        {/* Quote in footer area */}
        <div className="mt-16 text-center border-t border-[#231A14] pt-12">
          <blockquote className="font-serif italic text-lg sm:text-xl text-[#C8BCB0] max-w-2xl mx-auto font-light">
            {lang === 'bn'
              ? '“বাতাস বয়ে নিয়ে যায় যা ফুল ধরে রাখতে পারে না, আর আমরা যা ভুলে যাই পৃথিবী তা সযত্নে মনে রাখে।”'
              : '“The wind carries what flowers cannot keep, and the earth remembers what we forget.”'}
          </blockquote>
          <span className="block text-xs uppercase tracking-[0.2em] text-[#8C7A6B] font-serif mt-3">
            — চিরকুট আর্কাইভ নং ১৪
          </span>
        </div>

      </div>
    </section>
  );
};
