import React, { useState, useEffect } from 'react';
import { X, Settings, UserPlus, UserMinus, Check, XCircle, Users } from 'lucide-react';
import { UserProfile, Friendship, FriendRequest, FriendSuggestion } from '../../types';
import { subscribeToFriendRequests, acceptFriendRequest, declineFriendRequest, sendFriendRequest, removeFriend, subscribeToFriends } from '../../services/friends';
import { createNotification } from '../../services/notifications';
import { getBlockedUsers, unblockUser } from '../../services/block';

interface FriendsTabProps {
  isOpen?: boolean;
  user: UserProfile | null;
  lang: 'bn' | 'en';
  onClose: () => void;
}

export const FriendsTab: React.FC<FriendsTabProps> = ({ isOpen, user, lang, onClose }) => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends');

  if (!isOpen) return null;

  useEffect(() => {
    if (!user) return;
    const unsubFriends = subscribeToFriends(user.uid, setFriends);
    const unsubRequests = subscribeToFriendRequests(user.uid, setRequests);
    return () => {
      unsubFriends();
      unsubRequests();
    };
  }, [user?.uid]);

  const handleAcceptRequest = async (request: FriendRequest) => {
    await acceptFriendRequest(request);
    await createNotification({
      id: `notif-${Date.now()}`,
      userId: request.fromUserId,
      type: 'friend_accepted',
      title: lang === 'bn' ? 'বন্ধুত্ব অনুমোদিত!' : 'Friend Request Accepted',
      message: lang === 'bn' ? `${user?.displayName} আপনার বন্ধুত্বের অনুরোধ গৃহীত করেছেন।` : `${user?.displayName} accepted your friend request.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  };

  const handleDeclineRequest = async (requestId: string) => {
    await declineFriendRequest(requestId);
  };

  const handleSendRequest = async (suggestion: FriendSuggestion) => {
    await sendFriendRequest({
      id: `friend-request-${Date.now()}`,
      fromUserId: user?.uid || '',
      fromUserName: user?.displayName || '',
      fromUserAvatar: user?.photoURL || undefined,
      toUserId: suggestion.userId,
      toUserName: suggestion.userName,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    await removeFriend(friendshipId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#1A1512] border border-[#3D322B] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#E8DFD8] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#2C241E] mb-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-2xl text-[#FAF3EB] font-light">
              {lang === 'bn' ? 'বন্ধুত্ব ও সংযোগ' : 'Friends & Connections'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 rounded-xl border text-xs font-serif transition-all ${
              activeTab === 'friends'
                ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB]'
                : 'border-[#382E25] bg-[#120E0C] text-[#8C7A6B]'
            }`}
          >
            {lang === 'bn' ? `বন্ধবৃন্দ (${friends.length})` : `Friends (${friends.length})`}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 rounded-xl border text-xs font-serif transition-all ${
              activeTab === 'requests'
                ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB]'
                : 'border-[#382E25] bg-[#120E0C] text-[#8C7A6B]'
            }`}
          >
            {lang === 'bn' ? `অনুরোধ (${requests.length})` : `Requests (${requests.length})`}
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-2 rounded-xl border text-xs font-serif transition-all ${
              activeTab === 'suggestions'
                ? 'border-[#C5A880] bg-[#C5A880]/15 text-[#FAF3EB]'
                : 'border-[#382E25] bg-[#120E0C] text-[#8C7A6B]'
            }`}
          >
            {lang === 'bn' ? 'পরামর্শ' : 'Suggestions'}
          </button>
        </div>

        {activeTab === 'friends' && (
          <div className="space-y-3">
            {friends.length === 0 ? (
              <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
                <Users className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
                <span>{lang === 'bn' ? 'এখনও কোনো বন্ধু নেই।' : 'No friends yet.'}</span>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-xl bg-[#201915] border border-[#2D231B]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#382B21] overflow-hidden flex items-center justify-center text-xs text-[#FAF3EB]">
                      {friend.friendAvatar && friend.friendAvatar.trim() ? (
                        <img src={friend.friendAvatar} alt={friend.friendName} className="w-full h-full object-cover" />
                      ) : (
                        friend.friendName?.[0] || '?'
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-serif text-[#FAF3EB] font-medium">{friend.friendName}</p>
                      <p className="text-[10px] font-serif text-[#786657]">
                        {lang === 'bn' ? 'চিরকুট সদস্য' : 'Chirkut Member'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    className="p-2 rounded-lg border border-[#382E25] text-[#8C7A6B] hover:text-rose-300 hover:border-rose-800/50 transition-colors"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
                <UserPlus className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
                <span>{lang === 'bn' ? 'কোনো বন্ধুত্বের অনুরোধ নেই।' : 'No pending requests.'}</span>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-xl bg-[#201915] border border-[#2D231B]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#382B21] overflow-hidden flex items-center justify-center text-xs text-[#FAF3EB]">
                      {request.fromUserAvatar && request.fromUserAvatar.trim() ? (
                        <img src={request.fromUserAvatar} alt={request.fromUserName} className="w-full h-full object-cover" />
                      ) : (
                        request.fromUserName?.[0] || '?'
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-serif text-[#FAF3EB] font-medium">{request.fromUserName}</p>
                      <p className="text-[10px] font-serif text-[#786657]">
                        {lang === 'bn' ? 'আপনার সাথে বন্ধুত্বের অনুরোধ জানিয়েছেন' : 'Sent you a friend request'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request)}
                      className="p-2 rounded-lg border border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880]/15 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="p-2 rounded-lg border border-[#382E25] text-[#8C7A6B] hover:text-rose-300 hover:border-rose-800/50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.length === 0 ? (
              <div className="col-span-full text-center py-12 text-xs font-serif text-[#8C7A6B]">
                <Users className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
                <span>{lang === 'bn' ? 'কোনো পরামর্শ পাওয়া যায়নি।' : 'No suggestions right now.'}</span>
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 rounded-xl bg-[#201915] border border-[#2D231B] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#382B21] overflow-hidden flex items-center justify-center text-xs text-[#FAF3EB]">
                      {suggestion.userAvatar && suggestion.userAvatar.trim() ? (
                        <img src={suggestion.userAvatar} alt={suggestion.userName} className="w-full h-full object-cover" />
                      ) : (
                        suggestion.userName?.[0] || '?'
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-serif text-[#FAF3EB] font-medium">{suggestion.userName}</p>
                      <p className="text-[10px] font-serif text-[#786657]">
                        {suggestion.mutualFriends} {lang === 'bn' ? ' Mutual Friends' : ' mutual friends'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSendRequest(suggestion)}
                    className="p-2 rounded-lg border border-[#C5A880]/50 text-[#C5A880] hover:bg-[#C5A880]/15 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
