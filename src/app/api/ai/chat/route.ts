// src/app/api/ai/chat/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ArtifactRequest {
  type: 'memo' | 'report' | 'analysis';
  format: 'docx' | 'pdf' | 'md';
  content: string;
  caseId: string;
}

export async function POST(request: Request) {
  try {
    const { messages, fileContext, caseId, documentId } = await request.json();
    
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;
    const apiKey = process.env.AZURE_OPENAI_API_KEY!;

    // Get case details and documents
    let caseContext = '';
    let caseDetails = null;
    
    if (caseId) {
      caseDetails = await prisma.case.findUnique({
        where: { id: caseId },
        include: {
          documents: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 10 // Limit to recent documents
          }
        }
      });

      if (caseDetails) {
        caseContext = `
Case Information:
- File Number: ${caseDetails.fileNo}
- Client: ${caseDetails.clientName}
- Type: ${caseDetails.caseType}
- Status: ${caseDetails.status}
- Date of Loss: ${caseDetails.dateOfLoss || 'N/A'}
- Lawyer: ${caseDetails.lawyer || 'N/A'}
- Paralegal: ${caseDetails.paralegal || 'N/A'}

Case Details:
${JSON.stringify(caseDetails.details, null, 2)}

Recent Documents:
${caseDetails.documents.map(doc => `- ${doc.name} (${doc.type})`).join('\n')}
`;
      }
    }

    // Get relevant resources based on context
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    const resourceTypes = [];
    
    if (userMessage.includes('accident benefit') || userMessage.includes('ab')) {
      resourceTypes.push('AB_MANUAL');
    }
    if (userMessage.includes('precedent') || userMessage.includes('template')) {
      resourceTypes.push('PRECEDENT');
    }
    if (userMessage.includes('guide') || userMessage.includes('procedure')) {
      resourceTypes.push('GUIDE');
    }

    const resources = await prisma.resourceDocument.findMany({
      where: {
        type: {
          in: resourceTypes.length ? resourceTypes : ['MANUAL', 'PRECEDENT', 'GUIDE']
        }
      },
      take: 5 // Limit the number of resources
    });

    const resourceContext = resources.length ? `
Relevant Resources:
${resources.map(r => `${r.type}: ${r.name}
${r.content.substring(0, 500)}...`).join('\n\n')}
` : '';

    // Construct system message
    const systemMessage: Message = {
      role: 'system',
      content: `You are an advanced legal AI assistant for a personal injury law firm case management system. You have access to case details, documents, and resources to help provide accurate and relevant information.

${caseContext}
${fileContext ? `Current Document Context:\n${fileContext.content}\n` : ''}
${resourceContext}

Your capabilities:
1. Answer questions about the case, its documents, and legal matters
2. Generate professional legal documents (memos, reports, analysis)
3. Provide insights based on available resources and precedents
4. Analyze documents and provide summaries
5. Help with legal research and document drafting

When generating documents:
- Use proper legal formatting and structure
- Include relevant case details and citations
- Maintain professional language and tone
- Format sections clearly with headers
- Include date and reference numbers
`
    };

    const response = await fetch(
      `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Azure OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'No response generated';

    // Check if this is a document generation request
    const isDocumentRequest = 
      userMessage.includes('generate') ||
      userMessage.includes('create') ||
      userMessage.includes('write') ||
      userMessage.includes('draft') ||
      userMessage.includes('memo') ||
      userMessage.includes('report');

    if (isDocumentRequest && caseId) {
      const documentType = 
        userMessage.includes('memo') ? 'memo' :
        userMessage.includes('report') ? 'report' : 'analysis';

      const artifact = await generateDocument({
        type: documentType,
        format: 'docx', // Default to docx
        content: aiResponse,
        caseId
      });

      return NextResponse.json({
        message: `I've generated a ${documentType} based on your request. You can find it in the documents section or download it directly. Would you like me to modify anything in the document?`,
        artifact: {
          id: artifact.id,
          name: artifact.name,
          path: artifact.path,
          type: artifact.type
        }
      });
    }

    return NextResponse.json({
      message: aiResponse,
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function generateDocument(request: ArtifactRequest) {
  const { type, format, content, caseId } = request;
  
  // Create directories if they don't exist
  const uploadDir = join(process.cwd(), 'uploads', caseId, type);
  await mkdir(uploadDir, { recursive: true });

  // Generate filename with timestamp and type
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${timestamp}-${type}.${format}`;
  const filePath = join(uploadDir, fileName);

  // Save the content
  await writeFile(filePath, content);

  // Create document record
  const document = await prisma.document.create({
    data: {
      name: fileName,
      path: filePath,
      contentType: `application/${format}`,
      size: Buffer.from(content).length.toString(),
      type: 'MEMO',
      caseId
    }
  });

  return document;
}