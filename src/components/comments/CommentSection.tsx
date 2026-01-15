'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { IComment, IUser } from '@/types';

interface CommentWithReplies extends IComment {
  author: IUser;
  replies?: CommentWithReplies[];
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSuccess = () => {
    fetchComments();
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Discussion
          {!isLoading && comments.length > 0 && (
            <span className="ml-2 text-base font-normal text-zinc-500 dark:text-zinc-400">
              ({comments.length} {comments.length === 1 ? 'comment' : 'comments'})
            </span>
          )}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Talk through the code, share insights, or ask questions
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <CommentForm postId={postId} onSuccess={handleCommentSuccess} />

        {error && (
          <div
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            role="alert"
          >
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4 py-4" aria-label="Loading comments">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="w-full h-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CommentList
            comments={comments}
            postId={postId}
            onReplySuccess={handleCommentSuccess}
          />
        )}
      </CardContent>
    </Card>
  );
}
