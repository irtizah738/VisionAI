import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n';

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

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle i18n routing first
  const response = intlMiddleware(request);
  if (response) return response;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Rest of your existing middleware code...
  // ... existing code ...
}

export const config = {
  matcher: [
    // Add i18n matcher patterns
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Your existing patterns
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 