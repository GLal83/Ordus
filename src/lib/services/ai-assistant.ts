// src/lib/services/ai-assistant.ts
import { AIContext, AIResponse, Document, ArtifactDocument } from '@/types';
import { DocumentProcessor } from './document-processor';
import { ArtifactGenerator } from './artifact-generator';

export class AIAssistant {
  private static async generateSystemPrompt(context: AIContext): Promise<string> {
    const { caseDetails, currentDocument, relatedDocuments, resourceContext } = context;

    let prompt = `You are an AI assistant for a law firm case management system.`;

    if (caseDetails) {
      prompt += `\n\nCurrent Case Context:\n${JSON.stringify(caseDetails, null, 2)}`;
    }

    if (currentDocument) {
      const content = await DocumentProcessor.extractContent(currentDocument.path, currentDocument.contentType || '');
      prompt += `\n\nCurrent Document:\nTitle: ${currentDocument.name}\nContent: ${content}`;
    }

    if (resourceContext?.length) {
      prompt += `\n\nAvailable Resources:\n${resourceContext.map(r => 
        `${r.metadata.title} (${r.type}): ${r.content.substring(0, 200)}...`
      ).join('\n\n')}`;
    }

    return prompt;
  }

  static async processMessage(
    message: string,
    context: AIContext
  ): Promise<AIResponse> {
    try {
      const systemPrompt = await this.generateSystemPrompt(context);

      const response = await fetch(
        `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}/chat/completions?api-version=2023-05-15`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AZURE_OPENAI_API_KEY!,
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
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

      // Check if we need to generate an artifact
      if (message.toLowerCase().includes('generate') || 
          message.toLowerCase().includes('create a memo')) {
        const artifact = await ArtifactGenerator.generateArtifact(
          aiResponse,
          'docx',
          {
            title: `Generated Memo - ${new Date().toLocaleDateString()}`,
            type: 'memo',
            caseId: context.caseDetails?.id
          }
        );

        return {
          message: aiResponse,
          artifact
        };
      }

      return {
        message: aiResponse
      };
    } catch (error) {
      console.error('Error in AI processing:', error);
      throw error;
    }
  }
}