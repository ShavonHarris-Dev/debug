'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, Avatar, Button } from '@/components/ui';
import { CodeEditor } from '@/components/editor';
import { formatDate } from '@/lib/utils';
import { IPost, IUser, CODE_SOURCES, SUPPORTED_LANGUAGES, SupportedLanguage } from '@/types';

interface PostDetailProps {
  post: IPost & { author: IUser };
}

export default function PostDetail({ post }: PostDetailProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = session?.user?.id === post.author._id.toString();
  const sourceInfo = CODE_SOURCES.find((s) => s.value === post.source);
  const languageLabel =
    SUPPORTED_LANGUAGES.find((l) => l.value === post.language)?.label || post.language;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      router.push('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card as="article">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${post.author.username}`}
              className="shrink-0"
              aria-label={`View ${post.author.name || post.author.username}'s profile`}
            >
              <Avatar
                src={post.author.avatar}
                alt={post.author.name || post.author.username}
                size="lg"
              />
            </Link>
            <div>
              <Link
                href={`/profile/${post.author.username}`}
                className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {post.author.name || post.author.username}
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                @{post.author.username}
              </p>
              <time
                dateTime={new Date(post.createdAt).toISOString()}
                className="text-sm text-zinc-500 dark:text-zinc-400"
              >
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>

          {isOwner && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
              {post.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {languageLabel}
          </span>
          {sourceInfo && (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
              title={sourceInfo.description}
            >
              {sourceInfo.label}
            </span>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Code
          </h2>
          <CodeEditor
            value={post.code}
            language={post.language as SupportedLanguage}
            readOnly
            height={Math.min(Math.max(post.code.split('\n').length * 20, 200), 600)}
            label={`Code snippet: ${post.title}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
