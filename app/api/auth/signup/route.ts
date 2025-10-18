import { NextRequest } from "next/server";

// Alias for the register endpoint - redirect to register
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Forward the request to the register endpoint
    const response = await fetch(
      `${request.nextUrl.origin}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Signup alias error:", error);
    return Response.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
