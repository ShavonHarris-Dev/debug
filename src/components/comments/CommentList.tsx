'use client';

import CommentItem from './CommentItem';
import { IComment, IUser } from '@/types';

interface CommentWithReplies extends IComment {
  author: IUser;
  replies?: CommentWithReplies[];
}

interface CommentListProps {
  comments: CommentWithReplies[];
  postId: string;
  onReplySuccess?: () => void;
}

export default function CommentList({
  comments,
  postId,
  onReplySuccess,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          No comments yet. Start the discussion!
        </p>
      </div>
    );
  }

  return (
    <div
      className="divide-y divide-zinc-200 dark:divide-zinc-800"
      role="list"
      aria-label="Comments"
    >
      {comments.map((comment) => (
        <CommentItem
          key={comment._id.toString()}
          comment={comment}
          postId={postId}
          onReplySuccess={onReplySuccess}
        />
      ))}
    </div>
  );
}
