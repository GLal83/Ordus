import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
   const id = await params.id; // Fix: await the id

   const caseExists = await prisma.case.findUnique({
     where: { id }
   });

   if (!caseExists) {
     return NextResponse.json(
       { success: false, error: 'Case not found' },
       { status: 404 }
     );
   }

   const memos = await prisma.document.findMany({
     where: {
       caseId: id,
       type: 'MEMO'
     },
     orderBy: {
       createdAt: 'desc'
     }
   });

   return NextResponse.json({
     success: true,
     data: memos.map((memo) => ({
       id: memo.id,
       name: memo.name,
       type: memo.contentType || 'application/octet-stream',
       size: memo.size,
       createdAt: memo.createdAt,
       uploadDate: memo.createdAt
     }))
   });
 } catch (error) {
   console.error('Error fetching memos:', error);
   return NextResponse.json(
     { success: false, error: 'Failed to fetch memos' },
     { status: 500 }
   );
 }
}

export async function POST(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
   const id = await params.id; // Fix: await the id

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

   // Add file size validation
   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
   if (file.size > MAX_FILE_SIZE) {
     return NextResponse.json(
       { success: false, error: 'File size exceeds limit of 10MB' },
       { status: 400 }
     );
   }

   const bytes = await file.arrayBuffer();
   const buffer = Buffer.from(bytes);

   const uploadDir = join(process.cwd(), 'uploads', id, 'memos');
   await mkdir(uploadDir, { recursive: true });

   // Sanitize filename to prevent security issues
   const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
   const filePath = join(uploadDir, fileName);
   
   await writeFile(filePath, buffer);

   const memo = await prisma.document.create({
     data: {
       name: file.name,
       path: filePath,
       contentType: file.type || 'application/octet-stream',
       size: formatFileSize(file.size),
       type: 'MEMO',
       caseId: id
     }
   });

   return NextResponse.json({
     success: true,
     data: {
       id: memo.id,
       name: memo.name,
       type: memo.contentType,
       size: memo.size,
       createdAt: memo.createdAt
     }
   });
 } catch (error) {
   console.error('Error uploading memo:', error);
   return NextResponse.json(
     { success: false, error: 'Failed to upload memo' },
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