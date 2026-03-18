import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Settings file path
const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');

// Default settings structure
interface AppSettings {
  apiKeys: {
    openai: string;
    anthropic: string;
    kimi: string;
    zai: string;
    grok: string;
    gemini: string;
  };
  preferences: {
    defaultAnalysisMethod: 'algorithm' | 'ai';
    showEvidence: boolean;
    showConfidence: boolean;
    enableSpeechSynthesis: boolean;
    refreshInterval: number;
  };
  version: string;
  lastUpdated: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  apiKeys: {
    openai: '',
    anthropic: '',
    kimi: '',
    zai: '',
    grok: '',
    gemini: '',
  },
  preferences: {
    defaultAnalysisMethod: 'algorithm',
    showEvidence: true,
    showConfidence: true,
    enableSpeechSynthesis: true,
    refreshInterval: 900000, // 15 minutes
  },
  version: '2.0.0',
  lastUpdated: new Date().toISOString(),
};

/**
 * Load settings from file
 */
function loadSettings(): AppSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const settings = JSON.parse(data) as AppSettings;
      
      // Merge with defaults for any missing keys
      return {
        ...DEFAULT_SETTINGS,
        ...settings,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          ...settings.apiKeys,
        },
        preferences: {
          ...DEFAULT_SETTINGS.preferences,
          ...settings.preferences,
        },
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to file
 */
function saveSettings(settings: AppSettings): void {
  try {
    settings.lastUpdated = new Date().toISOString();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    
    // Also update .env.local with API keys
    updateEnvFile(settings.apiKeys);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
}

/**
 * Update .env.local file with API keys
 */
function updateEnvFile(apiKeys: AppSettings['apiKeys']): void {
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Read existing .env.local if it exists
  let envContent = '';
  try {
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }
  } catch {
    // File doesn't exist, start fresh
  }
  
  // Parse existing env vars
  const envLines = envContent.split('\n').filter(line => line.trim());
  const envMap = new Map<string, string>();
  
  for (const line of envLines) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envMap.set(key.trim(), valueParts.join('=').trim());
    }
  }
  
  // Update API keys
  const keyMappings: Record<keyof AppSettings['apiKeys'], string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    kimi: 'KIMI_API_KEY',
    zai: 'ZAI_API_KEY',
    grok: 'GROK_API_KEY',
    gemini: 'GEMINI_API_KEY',
  };
  
  for (const [key, envKey] of Object.entries(keyMappings)) {
    const value = apiKeys[key as keyof AppSettings['apiKeys']];
    if (value) {
      envMap.set(envKey, value);
    } else {
      // Remove empty keys
      envMap.delete(envKey);
    }
  }
  
  // Reconstruct .env content
  const newEnvContent = Array.from(envMap.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // Add database URL if not present
  if (!envMap.has('DATABASE_URL')) {
    fs.writeFileSync(envPath, newEnvContent + '\nDATABASE_URL="file:./db/custom.db"\n');
  } else {
    fs.writeFileSync(envPath, newEnvContent + '\n');
  }
}

/**
 * GET - Load current settings
 */
export async function GET() {
  try {
    const settings = loadSettings();
    
    // Mask API keys for security (show only last 4 characters)
    const maskedSettings = {
      ...settings,
      apiKeys: Object.fromEntries(
        Object.entries(settings.apiKeys).map(([key, value]) => [
          key,
          value ? `****${value.slice(-4)}` : '',
        ])
      ) as AppSettings['apiKeys'],
      hasApiKeys: Object.fromEntries(
        Object.entries(settings.apiKeys).map(([key, value]) => [
          key,
          value ? true : false,
        ])
      ),
    };
    
    return NextResponse.json(maskedSettings);
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

/**
 * POST - Save settings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Load existing settings
    const currentSettings = loadSettings();
    
    // Update API keys (only update if new value provided)
    if (body.apiKeys) {
      for (const [key, value] of Object.entries(body.apiKeys)) {
        if (typeof value === 'string') {
          // If value is masked (starts with ****), keep the existing value
          if (value.startsWith('****')) {
            continue;
          }
          (currentSettings.apiKeys as Record<string, string>)[key] = value;
        }
      }
    }
    
    // Update preferences
    if (body.preferences) {
      currentSettings.preferences = {
        ...currentSettings.preferences,
        ...body.preferences,
      };
    }
    
    // Save settings
    saveSettings(currentSettings);
    
    // Return masked response
    const maskedSettings = {
      ...currentSettings,
      apiKeys: Object.fromEntries(
        Object.entries(currentSettings.apiKeys).map(([key, value]) => [
          key,
          value ? `****${value.slice(-4)}` : '',
        ])
      ) as AppSettings['apiKeys'],
      hasApiKeys: Object.fromEntries(
        Object.entries(currentSettings.apiKeys).map(([key, value]) => [
          key,
          value ? true : false,
        ])
      ),
      saved: true,
    };
    
    return NextResponse.json(maskedSettings);
  } catch (error) {
    console.error('Error in POST /api/settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear a specific API key
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyToClear = searchParams.get('key');
    
    if (!keyToClear) {
      return NextResponse.json(
        { error: 'No key specified to clear' },
        { status: 400 }
      );
    }
    
    const currentSettings = loadSettings();
    
    if (keyToClear in currentSettings.apiKeys) {
      (currentSettings.apiKeys as Record<string, string>)[keyToClear] = '';
      saveSettings(currentSettings);
    }
    
    return NextResponse.json({ cleared: true, key: keyToClear });
  } catch (error) {
    console.error('Error in DELETE /api/settings:', error);
    return NextResponse.json(
      { error: 'Failed to clear API key' },
      { status: 500 }
    );
  }
}
