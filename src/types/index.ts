// src/types/index.ts

// Your existing Document interface
export interface Document {
    id: string;
    name: string;
    contentType?: string;
    size: string;
    createdAt: Date;
    path: string;
    type: 'DOCUMENT' | 'MEMO' | 'DENIAL';
    caseId: string;
  }
  
  // New interfaces for AI and artifacts
  export interface ArtifactDocument {
    id: string;
    type: 'memo' | 'analysis' | 'summary';
    content: string;
    format: 'md' | 'docx' | 'pdf';
    metadata: {
      title: string;
      createdAt: Date;
      caseId: string;
      sourceDocumentId?: string;
    };
  }
  
  export interface ResourceDocument {
    id: string;
    type: 'manual' | 'form' | 'legislation';
    content: string;
    metadata: {
      title: string;
      category: string;
      url?: string;
      path?: string;
    };
  }
  
  export interface AIContext {
    caseDetails?: any;
    currentDocument?: Document;
    relatedDocuments?: Document[];
    resourceContext?: ResourceDocument[];
  }
  
  export interface AIResponse {
    message: string;
    artifact?: ArtifactDocument;
    sources?: {
      title: string;
      type: string;
      relevance: number;
    }[];
  }