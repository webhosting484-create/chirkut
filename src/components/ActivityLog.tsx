import React, { useState, useEffect } from 'react';
import { X, FileText, Heart, MessageCircle, UserPlus, UserMinus, Settings as SettingsIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface ActivityLogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  lang: 'bn' | 'en';
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ isOpen, onClose, userId, lang }) => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    // Load mock activity data - in production this would come from Firestore
    setActivities([
      {
        id: '1',
        type: 'note_created',
        message: lang === 'bn' ? 'আপনি একটি নতুন চিরকুট পিন করেছেন' : 'You pinned a new note',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'friend_added',
        message: lang === 'bn' ? 'আপনি নতুন একজন বন্ধু যোগ করেছেন' : 'You added a new friend',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        type: 'comment',
        message: lang === 'bn' ? 'আপনি একটি চিরকুটে মন্তব্য করেছেন' : 'You commented on a note',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
    ]);
  }, [isOpen, userId, lang]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note_created': return <FileText className="w-4 h-4 text-[#C5A880]" />;
      case 'friend_added': return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'friend_removed': return <UserMinus className="w-4 h-4 text-rose-400" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'like': return <Heart className="w-4 h-4 text-rose-400" />;
      case 'settings': return <SettingsIcon className="w-4 h-4 text-[#A39282]" />;
      default: return <FileText className="w-4 h-4 text-[#8C7A6B]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#1A1512] border border-[#3D322B] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#E8DFD8] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#2C241E] mb-5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-serif text-2xl text-[#FAF3EB] font-light">
              {lang === 'bn' ? 'কার্যক্রম লগ' : 'Activity Log'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8C7A6B] hover:text-[#FAF3EB]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-xs font-serif text-[#8C7A6B]">
              <FileText className="w-8 h-8 mx-auto mb-2 text-[#C5A880]/50" />
              <span>{lang === 'bn' ? 'কোনো কার্যক্রম নেই।' : 'No activity yet.'}</span>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#201915] border border-[#2D231B]">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-serif text-[#FAF3EB]">{activity.message}</p>
                  <p className="text-[10px] font-serif text-[#786657] mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
