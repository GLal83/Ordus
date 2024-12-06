import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; documentId: string } }
) {
  try {
    const { id, documentId } = params;

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        caseId: id,
        type: 'DENIAL'
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Denial not found' },
        { status: 404 }
      );
    }

    if (!existsSync(document.path)) {
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      );
    }

    return NextResponse.json({ filePath: document.path });
  } catch (error) {
    console.error('Error opening denial:', error);
    return NextResponse.json(
      { error: 'Failed to open denial' },
      { status: 500 }
    );
  }
} 