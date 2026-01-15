import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { PostForm } from '@/components/post';

export const metadata = {
  title: 'Share Code - Debug',
  description: 'Share a code snippet for review and discussion',
};

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/post/new');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Share Code for Review
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Post code you want to discuss, understand better, or get feedback on
          </p>
        </CardHeader>
        <CardContent>
          <PostForm />
        </CardContent>
      </Card>
    </div>
  );
}
