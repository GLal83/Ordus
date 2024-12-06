// src/app/api/download/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const fileBuffer = await readFile(document.path);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': document.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.name}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json(
      { error: 'Failed to download document' },
      { status: 500 }
    );
  }
}