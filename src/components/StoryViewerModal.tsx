import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Sparkles, Flame, Volume2, VolumeX } from 'lucide-react';
import { StoryItem } from '../types';

interface StoryViewerModalProps {
  stories: StoryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onOpenAuthorProfile?: (author: { name: string; id?: string; avatar?: string }) => void;
  lang: 'bn' | 'en';
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onOpenAuthorProfile,
  lang,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reactionSent, setReactionSent] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const timerRef = useRef<number | null>(null);

  const story = stories[currentIndex];

  useEffect(() => {
    if (!isOpen || !story || isPaused) return;

    setProgress(0);
    const interval = 50; // update every 50ms
    const totalDuration = 6000; // 6 seconds per story
    const step = (interval / totalDuration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timerRef.current!);
          if (currentIndex < stories.length - 1) {
            onNavigate(currentIndex + 1);
          } else {
            onClose();
          }
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, currentIndex, story, isPaused, stories.length, onNavigate, onClose]);

  if (!isOpen || !story) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const sendReaction = (emoji: string) => {
    setReactionSent(emoji);
    setTimeout(() => setReactionSent(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg animate-in fade-in duration-200">
      
      {/* Background backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Story Container (9:16 mobile aspect ratio frame) */}
      <div
        className="relative z-10 w-full max-w-sm h-[85vh] sm:h-[88vh] rounded-2xl overflow-hidden shadow-2xl border border-[#3A2E24] bg-[#14110F] flex flex-col justify-between select-none"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        
        {/* Background Visual (Image or Video) */}
        {story.videoUrl ? (
          <video
            src={story.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : story.bgImage ? (
          <img
            src={story.bgImage}
            alt={story.authorName}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D2C22] via-[#211713] to-[#120D0A]" />
        )}

        {/* Gradient dark overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

        {/* Top Story Header */}
        <div className="relative z-20 p-4">
          
          {/* Progress Bars */}
          <div className="flex items-center gap-1.5 mb-3">
            {stories.map((s, idx) => (
              <div key={s.id} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E5D2BA] transition-all"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author Info & Close */}
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                if (onOpenAuthorProfile) {
                  onClose();
                  onOpenAuthorProfile({
                    name: story.authorName,
                    id: story.authorId,
                    avatar: story.authorAvatar,
                  });
                }
              }}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 group"
              title={lang === 'bn' ? `${story.authorName}-এর প্রোফাইল দেখুন` : `View ${story.authorName}'s profile`}
            >
              <div className="w-8 h-8 rounded-full border border-[#C5A880] overflow-hidden bg-[#241C16] flex items-center justify-center text-xs font-serif text-[#FAF3EB] group-hover:scale-105 transition-transform">
                {story.authorAvatar ? (
                  <img
                    src={story.authorAvatar}
                    alt={story.authorName || 'Story'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (story.authorName && typeof story.authorName === 'string' && story.authorName.length > 0 ? story.authorName[0] : 'চি')
                )}
              </div>
              <div>
                <h4 className="text-xs font-serif font-medium text-[#FAF3EB] group-hover:text-[#C5A880] transition-colors">
                  {story.authorName || (lang === 'bn' ? 'অজ্ঞাত' : 'Anonymous')}
                </h4>
                <span className="text-[10px] text-[#A39282] font-serif">
                  {lang === 'bn' ? '২৪ ঘণ্টার চিরকুট • প্রোফাইল দেখুন' : '24h Story • View Profile'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {story.videoUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1 rounded-full text-white/70 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Center Story Poetic Text */}
        <div className="relative z-20 px-6 my-auto text-center">
          {story.text && (
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
              <p className="font-handwriting text-3xl sm:text-4xl text-[#FAF3EB] leading-relaxed drop-shadow-md">
                "{story.text}"
              </p>
            </div>
          )}

          {/* Animated Reaction Popup */}
          {reactionSent && (
            <div className="absolute inset-0 flex items-center justify-center animate-bounce text-6xl pointer-events-none">
              {reactionSent}
            </div>
          )}
        </div>

        {/* Left/Right Navigation Taps */}
        <div className="absolute inset-y-20 left-0 w-1/3 z-10 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-20 right-0 w-1/3 z-10 cursor-pointer" onClick={handleNext} />

        {/* Bottom Reaction Bar */}
        <div className="relative z-20 p-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs font-serif text-[#C8BCB0]">
            {lang === 'bn' ? 'অনুভূতি জানান:' : 'Send reaction:'}
          </span>
          <div className="flex items-center gap-2 text-xl">
            {['❤️', '✨', '🔥', '🌸', '🕊️'].map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  sendReaction(emoji);
                }}
                className="hover:scale-125 active:scale-150 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Navigation Arrows for Desktop */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden sm:block absolute left-8 p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-black/80 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden sm:block absolute right-8 p-3 rounded-full bg-black/50 border border-white/20 text-white hover:bg-black/80 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

    </div>
  );
};
