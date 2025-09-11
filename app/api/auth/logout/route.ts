
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = Response.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear refresh token cookie
    response.headers.set('Set-Cookie', 
      'refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
    );

    return response;

  } catch (error) {
    console.error('Logout error:', error);

    return Response.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}
