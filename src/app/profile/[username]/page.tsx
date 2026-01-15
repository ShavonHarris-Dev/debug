import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import { User, Post } from '@/models';
import { Avatar, Card, CardContent } from '@/components/ui';
import { PostCard } from '@/components/post';
import { formatDate } from '@/lib/utils';
import { IUser, IPost } from '@/types';

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

async function getUserWithPosts(username: string) {
  await connectDB();

  const user = await User.findOne({ username: username.toLowerCase() }).lean();

  if (!user) {
    return null;
  }

  const typedUser = user as unknown as IUser;

  const posts = await Post.find({ author: typedUser._id })
    .sort({ createdAt: -1 })
    .populate('author', 'username name avatar')
    .lean();

  return {
    user: typedUser,
    posts: posts as unknown as (IPost & { author: IUser })[],
  };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { username } = await params;
  const data = await getUserWithPosts(username);

  if (!data) {
    return { title: 'User Not Found - Debug' };
  }

  return {
    title: `${data.user.name || data.user.username} (@${data.user.username}) - Debug`,
    description: data.user.bio || `Code posts by @${data.user.username}`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const data = await getUserWithPosts(username);

  if (!data) {
    notFound();
  }

  const { user, posts } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar
              src={user.avatar}
              alt={user.name || user.username}
              size="xl"
            />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {user.name || user.username}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                @{user.username}
              </p>

              {user.bio && (
                <p className="mt-3 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {user.bio}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400 justify-center sm:justify-start">
                <span>
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
                <span>
                  Joined {formatDate(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="posts-heading">
        <h2
          id="posts-heading"
          className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4"
        >
          Posts
        </h2>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400">
                No posts yet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4" role="feed" aria-label="User's posts">
            {posts.map((post) => (
              <PostCard key={post._id.toString()} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
