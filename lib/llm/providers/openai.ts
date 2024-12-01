import { BaseLLMProvider } from "./base";
import { Message, LLMConfig } from "../types";

export class OpenAIProvider extends BaseLLMProvider {
  private apiUrl: string;

  constructor() {
    super();
    this.apiUrl = '/api/chat';
  }

  async generateResponse(messages: Message[], config?: LLMConfig): Promise<Message> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      return {
        role: 'assistant',
        content: data.content
      };
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to generate response');
    }
  }

  async *streamResponse(messages: Message[], config?: LLMConfig): AsyncGenerator<string> {
    // For now, we'll use non-streaming response
    const response = await this.generateResponse(messages, config);
    yield response.content;
  }
} 