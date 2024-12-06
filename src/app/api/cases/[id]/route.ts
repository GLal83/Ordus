import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const params = await context.params;
  
  try {
    const caseDetails = await prisma.case.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        fileNo: true,
        clientName: true,
        caseType: true,
        status: true,
        dateOfLoss: true,
        lawyer: true,
        paralegal: true,
        details: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!caseDetails) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(caseDetails);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case details' },
      { status: 500 }
    );
  }
} 