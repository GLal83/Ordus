import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('API: Received upload request');
  
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('API: No file provided');
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    console.log('API: File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Just echo back some basic info for testing
    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      }
    });

  } catch (error) {
    console.error('API: Error handling upload:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error handling upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}