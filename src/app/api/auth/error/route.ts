import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');

  // Log the error details
  console.error('Auth Error:', {
    error,
    url: request.url,
    headers: Object.fromEntries(request.headers),
    timestamp: new Date().toISOString(),
  });

  // Redirect to login with error
  const loginUrl = new URL('/login', request.url);
  if (error) {
    loginUrl.searchParams.set('error', error);
  }

  return NextResponse.redirect(loginUrl);
}
