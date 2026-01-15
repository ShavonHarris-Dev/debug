import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Comment, Post, User } from '@/models';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    // Verify post exists
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const comments = await Comment.find({ post: post._id })
      .sort({ createdAt: 1 })
      .populate('author', 'username name avatar')
      .populate('parentComment')
      .lean();

    // Organize comments into threads
    const rootComments = comments.filter((c) => !c.parentComment);
    const replies = comments.filter((c) => c.parentComment);

    // Attach replies to their parent comments
    const threaded = rootComments.map((comment) => ({
      ...comment,
      replies: replies.filter(
        (r) => r.parentComment?._id?.toString() === comment._id.toString()
      ),
    }));

    return NextResponse.json(threaded);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to comment' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    // Verify post exists
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content, lineReference, parentCommentId } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If replying to a comment, verify it exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    const comment = await Comment.create({
      post: post._id,
      author: user._id,
      content: content.trim(),
      lineReference: lineReference || null,
      parentComment: parentCommentId || null,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username name avatar')
      .lean();

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
