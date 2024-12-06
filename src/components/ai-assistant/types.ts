// src/components/ai-assistant/types.ts
export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    artifact?: ArtifactData;
  }
  
  export interface FileContext {
    filename: string;
    content: string;
    caseId?: string;  // Added for case context
  }
  
  export interface ArtifactData {
    id: string;
    name: string;
    path: string;
    type: string;
    url?: string;
  }