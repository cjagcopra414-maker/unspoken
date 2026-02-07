
import React, { useState } from 'react';
import { Confession, Comment } from '../types';
import { Heart, Music, BookOpen, User, Share2, MessageCircle, Send } from 'lucide-react';

interface Props {
  confession: Confession;
  onAddComment: (confessionId: string, commentText: string) => void;
}

export const ConfessionCard: React.FC<Props> = ({ confession, onAddComment }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(confession.likes);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleLike = () => {
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
  };

  const handleShare = () => {
    const inboxUrl = `${window.location.origin}${window.location.pathname}?inbox=${confession.id}`;
    navigator.clipboard.writeText(inboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitComment = () => {
    if (!commentInput.trim()) return;
    onAddComment(confession.id, commentInput);
    setCommentInput('');
  };

  const Icon = confession.type === 'music' ? Music : BookOpen;
  const accentColor = confession.type === 'music' ? 'text-[#a78bfa]' : 'text-[#fbbf24]';

  return (
    <div className="masonry-item group">
      <div className="minimal-card rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-md">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
              <User size={10} />
              <span>To: {confession.to}</span>
            </div>
            <span className="text-[10px] text-secondary font-medium">
              {new Date(confession.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-surfaceHover rounded-2xl p-4 border border-border italic text-[13px] text-primary leading-relaxed relative">
              <span className="absolute -top-2 -left-1 text-4xl text-secondary/10 font-serif select-none">“</span>
              {confession.dedicatedLines}
            </div>
            <div className={`flex items-center space-x-2 text-[11px] font-bold ${accentColor} uppercase tracking-wider`}>
              <Icon size={12} strokeWidth={2.5} />
              <span>{confession.sourceTitle} · {confession.sourceSub}</span>
            </div>
          </div>

          <p className="text-[14px] text-secondary leading-relaxed font-medium">
            {confession.message}
          </p>

          <div className="pt-4 flex items-center justify-between border-t border-border">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLike}
                className={`flex items-center space-x-2 transition-all duration-300 ${liked ? 'text-rose-500 scale-110' : 'text-secondary hover:text-primary'}`}
              >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} strokeWidth={2.5} />
                <span className="text-xs font-bold">{likesCount}</span>
              </button>
              <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center space-x-2 transition-all duration-300 ${showComments ? 'text-primary' : 'text-secondary hover:text-primary'}`}
              >
                <MessageCircle size={18} strokeWidth={2.5} />
                <span className="text-xs font-bold">{confession.comments.length}</span>
              </button>
            </div>
            <button 
              onClick={handleShare}
              className={`flex items-center space-x-2 transition-all duration-300 ${copied ? 'text-green-500' : 'text-secondary hover:text-primary'}`}
            >
              <Share2 size={18} strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          {showComments && (
            <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                {confession.comments.map(comment => (
                  <div key={comment.id} className="bg-surfaceHover rounded-xl p-3 border border-border">
                    <p className="text-[12px] text-primary">{comment.text}</p>
                    <span className="text-[9px] text-secondary mt-1 block">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Leave a comment..."
                  className="w-full bg-surfaceHover border border-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-secondary transition-all pr-10 text-primary placeholder:text-secondary/50"
                />
                <button 
                  onClick={submitComment}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
