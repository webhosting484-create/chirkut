import React, { useState } from 'react';
import { X, Send, MessageCircle, User, Sparkles } from 'lucide-react';
import { ChirkutNote, ChirkutComment, UserProfile } from '../types';

interface PostCommentsDrawerProps {
  note: ChirkutNote | null;
  comments: ChirkutComment[];
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onAddComment: (chirkutId: string, text: string) => void;
  onOpenAuthorProfile?: (author: { name: string; id?: string; avatar?: string }) => void;
  lang: 'bn' | 'en';
}

export const PostCommentsDrawer: React.FC<PostCommentsDrawerProps> = ({
  note,
  comments,
  isOpen,
  onClose,
  user,
  onAddComment,
  onOpenAuthorProfile,
  lang,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !note) return null;

  const noteComments = comments.filter((c) => c.chirkutId === note.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(note.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md h-full bg-[#181310] border-l border-[#3D3228] p-6 shadow-2xl flex flex-col justify-between text-[#E8DFD8]">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#2C231B] mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#C5A880]" />
              <h3 className="font-serif text-lg text-[#FAF3EB]">
                {lang === 'bn' ? 'মন্তব্য ও প্রতিক্রিয়া' : 'Comments & Thoughts'} ({noteComments.length})
              </h3>
            </div>
            <button onClick={onClose} className="p-1 text-[#8C7A6B] hover:text-[#FAF3EB]">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mini Note Preview */}
          <div className="p-3.5 rounded-lg bg-[#201915] border border-[#33271F] mb-4">
            <p className="font-handwriting text-xl text-[#FAF3EB] line-clamp-2">
              "{lang === 'bn' ? note.quoteBn || note.quote : note.quote}"
            </p>
            <span className="text-[10px] font-serif text-[#A05D46] mt-1 block">
              — {note.author}
            </span>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 my-2">
          {noteComments.length === 0 ? (
            <div className="text-center py-16 text-xs font-serif text-[#8C7A6B]">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-[#C5A880]/50" />
              <span>
                {lang === 'bn'
                  ? 'এই চিরকুটে এখনও কোনো মন্তব্য আসেনি। প্রথম অনুভূতি প্রকাশ করুন!'
                  : 'No comments yet. Share your reflection!'}
              </span>
            </div>
          ) : (
            noteComments.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-[#201915] border border-[#2D231B]">
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    onClick={() => {
                      if (onOpenAuthorProfile) {
                        onClose();
                        onOpenAuthorProfile({
                          name: c.authorName,
                          id: c.authorId,
                          avatar: c.authorAvatar,
                        });
                      }
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-100 group"
                    title={lang === 'bn' ? `${c.authorName}-এর প্রোফাইল দেখুন` : `View ${c.authorName}'s profile`}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#382B21] overflow-hidden flex items-center justify-center text-[10px] text-[#FAF3EB] group-hover:scale-110 transition-transform">
                      {c.authorAvatar && c.authorAvatar.trim() ? (
                        <img src={c.authorAvatar} alt={c.authorName || 'User'} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        (c.authorName && typeof c.authorName === 'string' && c.authorName.length > 0 ? c.authorName[0] : 'ম')
                      )}
                    </div>
                    <span className="text-xs font-serif text-[#FAF3EB] font-medium group-hover:text-[#C5A880] transition-colors">
                      {c.authorName || (lang === 'bn' ? 'অজ্ঞাত মন্তব্যকারী' : 'Anonymous')}
                    </span>
                  </div>
                  <span className="text-[10px] font-serif text-[#786657]">
                    {c.createdAt}
                  </span>
                </div>
                <p className="text-xs font-serif text-[#C8BCB0] pl-8 leading-relaxed">
                  {c.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-[#2C231B]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                lang === 'bn'
                  ? 'আপনার অনুভূতি লিখুন...'
                  : 'Write your reflection...'
              }
              className="flex-1 px-4 py-2.5 bg-[#120E0C] border border-[#382E25] focus:border-[#C5A880] rounded-xl text-xs font-serif text-[#FAF3EB] placeholder-[#635345] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2.5 rounded-xl bg-[#C5A880] text-[#14100E] hover:bg-[#D4AF37] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
