import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Post, User } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const source = searchParams.get('source');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (language) {
      query.language = language;
    }

    if (source) {
      query.source = source;
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username name avatar')
        .lean(),
      Post.countDocuments(query),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to create a post' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { title, description, code, language, source } = body;

    // Validation
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!code?.trim()) {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    if (!language) {
      return NextResponse.json(
        { error: 'Language is required' },
        { status: 400 }
      );
    }

    // Find the user by their session ID
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const post = await Post.create({
      author: user._id,
      title: title.trim(),
      description: description?.trim() || '',
      code,
      language,
      source: source || 'other',
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username name avatar')
      .lean();

    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
