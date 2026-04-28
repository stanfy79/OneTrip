import React from 'react';
import { User, MessageSquare } from 'lucide-react';

const CommentList = ({ comments }) => {
  // If no comments exist yet
  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <MessageSquare size={40} className="mb-2 opacity-20" />
        <p className="text-sm">No feedback yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pt-4">
      <h4 className="px-1 text-sm font-bold text-slate-400">
        Comments ({comments.length})
      </h4>
      
      {comments.toReversed().map((comment) => (
        <div 
          key={comment._id} 
          className="flex gap-3 bg-slate-900 p-4 shadow-sm border-slate-100 transition hover:bg-slate-900/60 min-h-25"
        >
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
            {comment.profileUrl ? (
              <img 
                src={comment.profileUrl} 
                alt={comment.username} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-700">
                <User size={20} />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200">
                {comment.username}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                Date Commented:
                {' ' + new Date(comment.createdAt).toLocaleDateString(undefined, {
                   hour: '2-digit', 
                   minute: '2-digit'
                })}
              </span>
            </div>
            
            <p className="mt-1 text-sm leading-relaxed text-slate-300 max-w-130">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;