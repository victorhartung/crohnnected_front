
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { User } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const GET = withAuth(async (request: NextRequest, user: User) => {
  try {
    // Get detailed user information including profile
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        patientProfile: {
          select: {
            id: true,
            birthDate: true,
            sex: true,
            country: true,
            state: true,
            city: true,
            lat: true,
            lng: true,
            diagnosisDate: true,
          },
        },
        doctorProfile: {
          select: {
            id: true,
            licenseNumber: true,
            specialty: true,
            country: true,
            state: true,
            city: true,
          },
        },
      },
    });

    if (!userData) {
      return Response.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: {
        user: userData,
      },
    });

  } catch (error) {
    console.error('Get user error:', error);

    return Response.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
});
