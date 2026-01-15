import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Post, Comment } from '@/models';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;
    const post = await Post.findById(id)
      .populate('author', 'username name avatar bio')
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to delete a post' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if the user owns this post
    if (post.author.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 }
      );
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: id });

    // Delete the post
    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
