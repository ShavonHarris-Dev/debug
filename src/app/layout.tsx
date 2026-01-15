import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import { Header, Footer } from '@/components/layout';
import { SkipLink } from '@/components/ui';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Debug - Code Review Social Platform',
  description:
    'A social platform where developers share code snippets for review and discussion. Strengthen your debugging and code review skills.',
  keywords: ['code review', 'debugging', 'developer tools', 'programming', 'learning'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <SkipLink />
          <Header />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
