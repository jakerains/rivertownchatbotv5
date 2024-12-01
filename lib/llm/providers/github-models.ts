import { LLMProvider, Message, LLMConfig } from '../types';
import { functionRegistry } from '../../functions/registry';

export class GitHubModelsProvider implements LLMProvider {
  private endpoint: string;
  private apiKey: string;
  private model: string;
  
  constructor() {
    if (!process.env.NEXT_PUBLIC_LLM_BASE_URL) {
      throw new Error('NEXT_PUBLIC_LLM_BASE_URL environment variable is missing');
    }
    if (!process.env.NEXT_PUBLIC_LLM_API_KEY) {
      throw new Error('NEXT_PUBLIC_LLM_API_KEY environment variable is missing');
    }
    
    this.endpoint = process.env.NEXT_PUBLIC_LLM_BASE_URL + '/chat/completions';
    this.apiKey = process.env.NEXT_PUBLIC_LLM_API_KEY;
    this.model = process.env.NEXT_PUBLIC_LLM_MODEL || 'gpt-4o-mini';
  }

  private async handleFunctionCall(functionCall: any): Promise<Message> {
    try {
      const { name, arguments: argsStr } = functionCall;
      let args;
      
      try {
        args = argsStr ? JSON.parse(argsStr) : {};
      } catch (e) {
        console.warn('Failed to parse function arguments:', e);
        args = { input: argsStr }; // Fallback to treating the entire string as input
      }

      // For schedulePhoneCall, ensure we pass the input
      if (name === 'schedulePhoneCall' && !args.input) {
        args = { input: argsStr || '' };
      }

      const result = await functionRegistry.execute(name, args);
      return {
        role: 'function',
        name,
        content: JSON.stringify(result)
      };
    } catch (error) {
      console.error('Error executing function:', error);
      return {
        role: 'function',
        name: functionCall.name,
        content: JSON.stringify({ 
          success: false, 
          message: "I apologize, but I'm having trouble processing your request. Could you please try again?" 
        })
      };
    }
  }

  async generateResponse(messages: Message[], config?: LLMConfig): Promise<Message> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: config?.temperature ?? 0.7,
          max_tokens: config?.maxTokens ?? 800,
          functions: config?.functions,
          function_call: 'auto'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const message = data.choices[0].message;

      // Handle function calls
      if (message.function_call) {
        const functionResult = await this.handleFunctionCall(message.function_call);
        // Add the function result to messages and make another API call
        const newMessages = [...messages, message, functionResult];
        return this.generateResponse(newMessages, config);
      }

      return message;
    } catch (error) {
      console.error('Error calling GitHub Models:', error);
      throw error;
    }
  }

  async *generateStreamingResponse(messages: Message[], config?: LLMConfig): AsyncGenerator<string, void, unknown> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: config?.temperature ?? 0.7,
          max_tokens: config?.maxTokens ?? 800,
          functions: config?.functions,
          function_call: 'auto',
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let functionCallBuffer = '';
      let inFunctionCall = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk
          .split('\n')
          .filter(line => line.trim() !== '' && line.trim() !== 'data: [DONE]');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const delta = data.choices[0]?.delta;

              // Handle function calls in streaming
              if (delta?.function_call) {
                inFunctionCall = true;
                if (delta.function_call.name) {
                  functionCallBuffer = JSON.stringify({
                    name: delta.function_call.name,
                    arguments: delta.function_call.arguments || ''
                  });
                } else if (delta.function_call.arguments) {
                  const currentCall = JSON.parse(functionCallBuffer);
                  currentCall.arguments = (currentCall.arguments || '') + delta.function_call.arguments;
                  functionCallBuffer = JSON.stringify(currentCall);
                }
              } else if (inFunctionCall && functionCallBuffer) {
                // Function call is complete
                const functionCall = JSON.parse(functionCallBuffer);
                const functionResult = await this.handleFunctionCall(functionCall);
                const newMessages = [...messages, { role: 'assistant', function_call: functionCall }, functionResult];
                const finalResponse = await this.generateResponse(newMessages, config);
                yield finalResponse.content;
                return;
              } else if (delta?.content) {
                yield delta.content;
              }
            } catch (e) {
              console.warn('Failed to parse streaming response chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming response:', error);
      throw error;
    }
  }
} 