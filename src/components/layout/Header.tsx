'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, Button } from '@/components/ui';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span>Debug</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4" aria-label="Main navigation">
              <Link
                href="/"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Feed
              </Link>
              {session && (
                <Link
                  href="/post/new"
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Share Code
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${session.user.username}`}
                  className="flex items-center gap-2 group"
                >
                  <Avatar
                    src={session.user.image}
                    alt={session.user.name || session.user.username}
                    size="sm"
                  />
                  <span className="hidden sm:block text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                    {session.user.username}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  aria-label="Sign out"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">Sign In with GitHub</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
