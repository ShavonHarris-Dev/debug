'use client';

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export default function SkipLink({
  href = '#main-content',
  children = 'Skip to main content',
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {children}
    </a>
  );
}
