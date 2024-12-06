// src/lib/services/artifact-generator.ts
import { Artifact } from '@/types';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import docx from 'docx';
import PDFDocument from 'pdfkit';

export class ArtifactGenerator {
  static async generateArtifact(
    content: string,
    format: 'md' | 'docx' | 'pdf',
    metadata: any
  ): Promise<Artifact> {
    const id = crypto.randomUUID();
    const timestamp = Date.now();
    const fileName = `${timestamp}-${metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
    
    // Create artifacts directory if it doesn't exist
    const artifactsDir = join(process.cwd(), 'artifacts', metadata.caseId || 'general');
    await mkdir(artifactsDir, { recursive: true });

    let filePath: string;
    switch (format) {
      case 'docx':
        filePath = await this.generateDocx(content, fileName, artifactsDir);
        break;
      case 'pdf':
        filePath = await this.generatePdf(content, fileName, artifactsDir);
        break;
      default:
        filePath = await this.generateMarkdown(content, fileName, artifactsDir);
    }

    return {
      id,
      type: metadata.type,
      content,
      format,
      metadata: {
        ...metadata,
        filePath,
        createdAt: new Date()
      }
    };
  }

  private static async generateMarkdown(
    content: string,
    fileName: string,
    outputPath: string
  ): Promise<string> {
    const filePath = join(outputPath, `${fileName}.md`);
    await writeFile(filePath, content);
    return filePath;
  }

  // Add docx and pdf generation methods...
}