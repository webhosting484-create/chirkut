import React, { useState } from 'react';
import { X, UserMinus } from 'lucide-react';
import { UserProfile } from '../types';
import { blockUser, isUserBlocked } from '../services/block';

interface BlockUserButtonProps {
  currentUser: UserProfile | null;
  targetUser: UserProfile;
  lang: 'bn' | 'en';
  onBlocked?: () => void;
}

export const BlockUserButton: React.FC<BlockUserButtonProps> = ({ currentUser, targetUser, lang, onBlocked }) => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBlock = async () => {
    if (!currentUser) return;
    setIsBlocking(true);
    try {
      await blockUser(currentUser.uid, targetUser);
      onBlocked?.();
      setShowConfirm(false);
    } catch {
      // ignore
    } finally {
      setIsBlocking(false);
    }
  };

  if (!currentUser || currentUser.uid === targetUser.uid) return null;

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-800/50 text-rose-300 hover:bg-rose-950/40 text-xs font-serif transition-colors"
      >
        <UserMinus className="w-3.5 h-3.5" />
        <span>{lang === 'bn' ? 'ব্লক' : 'Block'}</span>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-full max-w-md bg-[#1A1512] border border-[#3D322B] rounded-2xl p-6 shadow-2xl text-[#E8DFD8]">
            <h3 className="font-serif text-lg text-[#FAF3EB] mb-2">
              {lang === 'bn' ? 'ব্যবহারকারী ব্লক করুন' : 'Block User'}
            </h3>
            <p className="text-sm font-serif text-[#C8BCB0] mb-4">
              {lang === 'bn'
                ? `আপনি কি "${targetUser.displayName}" কে ব্লক করতে চান? ব্লক করা ব্যবহারকারীরা আপনার প্রোফাইল এবং চিরকুট দেখতে পারবে না।`
                : `Are you sure you want to block "${targetUser.displayName}"? Blocked users won't be able to see your profile or notes.`}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl border border-[#382E25] text-xs font-serif text-[#A39282] hover:text-[#FAF3EB] transition-colors"
              >
                {lang === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={handleBlock}
                disabled={isBlocking}
                className="px-4 py-2 rounded-xl bg-rose-900/60 border border-rose-800/50 text-rose-200 text-xs font-serif hover:bg-rose-900/80 transition-colors disabled:opacity-50"
              >
                {isBlocking
                  ? lang === 'bn' ? 'ব্লক হচ্ছে...' : 'Blocking...'
                  : lang === 'bn' ? 'ব্লক করুন' : 'Block User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
