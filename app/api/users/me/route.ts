import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { User } from "@/lib/types";

export const dynamic = "force-dynamic";

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
        { success: false, error: "Usuário não encontrado" },
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
    console.error("Get user error:", error);

    return Response.json(
      { success: false, error: "Falha ao buscar dados de usuário" },
      { status: 500 }
    );
  }
});

export const PATCH = withAuth(async (request: NextRequest, user: User) => {
  try {
    const body = await request.json();

    // Get current user data to determine profile type
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        patientProfile: true,
        doctorProfile: true,
      },
    });

    if (!currentUser) {
      return Response.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Update user name if provided
    const updateData: any = {};
    if (body.name) {
      updateData.name = body.name;
    }

    // Update user basic info
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Handle profile updates based on user role
    if (currentUser.role === "PATIENT") {
      const profileData = {
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        sex: body.sex || undefined,
        country: body.country || undefined,
        state: body.state || undefined,
        city: body.city || undefined,
        diagnosisDate: body.diagnosisDate
          ? new Date(body.diagnosisDate)
          : undefined,
      };

      // Remove undefined values
      Object.keys(profileData).forEach((key) => {
        if ((profileData as any)[key] === undefined) {
          delete (profileData as any)[key];
        }
      });

      if (currentUser.patientProfile) {
        // Update existing profile
        await prisma.patientProfile.update({
          where: { userId: user.id },
          data: profileData,
        });
      } else {
        // Create new profile
        await prisma.patientProfile.create({
          data: {
            userId: user.id,
            ...profileData,
          },
        });
      }
    } else if (currentUser.role === "DOCTOR") {
      const profileData = {
        licenseNumber: body.licenseNumber || undefined,
        specialty: body.specialty || undefined,
        country: body.country || undefined,
        state: body.state || undefined,
        city: body.city || undefined,
      };

      // Remove undefined values
      Object.keys(profileData).forEach((key) => {
        if ((profileData as any)[key] === undefined) {
          delete (profileData as any)[key];
        }
      });

      if (currentUser.doctorProfile) {
        // Update existing profile
        await prisma.doctorProfile.update({
          where: { userId: user.id },
          data: profileData,
        });
      } else {
        // Create new profile
        await prisma.doctorProfile.create({
          data: {
            userId: user.id,
            ...profileData,
          },
        });
      }
    }

    return Response.json({
      success: true,
      message: "Perfil atualizado com sucesso",
    });
  } catch (error) {
    console.error("Update user error:", error);

    return Response.json(
      { success: false, error: "Falha ao atualizar perfil" },
      { status: 500 }
    );
  }
});
