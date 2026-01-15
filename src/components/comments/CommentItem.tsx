'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, Button } from '@/components/ui';
import CommentForm from './CommentForm';
import { formatDate } from '@/lib/utils';
import { IComment, IUser } from '@/types';

interface CommentWithReplies extends IComment {
  author: IUser;
  replies?: CommentWithReplies[];
}

interface CommentItemProps {
  comment: CommentWithReplies;
  postId: string;
  onReplySuccess?: () => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  postId,
  onReplySuccess,
  depth = 0,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const maxDepth = 2; // Limit nesting depth

  return (
    <div
      className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-zinc-200 dark:border-zinc-700' : ''}`}
    >
      <article className="py-4">
        <div className="flex gap-3">
          <Link
            href={`/profile/${comment.author.username}`}
            className="shrink-0"
            aria-label={`View ${comment.author.name || comment.author.username}'s profile`}
          >
            <Avatar
              src={comment.author.avatar}
              alt={comment.author.name || comment.author.username}
              size="sm"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/profile/${comment.author.username}`}
                className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {comment.author.name || comment.author.username}
              </Link>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                @{comment.author.username}
              </span>
              <time
                dateTime={new Date(comment.createdAt).toISOString()}
                className="text-sm text-zinc-500 dark:text-zinc-400"
              >
                {formatDate(comment.createdAt)}
              </time>
            </div>

            {comment.lineReference && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Line {comment.lineReference}
              </p>
            )}

            <div className="mt-2 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-words">
              {comment.content}
            </div>

            {depth < maxDepth && (
              <div className="mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  aria-expanded={showReplyForm}
                >
                  {showReplyForm ? 'Cancel' : 'Reply'}
                </Button>
              </div>
            )}

            {showReplyForm && (
              <div className="mt-4">
                <CommentForm
                  postId={postId}
                  parentCommentId={comment._id.toString()}
                  placeholder={`Reply to @${comment.author.username}...`}
                  onSuccess={() => {
                    setShowReplyForm(false);
                    onReplySuccess?.();
                  }}
                  onCancel={() => setShowReplyForm(false)}
                />
              </div>
            )}
          </div>
        </div>
      </article>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id.toString()}
              comment={reply}
              postId={postId}
              onReplySuccess={onReplySuccess}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
