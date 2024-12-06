import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate a unique file number
    const fileNo = `F${Date.now()}`;
    
    const newCase = await prisma.case.create({
      data: {
        fileNo,
        clientName: `${data.clientInformation.firstName} ${data.clientInformation.lastName}`,
        caseType: data.caseDetails.accidentType.toUpperCase(),
        status: 'NEW',
        dateOfLoss: data.clientInformation.accidentDate,
        lawyer: data.legalCaseManagementInformation.assignedLawyer,
        paralegal: data.legalCaseManagementInformation.assignedParalegal,
        details: data
      }
    });

    return NextResponse.json(newCase);
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
} 