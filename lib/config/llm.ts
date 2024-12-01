export const LLM_CONFIG = {
  baseURL: process.env.LLM_BASE_URL || "https://models.inference.ai.azure.com",
  apiKey: process.env.LLM_API_KEY || "",
  defaultModel: process.env.LLM_MODEL || "gpt-4o-mini",
  defaultTemperature: 0.7,
  defaultMaxTokens: 1000,
} as const;

// Validate required environment variables
if (!process.env.LLM_API_KEY) {
  console.warn("Warning: LLM_API_KEY is not set");
}

export function createLLMConfig() {
  return {
    baseURL: LLM_CONFIG.baseURL,
    apiKey: LLM_CONFIG.apiKey,
    defaultModel: LLM_CONFIG.defaultModel,
  };
} 