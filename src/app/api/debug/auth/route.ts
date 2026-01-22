import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envVars: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID ? 'SET' : 'MISSING',
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ? 'SET' : 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
    },
    mongodb: {
      status: 'checking',
      error: null as string | null,
    },
  };

  // Test MongoDB connection
  try {
    await connectDB();
    checks.mongodb.status = 'connected';
  } catch (error) {
    checks.mongodb.status = 'failed';
    checks.mongodb.error = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(checks);
}
