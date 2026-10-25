import React from 'react';
import { Feather, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  lang: 'bn' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0D0A08] text-[#8C7A6B] py-14 border-t border-[#1F1712]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1A1410]">
          
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl text-[#FAF3EB]">
              {lang === 'bn' ? 'চিরকুট' : 'notes'}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
            <span className="text-xs font-serif text-[#A39282]">
              {lang === 'bn'
                ? 'একটি মুহূর্ত। একটি স্থান। একটি অনুভূতি।'
                : 'A moment. A place. A feeling.'}
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-serif">
            <a href="#hero" className="hover:text-[#FAF3EB] transition-colors">
              {lang === 'bn' ? 'নীড়ে ফিরুন' : 'Home'}
            </a>
            <a href="#gallery" className="hover:text-[#FAF3EB] transition-colors">
              {lang === 'bn' ? 'চিরকুট সম্ভার' : 'Gallery'}
            </a>
            <a href="#scent-alchemy" className="hover:text-[#FAF3EB] transition-colors">
              {lang === 'bn' ? 'সুবাসের রসায়ন' : 'Fragrance'}
            </a>
            <a href="#about" className="hover:text-[#FAF3EB] transition-colors">
              {lang === 'bn' ? 'দর্শন' : 'Philosophy'}
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full border border-[#2B211A] hover:border-[#C5A880] text-[#A39282] hover:text-[#FAF3EB] transition-colors"
            title={lang === 'bn' ? 'উপরে যান' : 'Back to top'}
          >
            <ArrowUp className="w-4 h-4" />
          </button>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-serif">
          <p>
            {lang === 'bn'
              ? '© চিরকুট (Chirkut Notes) • ভালোবাসার অক্ষত স্মৃতি'
              : '© Chirkut • Preserving moments, places, and fragrances in ink.'}
          </p>

          <p className="flex items-center gap-1.5 text-[#A39282]">
            <span>{lang === 'bn' ? 'শব্দ ও সুবাসের সমন্বয়ে নির্মিত' : 'Crafted with paper, ink & quiet reverie'}</span>
            <Feather className="w-3 h-3 text-[#C5A880]" />
          </p>
        </div>

      </div>
    </footer>
  );
};
