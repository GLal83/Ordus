// src/lib/services/knowledge-base.ts
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { join } from 'path';
import { DocumentContext } from '@/types';

export class KnowledgeBase {
  private static embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: "2023-05-15",
  });

  static async indexDocument(document: DocumentContext) {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.createDocuments([document.content], [document.metadata]);
    
    // Store in vector database
    await PineconeStore.fromDocuments(docs, this.embeddings, {
      pineconeIndex: process.env.PINECONE_INDEX!,
    });
  }

  static async searchSimilar(query: string, k = 5) {
    const vectorStore = await PineconeStore.fromExistingIndex(
      this.embeddings,
      { pineconeIndex: process.env.PINECONE_INDEX! }
    );

    return await vectorStore.similaritySearch(query, k);
  }
}