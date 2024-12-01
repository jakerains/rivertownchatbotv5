export interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
  functions?: FunctionDefinition[];
}

export interface LLMProvider {
  generateResponse(messages: Message[], config?: LLMConfig): Promise<Message>;
  generateStreamingResponse(messages: Message[], config?: LLMConfig): AsyncGenerator<string, void, unknown>;
} 