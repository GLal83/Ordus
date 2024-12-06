// src/lib/services/document-processor.ts
import { readFile } from 'fs/promises';
import { DocumentContext } from '@/types';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

export class DocumentProcessor {
  static async extractContent(filePath: string, mimeType: string): Promise<string> {
    const buffer = await readFile(filePath);

    switch (mimeType) {
      case 'application/pdf':
        const pdfData = await pdf(buffer);
        return pdfData.text;

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const { value } = await mammoth.extractRawText({ buffer });
        return value;

      case 'text/plain':
        return buffer.toString();

      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  }

  static async processDocument(
    filePath: string,
    mimeType: string,
    metadata: any
  ): Promise<DocumentContext> {
    const content = await this.extractContent(filePath, mimeType);
    
    return {
      id: metadata.id,
      type: metadata.type,
      content,
      metadata: {
        ...metadata,
        path: filePath
      }
    };
  }
}