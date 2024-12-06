import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;  // Fix: await the id

    const caseExists = await prisma.case.findUnique({
      where: { id }
    });

    if (!caseExists) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    const denials = await prisma.document.findMany({
      where: {
        caseId: id,
        type: 'DENIAL'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: denials.map((denial) => ({
        id: denial.id,
        name: denial.name,
        type: denial.contentType || 'application/octet-stream',
        size: denial.size,
        createdAt: denial.createdAt,
        uploadDate: denial.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching denials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch denials' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;  // Fix: await the id

    const caseExists = await prisma.case.findUnique({
      where: { id }
    });

    if (!caseExists) {
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (optional)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds limit of 10MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'uploads', id, 'denials');
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;  // Sanitize filename
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);

    const denial = await prisma.document.create({
      data: {
        name: file.name,
        path: filePath,
        contentType: file.type || 'application/octet-stream',
        size: formatFileSize(file.size),
        type: 'DENIAL',
        caseId: id
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: denial.id,
        name: denial.name,
        type: denial.contentType,
        size: denial.size,
        createdAt: denial.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading denial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload denial' },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}