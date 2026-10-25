import React, { useState } from 'react';
import { X, Smartphone, Apple, Download, Check, Shield, Sparkles, ExternalLink, QrCode } from 'lucide-react';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({ isOpen, onClose, lang }) => {
  const [activePlatform, setActivePlatform] = useState<'android' | 'apple'>('android');
  const [installed, setInstalled] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = () => {
    // Trigger PWA install if available in browser
    const deferredPrompt = (window as any).deferredPwaPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setInstalled(true);
        }
      });
    } else {
      setInstalled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#181310] border border-[#3D3228] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#E8DFD8]">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-xs uppercase font-serif tracking-[0.2em] text-[#C5A880] mb-2">
          <Smartphone className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'মোবাইল অ্যাপ সংস্করণ' : 'Mobile App Editions'}</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF3EB] font-light mb-2">
          {lang === 'bn' ? 'অ্যান্ড্রয়েড ও অ্যাপল আইওএস অ্যাপ' : 'Android & Apple iOS Versions'}
        </h3>
        <p className="text-xs font-serif text-[#8C7A6B] mb-6">
          {lang === 'bn'
            ? 'চিরকুট ওয়েবসাইটটি ফুল-স্ট্যাক PWA প্রযুক্তিতে তৈরি। এটি আপনার মোবাইলে নেটিভ অ্যাপের মতো ইনস্টল হয়ে সম্পূর্ণ অফলাইনেও কাজ করে।'
            : 'Chirkut is engineered as a Progressive Web Application running seamlessly as a standalone native app on Android and iOS.'}
        </p>

        {/* Platform Switcher Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setActivePlatform('android')}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-serif transition-all ${
              activePlatform === 'android'
                ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB] font-medium shadow-md'
                : 'border-[#2D231B] bg-[#14100E] text-[#8C7A6B] hover:text-[#FAF3EB]'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ (Android)' : 'Android Version'}</span>
          </button>

          <button
            onClick={() => setActivePlatform('apple')}
            className={`p-3 rounded-xl border flex items-center justify-center gap-2.5 text-xs font-serif transition-all ${
              activePlatform === 'apple'
                ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB] font-medium shadow-md'
                : 'border-[#2D231B] bg-[#14100E] text-[#8C7A6B] hover:text-[#FAF3EB]'
            }`}
          >
            <Apple className="w-4 h-4 text-[#FAF3EB]" />
            <span>{lang === 'bn' ? 'অ্যাপল সংস্করণ (iOS / iPhone)' : 'Apple iOS Version'}</span>
          </button>
        </div>

        {/* Platform Instructions */}
        {activePlatform === 'android' ? (
          <div className="space-y-4 p-4 rounded-xl bg-[#1F1814] border border-[#2F241C]">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C5A880] text-[#14100E] text-xs font-bold flex items-center justify-center shrink-0">
                ১
              </span>
              <p className="text-xs font-serif text-[#C8BCB0]">
                {lang === 'bn'
                  ? 'আপনার অ্যান্ড্রয়েড ফোনে Chrome ব্রাউজারে সাইটটি ওপেন করুন।'
                  : 'Open Chirkut in Google Chrome on your Android device.'}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C5A880] text-[#14100E] text-xs font-bold flex items-center justify-center shrink-0">
                ২
              </span>
              <p className="text-xs font-serif text-[#C8BCB0]">
                {lang === 'bn'
                  ? 'নিচের "ইনস্টল করুন" বাটনে চাপুন অথবা ব্রাউজারের ৩ ডট মেনু (⋮) থেকে "Install App" বা "Add to Home Screen" নির্বাচন করুন।'
                  : 'Tap the button below or tap the Chrome three-dot menu (⋮) and select "Install App" or "Add to Home screen".'}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#C5A880] text-[#14100E] text-xs font-bold flex items-center justify-center shrink-0">
                ৩
              </span>
              <p className="text-xs font-serif text-[#C8BCB0]">
                {lang === 'bn'
                  ? 'মুহূর্তের মধ্যে "চিরকুট" অ্যাপ আপনার ফোনের হোম স্ক্রিনে ইনস্টল হয়ে যাবে।'
                  : 'The Chirkut app icon will appear on your home screen and app drawer.'}
              </p>
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full mt-2 py-3 rounded-xl bg-[#C5A880] text-[#14100E] font-serif font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>
                {installed
                  ? lang === 'bn' ? 'অ্যাপ ইনস্টল সম্পন্ন হয়েছে ✓' : 'App Installed ✓'
                  : lang === 'bn' ? 'অ্যান্ড্রয়েড অ্যাপ ইনস্টল করুন' : 'Install Android App'}
              </span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 p-4 rounded-xl bg-[#1F1814] border border-[#2F241C]">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FAF3EB] text-[#14100E] text-xs font-bold flex items-center justify-center shrink-0">
                ১
              </span>
              <p className="text-xs font-serif text-[#C8BCB0]">
                {lang === 'bn'
                  ? 'আপনার iPhone বা iPad-এ Safari ব্রাউজারে এই সাইটটি ওপেন করুন।'
                  : 'Open Chirkut in Safari on your iPhone or iPad.'}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FAF3EB] text-[#14100E] text-xs font-bold flex items-center justify-center shrink-0">
                ২
              </span>
              <p className="text-xs font-serif text-[#C8BCB0]">
                {lang === 'bn'
                  ? 'নিচের শেয়ার আইকনে (চারকোনা বাক্সের ওপর তীরচিহ্ন ⎋) ট্যাপ করুন।'
                  : 'Tap the Share icon (square with arrow pointing up) at the bottom.'}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#FAF3EB] text-[#14100E] text-xs font-bold flex items-center justify-center shrink-0">
                ৩
              </span>
              <p className="text-xs font-serif text-[#C8BCB0]">
                {lang === 'bn'
                  ? 'মেনু থেকে স্ক্রল করে "Add to Home Screen" (হোম স্ক্রিনে যোগ করুন) নির্বাচন করুন।'
                  : 'Scroll down and tap "Add to Home Screen", then tap "Add".'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-center text-xs font-serif text-[#E8DFD8]">
              {lang === 'bn'
                ? 'আইফোনে এটি সম্পূর্ণ ফুল-স্ক্রিন অ্যাপল অ্যাপ হিসেবে চলবে!'
                : 'Runs in native full-screen mode on iOS with zero address bar!'}
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-6 pt-4 border-t border-[#2C231B] grid grid-cols-3 gap-2 text-center text-[10px] font-serif text-[#A39282]">
          <div>⚡ {lang === 'bn' ? 'দ্রুতগতি লোডিং' : 'Instant Loading'}</div>
          <div>🔒 {lang === 'bn' ? 'হাই-সিকিউরিটি ডাটা' : 'Encrypted Cloud'}</div>
          <div>🌿 {lang === 'bn' ? 'অফলাইন ক্যাশ' : 'Offline Ready'}</div>
        </div>

      </div>
    </div>
  );
};
