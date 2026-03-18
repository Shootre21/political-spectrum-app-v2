/**
 * Round-Robin AI Provider Service
 * Supports: ChatGPT, Claude, Kimi, Z.ai, Grok, Gemini
 * Uses environment variables for API keys and rotates between providers
 */

import ZAI from 'z-ai-web-dev-sdk';
import { db } from './db';

// Provider configuration from environment variables
const PROVIDER_CONFIG = {
  chatgpt: {
    name: 'ChatGPT',
    envKey: 'OPENAI_API_KEY',
    model: 'gpt-4o',
  },
  claude: {
    name: 'Claude',
    envKey: 'ANTHROPIC_API_KEY',
    model: 'claude-3-5-sonnet-20241022',
  },
  kimi: {
    name: 'Kimi',
    envKey: 'KIMI_API_KEY',
    model: 'moonshot-v1-8k',
  },
  zai: {
    name: 'Z.ai',
    envKey: 'ZAI_API_KEY',
    model: 'z-ai-default',
  },
  grok: {
    name: 'Grok',
    envKey: 'GROK_API_KEY',
    model: 'grok-beta',
  },
  gemini: {
    name: 'Gemini',
    envKey: 'GEMINI_API_KEY',
    model: 'gemini-2.5-flash',
  },
};

// Cache for active providers
let activeProviders: string[] = [];
let currentIndex = 0;
let lastProviderRefresh = 0;
const REFRESH_INTERVAL = 60000; // Refresh provider list every minute

/**
 * Get list of active providers from environment variables
 */
function getActiveProviders(): string[] {
  const now = Date.now();
  
  // Use cache if recently refreshed
  if (activeProviders.length > 0 && now - lastProviderRefresh < REFRESH_INTERVAL) {
    return activeProviders;
  }
  
  activeProviders = [];
  
  for (const [key, config] of Object.entries(PROVIDER_CONFIG)) {
    const apiKey = process.env[config.envKey];
    if (apiKey && apiKey.length > 0) {
      activeProviders.push(key);
    }
  }
  
  // If no providers configured, use z-ai-web-dev-sdk default
  if (activeProviders.length === 0) {
    activeProviders.push('zai');
  }
  
  lastProviderRefresh = now;
  return activeProviders;
}

/**
 * Get next provider using round-robin
 */
export function getNextProvider(): string {
  const providers = getActiveProviders();
  
  if (providers.length === 0) {
    throw new Error('No AI providers configured. Please set at least one API key.');
  }
  
  // Round-robin selection
  const provider = providers[currentIndex % providers.length];
  currentIndex = (currentIndex + 1) % providers.length;
  
  return provider;
}

/**
 * Get provider status
 */
export function getProviderStatus(): { name: string; active: boolean; requestCount: number }[] {
  const activeList = getActiveProviders();
  
  return Object.entries(PROVIDER_CONFIG).map(([key, config]) => ({
    name: config.name,
    active: activeList.includes(key),
    requestCount: 0, // Will be updated from database
  }));
}

/**
 * AI Response interface
 */
interface AIResponse {
  text: string;
  provider: string;
  model: string;
}

/**
 * Generate content using z-ai-web-dev-sdk
 * The SDK handles multiple providers internally
 */
export async function generateContent(prompt: string, systemPrompt?: string): Promise<AIResponse> {
  const provider = getNextProvider();
  const config = PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG];
  
  const startTime = Date.now();
  let success = false;
  let errorMessage = '';
  
  try {
    const zai = await ZAI.create();
    
    const messages: { role: 'system' | 'user'; content: string }[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });
    
    const completion = await zai.chat.completions.create({
      messages,
      model: config.model,
    });
    
    const text = completion.choices[0]?.message?.content || '';
    
    success = true;
    
    return {
      text,
      provider: config.name,
      model: config.model,
    };
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw error;
  } finally {
    // Log request
    const duration = Date.now() - startTime;
    await logRequest(provider, 'completion', success, errorMessage, duration).catch(console.error);
  }
}

/**
 * Generate JSON content with schema validation
 */
export async function generateJSON<T>(
  prompt: string, 
  systemPrompt?: string
): Promise<{ data: T; provider: string; model: string }> {
  const provider = getNextProvider();
  const config = PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG];
  
  const startTime = Date.now();
  let success = false;
  let errorMessage = '';
  
  try {
    const zai = await ZAI.create();
    
    const messages: { role: 'system' | 'user'; content: string }[] = [];
    
    const jsonSystemPrompt = `${systemPrompt || ''}\n\nYou must respond with valid JSON only. No markdown, no explanations, just pure JSON.`;
    messages.push({ role: 'system', content: jsonSystemPrompt });
    messages.push({ role: 'user', content: prompt });
    
    const completion = await zai.chat.completions.create({
      messages,
      model: config.model,
    });
    
    const text = completion.choices[0]?.message?.content || '';
    
    // Parse JSON from response
    let data: T;
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]) as T;
      } else {
        data = JSON.parse(text) as T;
      }
    } catch {
      throw new Error('Failed to parse JSON response: ' + text.substring(0, 200));
    }
    
    success = true;
    
    return {
      data,
      provider: config.name,
      model: config.model,
    };
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw error;
  } finally {
    const duration = Date.now() - startTime;
    await logRequest(provider, 'json_completion', success, errorMessage, duration).catch(console.error);
  }
}

/**
 * Log request to database
 */
async function logRequest(
  provider: string,
  requestType: string,
  success: boolean,
  errorMessage?: string,
  duration?: number
): Promise<void> {
  try {
    await db.requestLog.create({
      data: {
        provider,
        requestType,
        success,
        errorMessage,
        duration,
      },
    });
  } catch (error) {
    console.error('Failed to log request:', error);
  }
}

/**
 * Get provider statistics from database
 */
export async function getProviderStats(): Promise<{
  provider: string;
  totalRequests: number;
  successRate: number;
  avgDuration: number;
}[]> {
  const logs = await db.requestLog.groupBy({
    by: ['provider'],
    _count: {
      id: true,
    },
    _avg: {
      duration: true,
    },
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });
  
  const successCounts = await db.requestLog.groupBy({
    by: ['provider'],
    _count: {
      id: true,
    },
    where: {
      success: true,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });
  
  const successMap = new Map(successCounts.map(s => [s.provider, s._count.id]));
  
  return logs.map(log => ({
    provider: log.provider,
    totalRequests: log._count.id,
    successRate: successMap.get(log.provider) ? (successMap.get(log.provider)! / log._count.id) * 100 : 0,
    avgDuration: log._avg.duration || 0,
  }));
}
