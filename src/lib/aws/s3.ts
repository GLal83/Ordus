// src/lib/aws/s3.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Buffer, fileName: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileName,
      Body: file,
      ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    await s3Client.send(command);

    // Return the S3 URL
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}