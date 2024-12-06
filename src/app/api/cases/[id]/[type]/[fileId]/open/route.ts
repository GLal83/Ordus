import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

export async function GET(
  request: Request,
  { params }: { params: { id: string; type: string; fileId: string } }
) {
  try {
    const { id, type, fileId } = params;
    
    // Get file info from database
    const file = await db.file.findFirst({
      where: {
        id: fileId,
        caseId: id,
        type: type,
      },
      select: {
        id: true,
        name: true,
        path: true,
      }
    });

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File not found in database' 
        },
        { status: 404 }
      );
    }

    // Construct the full file path
    const filePath = path.join(process.cwd(), 'uploads', file.path);

    // Verify file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File not found on disk' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        filePath,
        name: file.name,
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get file path' 
      },
      { status: 500 }
    );
  }
} 