import {
  checkRateLimit,
  generateAccessToken,
  generateRefreshToken,
  getRateLimitKey,
  hashPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validation";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for registration attempts
    const rateLimitKey = getRateLimitKey(request, "register");
    if (!checkRateLimit(rateLimitKey, 3, 15 * 60 * 1000)) {
      // 3 attempts per 15 minutes
      return Response.json(
        {
          success: false,
          error:
            "Muitas tentativas de registro. Por favor, tente novamente mais tarde.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = registerSchema(() => "").parse(body);
    const { email, password, name, role } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return Response.json(
        { success: false, error: "Usuário já existe com esse email" },
        { status: 409 }
      );
    }
    // Determinar roles
    let assignedRole: UserRole = UserRole.PATIENT; // Default role

    if (role && role !== UserRole.PATIENT) {
      const userCount = await prisma.user.count();

      if (userCount === 0 && role === UserRole.ADMIN) {
        assignedRole = UserRole.ADMIN;
      } else if (role === UserRole.RESEARCHER) {
        assignedRole = UserRole.RESEARCHER;
      } else {
        assignedRole = UserRole.PATIENT;
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and profile
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          role: assignedRole,
          name,
        },
      });

      // Create appropriate profile based on role
      if (assignedRole === UserRole.PATIENT) {
        await tx.patientProfile.create({
          data: {
            userId: newUser.id,
          },
        });
      }

      return newUser;
    });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Create response with refresh token in httpOnly cookie
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
    response.headers.set(
      "Set-Cookie",
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`
    );

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Falha ao realizar registro. Por favor, tente novamente.",
      },
      { status: 500 }
    );
  }
}
