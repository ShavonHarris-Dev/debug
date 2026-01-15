'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button, Textarea, Avatar } from '@/components/ui';

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  lineReference?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function CommentForm({
  postId,
  parentCommentId,
  lineReference,
  onSuccess,
  onCancel,
  placeholder = "Share your thoughts on this code...",
}: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-center">
        <p className="text-zinc-600 dark:text-zinc-400 mb-2">
          Sign in to join the discussion
        </p>
        <Link href={`/login?callbackUrl=/post/${postId}`}>
          <Button size="sm">Sign In with GitHub</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          lineReference,
          parentCommentId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to post comment');
      }

      setContent('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          role="alert"
        >
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Avatar
          src={session.user.image}
          alt={session.user.name || session.user.username}
          size="sm"
          className="shrink-0 mt-1"
        />
        <div className="flex-1">
          <Textarea
            label={parentCommentId ? 'Reply' : 'Comment'}
            hideLabel
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px]"
          />
          {lineReference && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Commenting on line {lineReference}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          isLoading={isSubmitting}
          disabled={!content.trim()}
        >
          {parentCommentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}
