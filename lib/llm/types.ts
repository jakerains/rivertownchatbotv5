export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
  functions?: FunctionDefinition[];
  model?: string;
}

export interface LLMProvider {
  generateResponse(messages: Message[], config?: LLMConfig): Promise<Message>;
  streamResponse(messages: Message[], config?: LLMConfig): AsyncGenerator<string>;
} 