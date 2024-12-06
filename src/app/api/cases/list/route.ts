import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        fileNo: true,
        clientName: true,
        caseType: true,
        status: true,
        createdAt: true,
        lawyer: true,
        paralegal: true
      }
    });

    return NextResponse.json(cases || []);
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
} 