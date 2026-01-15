'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Button, Card, CardContent } from '@/components/ui';

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Card>
        <CardContent className="space-y-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-blue-600"
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
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome to Debug
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Sign in to share code and join the discussion
            </p>
          </div>

          {error && (
            <div
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-red-800 dark:text-red-200 text-center">
                {error === 'OAuthSignin'
                  ? 'Error starting GitHub sign in'
                  : error === 'OAuthCallback'
                  ? 'Error during GitHub callback'
                  : error === 'OAuthAccountNotLinked'
                  ? 'Account already exists with different provider'
                  : 'An error occurred during sign in'}
              </p>
            </div>
          )}

          <Button
            onClick={() => signIn('github', { callbackUrl })}
            className="w-full"
            size="lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </Button>

          <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
            By signing in, you agree to share your public GitHub profile
            information with Debug.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl h-96" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
