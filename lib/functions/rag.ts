import { FunctionDefinition } from '../llm/types';
import { RAGResponse } from './types';

export const ragFunction: FunctionDefinition = {
  name: 'queryKnowledgeBase',
  description: 'Query the knowledge base for information about products, company policies, or general information',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'The question or query to search for in the knowledge base'
      }
    },
    required: ['query']
  }
};

export async function queryKnowledgeBase(args: { query: string }): Promise<RAGResponse> {
  try {
    const response = await fetch('/api/rag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: args.query })
    });

    if (!response.ok) {
      throw new Error('Failed to query knowledge base');
    }

    return await response.json();
  } catch (error) {
    console.error('RAG Error:', error);
    throw new Error('Failed to query knowledge base');
  }
} 