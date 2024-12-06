import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'No file path provided' },
        { status: 400 }
      );
    }

    try {
      await fs.access(path);
      return NextResponse.json({ success: true });
    } catch {
      return NextResponse.json(
        { success: false, error: 'File not found or inaccessible' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error checking file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check file' },
      { status: 500 }
    );
  }
} 