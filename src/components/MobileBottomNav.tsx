import React from 'react';
import { Feather, Heart, Sparkles, User, Smartphone, PlusCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileBottomNavProps {
  onOpenWriteModal: () => void;
  onOpenCreateStory: () => void;
  onOpenProfileOrAuth: () => void;
  onOpenMobileAppModal: () => void;
  onScrollToGallery: () => void;
  onScrollToHero: () => void;
  user: UserProfile | null;
  lang: 'bn' | 'en';
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenWriteModal,
  onOpenCreateStory,
  onOpenProfileOrAuth,
  onOpenMobileAppModal,
  onScrollToGallery,
  onScrollToHero,
  user,
  lang,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#14110F]/95 backdrop-blur-lg border-t border-[#2C241E] px-4 py-2 flex items-center justify-around sm:hidden">
      
      <button
        onClick={onScrollToHero}
        className="flex flex-col items-center gap-1 text-[#8C7A6B] hover:text-[#FAF3EB]"
      >
        <Feather className="w-5 h-5" />
        <span className="text-[10px] font-serif">
          {lang === 'bn' ? 'হোম' : 'Home'}
        </span>
      </button>

      <button
        onClick={onScrollToGallery}
        className="flex flex-col items-center gap-1 text-[#8C7A6B] hover:text-[#FAF3EB]"
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px] font-serif">
          {lang === 'bn' ? 'ফিড' : 'Feed'}
        </span>
      </button>

      {/* Main Center Floating Plus Button */}
      <button
        onClick={onOpenWriteModal}
        className="flex flex-col items-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#A05D46] via-[#C5A880] to-[#E5D2BA] text-[#14100E] flex items-center justify-center shadow-[0_0_15px_rgba(197,168,128,0.4)] hover:scale-105 transition-transform">
          <Feather className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-serif text-[#FAF3EB] mt-1">
          {lang === 'bn' ? 'লিখুন' : 'Write'}
        </span>
      </button>

      <button
        onClick={onOpenMobileAppModal}
        className="flex flex-col items-center gap-1 text-[#8C7A6B] hover:text-[#FAF3EB]"
      >
        <Smartphone className="w-5 h-5 text-emerald-400" />
        <span className="text-[10px] font-serif">
          {lang === 'bn' ? 'অ্যাপ' : 'App'}
        </span>
      </button>

      <button
        onClick={onOpenProfileOrAuth}
        className="flex flex-col items-center gap-1 text-[#8C7A6B] hover:text-[#FAF3EB]"
      >
        <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-[#241C16]">
          {user?.photoURL && user.photoURL.trim() ? (
            <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-[#C5A880]" />
          )}
        </div>
        <span className="text-[10px] font-serif">
          {user ? (lang === 'bn' ? 'প্রোফাইল' : 'Profile') : (lang === 'bn' ? 'লগইন' : 'Sign In')}
        </span>
      </button>

    </div>
  );
};
