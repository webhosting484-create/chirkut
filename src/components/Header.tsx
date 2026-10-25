import React, { useState } from 'react';
import {
  Feather,
  Volume2,
  VolumeX,
  Flame,
  CloudRain,
  Plus,
  BookOpen,
  Sparkles,
  Globe,
  Smartphone,
  User,
  ShieldCheck,
  LogIn,
  Apple,
  Bell,
  Users,
  Settings as SettingsIcon,
  Search,
  FileText
} from 'lucide-react';
import { ambientAudio } from '../utils/ambientAudio';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenWriteModal: () => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenMobileAppModal: () => void;
  onOpenFriendsModal?: () => void;
  onOpenSettingsModal?: () => void;
  onOpenNotificationsPanel?: () => void;
  onOpenSearchModal?: () => void;
  onOpenActivityLog?: () => void;
  deviceMode: 'web' | 'android' | 'apple';
  onChangeDeviceMode: (mode: 'web' | 'android' | 'apple') => void;
  user: UserProfile | null;
  lang: 'bn' | 'en';
  onToggleLang: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWriteModal,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenMobileAppModal,
  onOpenFriendsModal,
  onOpenSettingsModal,
  onOpenNotificationsPanel,
  onOpenSearchModal,
  onOpenActivityLog,
  deviceMode,
  onChangeDeviceMode,
  user,
  lang,
  onToggleLang,
}) => {
  const [soundOpen, setSoundOpen] = useState(false);
  const [rainActive, setRainActive] = useState(false);
  const [fireActive, setFireActive] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const toggleRainSound = () => {
    const isNowPlaying = ambientAudio.toggleRain(volume);
    setRainActive(isNowPlaying);
  };

  const toggleFireSound = () => {
    const isNowPlaying = ambientAudio.toggleFire(volume);
    setFireActive(isNowPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientAudio.setMasterVolume(val);
  };

  const isAnySoundPlaying = rainActive || fireActive;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#14110F]/90 border-b border-[#2C241E] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group shrink-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl tracking-tight text-[#FAF3EB] group-hover:text-[#D4AF37] transition-colors">
                {lang === 'bn' ? 'চিরকুট' : 'notes'}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse"></span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7A6B] font-medium -mt-1">
              {lang === 'bn' ? 'স্মৃতি, গল্প ও সুবাস' : 'art & fragrance notes'}
            </span>
          </div>
        </a>

        {/* Device View Mode Switcher (Web, Android, Apple) */}
        <div className="hidden lg:flex items-center p-1 rounded-full bg-[#1C1613] border border-[#332A22] text-xs font-serif">
          <button
            onClick={() => onChangeDeviceMode('web')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              deviceMode === 'web'
                ? 'bg-[#C5A880] text-[#14100E] font-medium shadow'
                : 'text-[#8C7A6B] hover:text-[#FAF3EB]'
            }`}
          >
            <span>Web</span>
          </button>
          <button
            onClick={() => onChangeDeviceMode('android')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              deviceMode === 'android'
                ? 'bg-[#C5A880] text-[#14100E] font-medium shadow'
                : 'text-[#8C7A6B] hover:text-[#FAF3EB]'
            }`}
          >
            <Smartphone className="w-3 h-3 text-emerald-400" />
            <span>Android</span>
          </button>
          <button
            onClick={() => onChangeDeviceMode('apple')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
              deviceMode === 'apple'
                ? 'bg-[#C5A880] text-[#14100E] font-medium shadow'
                : 'text-[#8C7A6B] hover:text-[#FAF3EB]'
            }`}
          >
            <Apple className="w-3 h-3" />
            <span>Apple</span>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-serif">
          <a
            href="#hero"
            className="text-[#C8BCB0] hover:text-[#FAF3EB] tracking-wide transition-colors"
          >
            {lang === 'bn' ? 'মূল চিরকুট' : 'Featured'}
          </a>
          <a
            href="#gallery"
            className="text-[#C8BCB0] hover:text-[#FAF3EB] tracking-wide transition-colors"
          >
            {lang === 'bn' ? 'সংকলন' : 'Wall'}
          </a>
          <a
            href="#scent-alchemy"
            className="text-[#C8BCB0] hover:text-[#FAF3EB] tracking-wide transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'সুবাসের রসায়ন' : 'Alchemy'}</span>
          </a>
        </nav>

        {/* Right side interactive actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile App Modal Button */}
          <button
            onClick={onOpenMobileAppModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-xs font-serif transition-colors"
            title={lang === 'bn' ? 'মোবাইলে ইনস্টল করুন' : 'Install Mobile App'}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">
              {lang === 'bn' ? 'অ্যাপ ইনস্টল' : 'App'}
            </span>
          </button>

          {/* Ambient Soundscape Controller */}
          <div className="relative">
            <button
              onClick={() => setSoundOpen(!soundOpen)}
              className={`p-2 rounded-full border transition-all duration-300 flex items-center gap-1.5 ${
                isAnySoundPlaying
                  ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#E6C9A2]'
                  : 'border-[#332A24] text-[#A39282] hover:text-[#FAF3EB] hover:border-[#52443A]'
              }`}
              title={lang === 'bn' ? 'পরিবেশের আবহ শব্দ' : 'Ambient soundscape'}
            >
              {isAnySoundPlaying ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-ping" />
                </>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Sound controls popover */}
            {soundOpen && (
              <div className="absolute right-0 mt-3 w-64 p-4 rounded-xl bg-[#1D1714] border border-[#3D322B] shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#2C241E] mb-3">
                  <span className="font-serif text-[#FAF3EB] text-sm font-medium">
                    {lang === 'bn' ? 'আবহ শব্দ' : 'Ambient Soundscape'}
                  </span>
                  <button onClick={() => setSoundOpen(false)} className="text-[#8C7A6B] hover:text-[#FAF3EB]">
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={toggleRainSound}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full text-left transition-all ${
                      rainActive
                        ? 'border-[#7DA7D9]/50 bg-[#7DA7D9]/10 text-[#C1DBFF]'
                        : 'border-[#332A24] text-[#A39282] hover:bg-[#251E1A]'
                    }`}
                  >
                    <CloudRain className="w-4 h-4 text-[#7DA7D9]" />
                    <span>{lang === 'bn' ? 'বৃষ্টির শব্দ' : 'Gentle Rain'}</span>
                  </button>

                  <button
                    onClick={toggleFireSound}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-full text-left transition-all ${
                      fireActive
                        ? 'border-[#E07A5F]/50 bg-[#E07A5F]/10 text-[#FFC4B2]'
                        : 'border-[#332A24] text-[#A39282] hover:bg-[#251E1A]'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-[#E07A5F]" />
                    <span>{lang === 'bn' ? 'উষ্ণ আগুনের ওম' : 'Fireplace Crackle'}</span>
                  </button>

                  <div className="pt-2">
                    <label className="text-[11px] text-[#8C7A6B] block mb-1">
                      {lang === 'bn' ? 'ভলিউম নিয়ন্ত্রণ' : 'Volume Control'}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full accent-[#C5A880] bg-[#332A24] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-[#332A24] text-[#A39282] hover:text-[#FAF3EB] hover:border-[#52443A] text-xs font-serif transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{lang === 'bn' ? 'ENG' : 'বাং'}</span>
          </button>

          {/* Notifications Button */}
          {user && onOpenNotificationsPanel && (
            <button
              onClick={onOpenNotificationsPanel}
              className="p-2 rounded-full border border-[#332A24] text-[#A39282] hover:text-[#FAF3EB] hover:border-[#52443A] transition-colors relative"
              title={lang === 'bn' ? 'নোটিফিকেশন' : 'Notifications'}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C5A880]" />
            </button>
          )}

          {/* Friends Button */}
          {user && onOpenFriendsModal && (
            <button
              onClick={onOpenFriendsModal}
              className="p-2 rounded-full border border-[#332A24] text-[#A39282] hover:text-[#FAF3EB] hover:border-[#52443A] transition-colors"
              title={lang === 'bn' ? 'বন্ধবৃন্দ' : 'Friends'}
            >
              <Users className="w-4 h-4" />
            </button>
          )}

          {/* Settings Button */}
          {user && onOpenSettingsModal && (
            <button
              onClick={onOpenSettingsModal}
              className="p-2 rounded-full border border-[#332A24] text-[#A39282] hover:text-[#FAF3EB] hover:border-[#52443A] transition-colors"
              title={lang === 'bn' ? 'সেটিংস' : 'Settings'}
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          )}

          {/* Search Button */}
          {user && onOpenSearchModal && (
            <button
              onClick={onOpenSearchModal}
              className="p-2 rounded-full border border-[#332A24] text-[#A39282] hover:text-[#FAF3EB] hover:border-[#52443A] transition-colors"
              title={lang === 'bn' ? 'অনুসন্ধান' : 'Search'}
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Activity Log Button */}
          {user && onOpenActivityLog && (
            <button
              onClick={onOpenActivityLog}
              className="p-2 rounded-full border border-[#332A24] text-[#A39282] hover:text-[#FAF3EB] hover:border-[#52443A] transition-colors"
              title={lang === 'bn' ? 'কার্যক্রম' : 'Activity'}
            >
              <FileText className="w-4 h-4" />
            </button>
          )}

          {/* User Profile / Login Avatar */}
          {user ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-[#3A2E24] bg-[#221A15] hover:border-[#C5A880] transition-colors"
              title={user.displayName || 'Profile'}
            >
              <div className="w-6 h-6 rounded-full bg-[#C5A880] overflow-hidden flex items-center justify-center text-[10px] text-[#14100E] font-bold">
                {user.photoURL && user.photoURL.trim() ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  (user.displayName && typeof user.displayName === 'string' && user.displayName.length > 0 ? user.displayName[0] : 'ইউ')
                )}
              </div>
              <span className="text-xs font-serif text-[#FAF3EB] max-w-[80px] truncate hidden sm:inline">
                {user.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A880]/50 bg-[#C5A880]/15 hover:bg-[#C5A880]/25 text-[#FAF3EB] text-xs font-serif transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{lang === 'bn' ? 'লগইন' : 'Sign In'}</span>
            </button>
          )}

          {/* Write Chirkut Action Button */}
          <button
            onClick={onOpenWriteModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#C5A880] bg-[#C5A880] text-[#14110F] text-xs font-serif font-semibold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)] hover:bg-[#D4AF37]"
          >
            <Feather className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {lang === 'bn' ? 'চিরকুট লিখুন' : 'Write'}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
