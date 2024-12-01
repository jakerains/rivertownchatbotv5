import { LLMProvider, Message, LLMConfig } from '../types';
import { functionRegistry } from '../../functions/registry';

export abstract class BaseLLMProvider implements LLMProvider {
  abstract generateResponse(messages: Message[], config?: LLMConfig): Promise<Message>;
  abstract streamResponse(messages: Message[], config?: LLMConfig): AsyncGenerator<string>;

  protected async handleFunctionCall(functionName: string, args: any): Promise<any> {
    try {
      return await functionRegistry.execute(functionName, args);
    } catch (error) {
      console.error(`Error executing function ${functionName}:`, error);
      throw error;
    }
  }

  protected validateConfig(config?: LLMConfig): LLMConfig {
    return {
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 1000,
      functions: config?.functions,
      model: config?.model
    };
  }
} 