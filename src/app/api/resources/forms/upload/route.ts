import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToS3 } from '@/lib/aws/s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const formType = formData.get('formType') as string;
    const formName = formData.get('formName') as string;
    const category = formData.get('category') as 'accidentBenefits' | 'personalInjury';

    if (!file || !formType || !formName || !category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate safe filename
    const timestamp = new Date().getTime();
    const safeFileName = `forms/${category}/${formType}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    
    // Upload to S3
    const fileUrl = await uploadToS3(buffer, safeFileName);

    // Store form metadata in database
    const form = await prisma.form.create({
      data: {
        name: formName,
        type: formType,
        category: category,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size.toString(),
        url: fileUrl,
        uploadDate: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: form
    });

  } catch (error) {
    console.error('Error uploading form:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to upload form',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 