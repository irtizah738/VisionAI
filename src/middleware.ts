import createMiddleware from 'next-intl/middleware';
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add paths that don't require authentication
const publicPaths = [
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth',
  '/',
  '/about',
  '/contact',
];

// Add paths that require specific roles
const roleProtectedPaths = {
  '/admin': ['ADMIN'],
  '/manager': ['ADMIN', 'MANAGER'],
};

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'es', 'fr', 'de', 'ar'],
  
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: 'en',
  
  // Paths that don't require locale prefix
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle internationalization first
  const response = await intlMiddleware(request);

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return response;
  }

  // Handle API routes
  if (pathname.startsWith('/api')) {
    // Skip auth routes
    if (pathname.startsWith('/api/auth')) {
      return response;
    }

    // Check for API key in header
    const apiKey = request.headers.get('x-api-key');
    if (apiKey) {
      try {
        const validApiKey = await prisma.apiKey.findFirst({
          where: {
            key: apiKey,
            enabled: true,
          },
          include: {
            user: true,
          },
        });

        if (validApiKey) {
          // Update last used timestamp
          await prisma.apiKey.update({
            where: { id: validApiKey.id },
            data: { lastUsed: new Date() },
          });

          // Add user info to request headers
          const requestHeaders = new Headers(response.headers);
          requestHeaders.set('x-user-id', validApiKey.userId);
          requestHeaders.set('x-user-role', validApiKey.user.role);

          return NextResponse.next({
            headers: requestHeaders,
          });
        }
      } catch (error) {
        console.error('API key validation error:', error);
      }

      return new NextResponse(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  // Check session token for web routes
  const token = await getToken({ req: request });

  if (!token) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Check role-based access
  const userRole = token.role as string;
  for (const [path, roles] of Object.entries(roleProtectedPaths)) {
    if (pathname.startsWith(path) && !roles.includes(userRole)) {
      return new NextResponse(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 