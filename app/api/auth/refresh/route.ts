import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const cookies = request.headers.get("Cookie");
    const refreshTokenMatch = cookies?.match(/refreshToken=([^;]+)/);
    const refreshToken = refreshTokenMatch?.[1];

    if (!refreshToken) {
      return Response.json(
        { success: false, error: "Token de atualização não fornecido" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return Response.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    // Generate new tokens
    const newTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(newTokenPayload);
    const newRefreshToken = generateRefreshToken(newTokenPayload);

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
        accessToken: newAccessToken,
      },
    });

    // Set new refresh token cookie
    response.headers.set(
      "Set-Cookie",
      `refreshToken=${newRefreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`
    );

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);

    return Response.json(
      { success: false, error: "Token de atualização inválido" },
      { status: 401 }
    );
  }
}
