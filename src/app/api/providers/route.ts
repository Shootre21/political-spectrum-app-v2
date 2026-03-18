import { NextResponse } from 'next/server';
import { getProviderStatus, getProviderStats, AI_PROVIDERS } from '@/lib/ai-provider';

export async function GET() {
  try {
    const [status, stats] = await Promise.all([
      getProviderStatus(),
      getProviderStats(),
    ]);

    // Merge status with stats and add documentation
    const providers = status.map(provider => {
      const stat = stats.find(s => s.provider.toLowerCase().includes(provider.name.toLowerCase()));
      const docs = AI_PROVIDERS[provider.id as keyof typeof AI_PROVIDERS];
      
      return {
        id: provider.id,
        name: provider.name,
        active: provider.active,
        keySet: provider.keySet,
        keyValid: provider.keyValid,
        validationMessage: provider.validationMessage,
        requestCount: stat?.totalRequests || 0,
        successRate: stat?.successRate || 0,
        avgDuration: stat?.avgDuration || 0,
        // Documentation for UI
        documentation: docs ? {
          keyFormat: docs.keyFormat,
          keyPrefix: docs.keyPrefix,
          getKeyUrl: docs.getKeyUrl,
          pricing: docs.pricing,
          rateLimit: docs.rateLimit,
          models: docs.models,
          defaultModel: docs.defaultModel,
          notes: docs.notes,
        } : null,
      };
    });

    return NextResponse.json({
      providers,
      totalProviders: providers.length,
      activeProviders: providers.filter(p => p.active).length,
      validProviders: providers.filter(p => p.keyValid).length,
    });
  } catch (error) {
    console.error('Error getting provider status:', error);
    return NextResponse.json(
      { error: 'Failed to get provider status' },
      { status: 500 }
    );
  }
}
