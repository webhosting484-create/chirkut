import React, { useState, useEffect } from 'react';
import { X, Shield, UserX } from 'lucide-react';
import { UserProfile } from '../types';
import { getBlockedUsers, unblockUser } from '../services/block';

interface BlockedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  lang: 'bn' | 'en';
}

export const BlockedUsersModal: React.FC<BlockedUsersModalProps> = ({ isOpen, onClose, user, lang }) => {
  const [blockedUsers, setBlockedUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;
    loadBlockedUsers();
  }, [isOpen, user?.uid]);

  const loadBlockedUsers = async () => {
    if (!user) return;
    const blocked = await getBlockedUsers(user.uid);
    setBlockedUsers(blocked);
  };

  const handleUnblock = async (blockedUserId: string) => {
    if (!user) return;
    await unblockUser(user.uid, blockedUserId);
    setBlockedUsers((prev) => prev.filter((u) => u.uid !== blockedUserId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#1A1512] border border-[#3D322B] rounded-2xl p-6 shadow-2xl text-[#E8DFD8] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#2C241E] mb-5">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-2xl text-[#FAF3EB] font-light">
              {lang === 'bn' ? 'ব্লক করা ব্যবহারকারী' : 'Blocked Users'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {blockedUsers.length === 0 ? (
            <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
              <UserX className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
              <span>{lang === 'bn' ? 'কোনো ব্যবহারকারী ব্লক করা হয়নি।' : 'No blocked users.'}</span>
            </div>
          ) : (
            blockedUsers.map((blockedUser) => (
              <div key={blockedUser.uid} className="flex items-center justify-between p-3 rounded-xl bg-[#201915] border border-[#2D231B]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#382B21] overflow-hidden flex items-center justify-center text-xs text-[#FAF3EB]">
                    {blockedUser.photoURL && blockedUser.photoURL.trim() ? (
                      <img src={blockedUser.photoURL} alt={blockedUser.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      (blockedUser.displayName && blockedUser.displayName.length > 0 ? blockedUser.displayName[0] : '?')
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-serif text-[#FAF3EB] font-medium">{blockedUser.displayName}</p>
                    <p className="text-[10px] font-serif text-[#786657]">
                      {lang === 'bn' ? 'ব্লক করা হয়েছে' : 'Blocked'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(blockedUser.uid)}
                  className="px-3 py-1.5 rounded-lg border border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880]/15 text-xs font-serif transition-colors"
                >
                  {lang === 'bn' ? 'আনব্লক' : 'Unblock'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
