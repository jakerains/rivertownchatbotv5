import { LLMProvider } from '../types';
import { GitHubModelsProvider } from './github-models';
import { AzureOpenAIProvider } from './azure-openai';

export type ProviderType = 'github' | 'azure';

export function createLLMProvider(): LLMProvider {
  const providerType = (process.env.NEXT_PUBLIC_LLM_PROVIDER || 'azure').toLowerCase() as ProviderType;

  switch (providerType) {
    case 'github':
      return new GitHubModelsProvider();
    case 'azure':
      return new AzureOpenAIProvider();
    default:
      console.warn(`Unknown provider type: ${providerType}, falling back to Azure OpenAI`);
      return new AzureOpenAIProvider();
  }
} 