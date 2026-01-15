'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { PostCard } from '@/components/post';
import { Button } from '@/components/ui';
import FeedFilters from './FeedFilters';
import { IPost, IUser } from '@/types';

interface FeedResponse {
  posts: (IPost & { author: IUser })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Feed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<(IPost & { author: IUser })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [language, setLanguage] = useState('');
  const [source, setSource] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPosts = useCallback(async (pageNum: number, reset = false) => {
    setIsLoading(true);
    setError(null);
    setHasFetched(true);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
      });

      if (language) params.set('language', language);
      if (source) params.set('source', source);

      const response = await fetch(`/api/posts?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data: FeedResponse = await response.json();

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setHasMore(pageNum < data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [language, source]);

  const handleFilterChange = (newLanguage: string, newSource: string) => {
    setLanguage(newLanguage);
    setSource(newSource);
    if (hasFetched) {
      setPage(1);
      fetchPosts(1, true);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  // Show welcome state before any fetch
  if (!hasFetched) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto">
            <svg
              className="w-16 h-16 mx-auto text-blue-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Welcome to Debug
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              A place to share code, discuss approaches, and strengthen your code review skills.
              Whether it&apos;s AI-generated code, work from a colleague, or your own creation -
              share it and learn together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => fetchPosts(1, true)}>
                Browse Code Posts
              </Button>
              {session ? (
                <Link href="/post/new">
                  <Button variant="secondary">Share Your Code</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="secondary">Sign In to Share</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FeedFilters
        language={language}
        source={source}
        onLanguageChange={(val) => handleFilterChange(val, source)}
        onSourceChange={(val) => handleFilterChange(language, val)}
      />

      {error && (
        <div
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          role="alert"
        >
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchPosts(1, true)}
            className="mt-2"
          >
            Try again
          </Button>
        </div>
      )}

      <div
        className="space-y-4"
        role="feed"
        aria-busy={isLoading}
        aria-label="Code posts feed"
      >
        {posts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">
              No posts yet. Be the first to share some code!
            </p>
            {session && (
              <Link href="/post/new" className="inline-block mt-4">
                <Button>Share Code</Button>
              </Link>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id.toString()} post={post} />
          ))
        )}

        {isLoading && (
          <div className="space-y-4" aria-label="Loading posts">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                </div>
                <div className="w-3/4 h-6 bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
                <div className="w-full h-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        )}

        {hasMore && !isLoading && posts.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button variant="secondary" onClick={loadMore}>
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
