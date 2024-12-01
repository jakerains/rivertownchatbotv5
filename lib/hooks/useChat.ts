import { useState, useCallback } from 'react';
import { Message, LLMProvider, LLMConfig } from '../llm/types';
import { functionRegistry } from '../functions/registry';

interface UseChatOptions {
  initialMessages?: Message[];
  config?: LLMConfig;
}

export function useChat(provider: LLMProvider, options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);
      
      const response = await provider.generateResponse(
        [...messages, userMessage],
        {
          ...options.config,
          functions: functionRegistry.getDefinitions()
        }
      );

      setMessages(prev => [...prev, response]);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [messages, provider, options.config]);

  const streamMessage = useCallback(async function* (content: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const userMessage: Message = { role: 'user', content };
      setMessages(prev => [...prev, userMessage]);
      
      const stream = await provider.generateStreamingResponse(
        [...messages, userMessage],
        {
          ...options.config,
          functions: functionRegistry.getDefinitions()
        }
      );

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        yield chunk;
      }

      const assistantMessage: Message = { role: 'assistant', content: fullResponse };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stream message');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [messages, provider, options.config]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    streamMessage
  };
} 