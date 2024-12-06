import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: Request,
  context: { params: { id: string; documentId: string } }
) {
  const params = await context.params;
  
  try {
    const document = await prisma.document.findUnique({
      where: {
        id: params.documentId,
        caseId: params.id
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    try {
      // Assuming files are stored in a 'uploads' directory at the project root
      const filePath = join(process.cwd(), 'uploads', document.id);
      const fileContent = readFileSync(filePath);

      // Create response with proper content type
      const response = new NextResponse(fileContent);

      // Set content type based on file type
      response.headers.set('Content-Type', document.type);
      // Set content disposition to make the browser handle the file appropriately
      response.headers.set('Content-Disposition', `inline; filename="${document.name}"`);

      return response;
    } catch (fileError) {
      console.error('Error reading file:', fileError);
      // If file not found, fall back to URL if available
      if (document.url) {
        return NextResponse.redirect(document.url);
      }
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string; documentId: string } }
) {
  const params = await context.params;
  
  try {
    const body = await request.json();
    const { name } = body;

    const document = await prisma.document.update({
      where: {
        id: params.documentId,
        caseId: params.id
      },
      data: {
        name
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string; documentId: string } }
) {
  const params = await context.params;
  
  try {
    await prisma.document.delete({
      where: {
        id: params.documentId,
        caseId: params.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 