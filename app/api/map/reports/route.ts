import { prisma } from "@/lib/db";
import { mapQuerySchema } from "@/lib/validation";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

// GET map reports data (GeoJSON format)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Validate query parameters
    const query = mapQuerySchema.parse(queryParams);

    let where: any = {
      // Only include reports with valid coordinates
      lat: { not: null },
      lng: { not: null },
    };

    // Apply filters
    if (query.country)
      where.country = { contains: query.country, mode: "insensitive" };
    if (query.state)
      where.state = { contains: query.state, mode: "insensitive" };
    if (query.city) where.city = { contains: query.city, mode: "insensitive" };

    if (query.minAge || query.maxAge) {
      where.ageAtReport = {};
      if (query.minAge) where.ageAtReport.gte = query.minAge;
      if (query.maxAge) where.ageAtReport.lte = query.maxAge;
    }

    if (query.symptoms && query.symptoms.length > 0) {
      where.symptoms = {
        array_contains: query.symptoms,
      };
    }

    if (query.severity) {
      where.symptomSeverity = query.severity;
    }

    // Get reports for map
    const reports = await prisma.report.findMany({
      where,
      select: {
        id: true,
        ageAtReport: true,
        symptoms: true,
        symptomSeverity: true,
        country: true,
        state: true,
        city: true,
        lat: true,
        lng: true,
        createdAt: true,
        status: true,
      },
    });

    // Convert to GeoJSON format
    const geoJsonFeatures = reports
      .filter((report) => report.lat !== null && report.lng !== null)
      .map((report) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [
            parseFloat(report.lng!.toString()),
            parseFloat(report.lat!.toString()),
          ],
        },
        properties: {
          id: report.id,
          ageAtReport: report.ageAtReport,
          severity: report.symptomSeverity,
          symptoms: Array.isArray(report.symptoms)
            ? (report.symptoms as string[])
            : [],
          city: report.city,
          state: report.state,
          country: report.country,
          createdAt: report.createdAt,
          status: report.status,
        },
      }));

    const geoJson = {
      type: "FeatureCollection" as const,
      features: geoJsonFeatures,
    };

    return Response.json({
      success: true,
      data: geoJson,
    });
  } catch (error) {
    console.error("Map reports error:", error);

    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          error: "Invalid query parameters",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Failed to fetch map data" },
      { status: 500 }
    );
  }
}
