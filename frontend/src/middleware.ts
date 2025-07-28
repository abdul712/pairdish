import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Redirect old URL pattern to new pattern
  if (url.pathname.startsWith('/what-to-serve-with/')) {
    const slug = url.pathname.replace('/what-to-serve-with/', '');
    url.pathname = `/dishes/${slug}/pairings`;
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/what-to-serve-with/:path*',
};