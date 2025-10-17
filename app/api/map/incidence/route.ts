
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { incidenceQuerySchema } from '@/lib/validation';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

// GET incidence statistics for choropleth map
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    
    // Validate query parameters
    const query = incidenceQuerySchema.parse(queryParams);

    // Build where conditions
    let where: any = {};

    if (query.period) {
      where.period = query.period;
    } else {
      // Default to most recent period if not specified
      const latestPeriod = await prisma.incidenceStat.findFirst({
        select: { period: true },
        orderBy: { updatedAt: 'desc' },
      });
      if (latestPeriod) {
        where.period = latestPeriod.period;
      }
    }

    if (query.country) where.country = { contains: query.country, mode: 'insensitive' };
    if (query.state) where.state = { contains: query.state, mode: 'insensitive' };

    // Get incidence statistics
    const incidenceStats = await prisma.incidenceStat.findMany({
      where,
      select: {
        id: true,
        regionCode: true,
        regionName: true,
        country: true,
        state: true,
        city: true,
        lat: true,
        lng: true,
        period: true,
        cases: true,
        source: true,
        updatedAt: true,
      },
      orderBy: [
        { cases: 'desc' },
        { regionName: 'asc' },
      ],
    });

    // Format for choropleth visualization
    const regions = incidenceStats.map(stat => ({
      regionCode: stat.regionCode,
      name: stat.regionName,
      lat: parseFloat(stat.lat.toString()),
      lng: parseFloat(stat.lng.toString()),
      cases: stat.cases,
      country: stat.country,
      state: stat.state,
      city: stat.city,
      source: stat.source,
    }));

    // Determine the period being returned
    const period = incidenceStats[0]?.period || query.period || 'N/A';

    return Response.json({
      success: true,
      data: {
        period,
        regions,
        metadata: {
          totalRegions: regions.length,
          totalCases: regions.reduce((sum, region) => sum + region.cases, 0),
          lastUpdated: incidenceStats[0]?.updatedAt || null,
        },
      },
    });

  } catch (error) {
    console.error('Incidence map error:', error);

    if (error instanceof ZodError) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid query parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: 'Failed to fetch incidence data' },
      { status: 500 }
    );
  }
}
