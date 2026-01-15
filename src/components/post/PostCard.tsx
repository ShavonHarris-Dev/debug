'use client';

import Link from 'next/link';
import { Card, CardContent, Avatar } from '@/components/ui';
import { formatDate, truncate } from '@/lib/utils';
import { IPost, IUser, CODE_SOURCES, SUPPORTED_LANGUAGES } from '@/types';

interface PostCardProps {
  post: IPost & { author: IUser };
}

export default function PostCard({ post }: PostCardProps) {
  const sourceLabel = CODE_SOURCES.find((s) => s.value === post.source)?.label || 'Other';
  const languageLabel =
    SUPPORTED_LANGUAGES.find((l) => l.value === post.language)?.label || post.language;

  return (
    <Card as="article" className="hover:shadow-md transition-shadow">
      <CardContent className="space-y-4">
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
                size="md"
              />
            </Link>
            <div className="min-w-0">
              <Link
                href={`/profile/${post.author.username}`}
                className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {post.author.name || post.author.username}
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                @{post.author.username}
              </p>
            </div>
          </div>
          <time
            dateTime={new Date(post.createdAt).toISOString()}
            className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0"
          >
            {formatDate(post.createdAt)}
          </time>
        </div>

        <div>
          <Link
            href={`/post/${post._id}`}
            className="block group"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
          </Link>
          {post.description && (
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {truncate(post.description, 200)}
            </p>
          )}
        </div>

        <div className="bg-zinc-900 dark:bg-zinc-950 rounded-lg p-4 overflow-hidden">
          <pre className="text-sm text-zinc-300 overflow-x-auto code-scrollbar">
            <code>{truncate(post.code, 300)}</code>
          </pre>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {languageLabel}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            {sourceLabel}
          </span>
        </div>

        <Link
          href={`/post/${post._id}`}
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          View discussion
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </CardContent>
    </Card>
  );
}
