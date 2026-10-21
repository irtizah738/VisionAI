import { NextResponse } from "next/server";
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = [
  '/login',
  '/signup',
  '/auth',
  '/api/auth',
  '/',
  '/studios',
  '/trust',
  '/about',
  '/contact',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and public paths
  if (
    publicPaths.some(path => pathname === path || pathname.startsWith(path + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow web routes and API routes to execute smoothly
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
