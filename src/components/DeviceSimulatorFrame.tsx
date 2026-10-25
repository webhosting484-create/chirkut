import React from 'react';
import { Smartphone, Apple, Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';

interface DeviceSimulatorFrameProps {
  mode: 'web' | 'android' | 'apple';
  onExit: () => void;
  lang: 'bn' | 'en';
  children: React.ReactNode;
}

export const DeviceSimulatorFrame: React.FC<DeviceSimulatorFrameProps> = ({
  mode,
  onExit,
  lang,
  children,
}) => {
  if (mode === 'web') {
    return <>{children}</>;
  }

  const isApple = mode === 'apple';

  return (
    <div className="min-h-screen bg-[#0C0A09] py-6 sm:py-10 px-2 sm:px-4 flex flex-col items-center justify-center">
      
      {/* Simulator Top Bar */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[430px] px-2 text-xs font-serif text-[#C8BCB0]">
        <div className="flex items-center gap-2">
          {isApple ? (
            <Apple className="w-4 h-4 text-[#FAF3EB]" />
          ) : (
            <Smartphone className="w-4 h-4 text-emerald-400" />
          )}
          <span className="font-medium text-[#FAF3EB]">
            {isApple
              ? lang === 'bn' ? 'অ্যাপল সংস্করণ (iPhone 15 Pro iOS)' : 'Apple iOS Simulator (iPhone 15 Pro)'
              : lang === 'bn' ? 'অ্যান্ড্রয়েড সংস্করণ (Android Galaxy)' : 'Android Simulator (Galaxy S24)'}
          </span>
        </div>

        <button
          onClick={onExit}
          className="flex items-center gap-1 text-[#C5A880] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'bn' ? 'ওয়েব মোডে ফিরুন' : 'Full Web View'}</span>
        </button>
      </div>

      {/* Realistic Phone Bezel Frame */}
      <div
        className={`relative w-full max-w-[410px] h-[860px] max-h-[92vh] rounded-[48px] border-[10px] ${
          isApple ? 'border-[#38332E] shadow-[0_0_50px_rgba(0,0,0,0.9)]' : 'border-[#2D2824] shadow-[0_0_50px_rgba(0,0,0,0.9)]'
        } bg-[#14110F] overflow-hidden flex flex-col`}
      >
        {/* Device Status Bar */}
        <div className="relative z-30 h-10 px-7 pt-2 flex items-center justify-between text-xs text-[#E8DFD8] select-none bg-[#14110F]/90 backdrop-blur-sm shrink-0">
          <span className="font-semibold text-[11px] font-sans">9:41</span>

          {/* Notch or Dynamic Island / Punch hole */}
          {isApple ? (
            <div className="w-28 h-6 bg-black rounded-full flex items-center justify-center px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E] mr-2" />
              <div className="w-2 h-2 rounded-full bg-[#0D243A]" />
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-white/10" />
          )}

          <div className="flex items-center gap-1.5 text-[11px]">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scaled App Content inside phone screen */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-14">
          {children}
        </div>

        {/* Bottom Gesture Bar */}
        <div className="relative z-30 h-6 bg-[#14110F] flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-[#FAF3EB]/40 rounded-full" />
        </div>

      </div>

    </div>
  );
};
