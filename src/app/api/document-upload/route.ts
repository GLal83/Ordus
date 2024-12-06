// src/app/api/document-upload/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { DocumentParser } from '@/lib/services/document-parser';
import { uploadToS3 } from '@/lib/aws/s3';
import mammoth from 'mammoth';

export async function POST(req: NextRequest) {
  console.log('Starting file upload process');
  
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      // Generate safe filename
      const timestamp = new Date().getTime();
      const safeFileName = `uploads/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
      
      console.log('Uploading to S3...');
      
      // Upload to S3
      const fileUrl = await uploadToS3(buffer, safeFileName);

      console.log('File uploaded successfully. URL:', fileUrl);
      console.log('Extracting text...');

      // Extract text from document
      const { value: text } = await mammoth.extractRawText({ buffer });

      console.log('Text extracted. Length:', text.length);
      console.log('Sample text:', text.substring(0, 200));

      // Parse document
      console.log('Parsing document...');
      const parsedData = await DocumentParser.parseIntakeForm(text);

      console.log('Document parsed successfully');

      return NextResponse.json({
        success: true,
        data: parsedData,
        fileUrl
      });

    } catch (error) {
      console.error('Error processing file:', error);
      return NextResponse.json({ 
        success: false,
        error: 'Error processing file',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Error handling request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}