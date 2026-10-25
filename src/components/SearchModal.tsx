import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, MessageCircle, Heart, FileText } from 'lucide-react';
import { UserProfile } from '../types';
import { searchUsers, getAllUsers } from '../services/settings';
import { sendFriendRequest } from '../services/friends';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  lang: 'bn' | 'en';
  onViewProfile: (profile: { name: string; id?: string; avatar?: string }) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, user, lang, onViewProfile }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const users = await searchUsers(searchQuery);
      setResults(users.filter((u) => u.uid !== user?.uid));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (targetUser: UserProfile) => {
    if (!user) return;
    await sendFriendRequest({
      id: `friend-request-${Date.now()}`,
      fromUserId: user.uid,
      fromUserName: user.displayName || '',
      fromUserAvatar: user.photoURL || undefined,
      toUserId: targetUser.uid,
      toUserName: targetUser.displayName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#1A1512] border border-[#3D322B] rounded-2xl shadow-2xl text-[#E8DFD8] max-h-[70vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#2C241E]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-[#FAF3EB] font-light">
              {lang === 'bn' ? 'অনুসন্ধান' : 'Search People'}
            </h3>
            <button onClick={onClose} className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={lang === 'bn' ? 'নাম বা ইমেইল দিয়ে খুঁজুন...' : 'Search by name or email...'}
              className="w-full pl-10 pr-4 py-3 bg-[#130F0D] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-sm font-serif text-[#FAF3EB] placeholder-[#69584B] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
              {lang === 'bn' ? 'খুঁজছি...' : 'Searching...'}
            </div>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
              <Search className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
              <span>{lang === 'bn' ? 'কোনো ব্যবহারকারী পাওয়া যায়নি।' : 'No users found.'}</span>
            </div>
          )}
          {!loading && results.length === 0 && query.length < 2 && (
            <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
              <Search className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
              <span>{lang === 'bn' ? 'অনুসন্ধান শুরু করতে কমপক্ষে ২ অক্ষর লিখুন।' : 'Type at least 2 characters to search.'}</span>
            </div>
          )}
          <div className="space-y-3">
            {results.map((u) => (
              <div key={u.uid} className="flex items-center justify-between p-3 rounded-xl bg-[#201915] border border-[#2D231B]">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => onViewProfile({ name: u.displayName || 'User', id: u.uid, avatar: u.photoURL || undefined })}
                >
                  <div className="w-10 h-10 rounded-full bg-[#382B21] overflow-hidden flex items-center justify-center text-xs text-[#FAF3EB]">
                    {u.photoURL && u.photoURL.trim() ? (
                      <img src={u.photoURL} alt={u.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      (u.displayName && u.displayName.length > 0 ? u.displayName[0] : '?')
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-serif text-[#FAF3EB] font-medium">{u.displayName}</p>
                    <p className="text-[10px] font-serif text-[#786657]">{u.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendRequest(u)}
                  className="px-3 py-1.5 rounded-lg border border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880]/15 text-xs font-serif transition-colors"
                >
                  {lang === 'bn' ? 'অনুরোধ' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
