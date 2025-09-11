
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, generateAccessToken, generateRefreshToken, checkRateLimit, getRateLimitKey } from '@/lib/auth';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for login attempts
    const rateLimitKey = getRateLimitKey(request, 'login');
    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return Response.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Create response
    const response = Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
      },
    });

    // Set refresh token cookie
    response.headers.set('Set-Cookie', 
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;

  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof ZodError) {
      return Response.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
