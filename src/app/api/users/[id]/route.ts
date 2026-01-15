import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Post } from '@/models';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    // Try to find by username first, then by ID
    let user = await User.findOne({ username: id.toLowerCase() }).lean();

    if (!user) {
      user = await User.findById(id).lean();
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's posts
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find({ author: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments({ author: user._id }),
    ]);

    return NextResponse.json({
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
