import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import { Post } from '@/models';
import { PostDetail } from '@/components/post';
import { CommentSection } from '@/components/comments';
import { IPost, IUser } from '@/types';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string) {
  await connectDB();
  const post = await Post.findById(id)
    .populate('author', 'username name avatar bio')
    .lean();
  return post;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return { title: 'Post Not Found - Debug' };
  }

  const typedPost = post as unknown as IPost & { author: IUser };
  return {
    title: `${typedPost.title} - Debug`,
    description: typedPost.description || `Code shared by @${typedPost.author.username}`,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const typedPost = post as unknown as IPost & { author: IUser };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PostDetail post={typedPost} />
      <CommentSection postId={id} />
    </div>
  );
}
