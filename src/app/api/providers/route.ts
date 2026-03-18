import { NextResponse } from 'next/server';
import { getProviderStatus, getProviderStats } from '@/lib/ai-provider';

export async function GET() {
  try {
    const [status, stats] = await Promise.all([
      getProviderStatus(),
      getProviderStats(),
    ]);

    // Merge status with stats
    const providers = status.map(provider => {
      const stat = stats.find(s => s.provider.toLowerCase().includes(provider.name.toLowerCase()));
      return {
        ...provider,
        requestCount: stat?.totalRequests || 0,
        successRate: stat?.successRate || 0,
        avgDuration: stat?.avgDuration || 0,
      };
    });

    return NextResponse.json({
      providers,
      totalProviders: providers.length,
      activeProviders: providers.filter(p => p.active).length,
    });
  } catch (error) {
    console.error('Error getting provider status:', error);
    return NextResponse.json(
      { error: 'Failed to get provider status' },
      { status: 500 }
    );
  }
}
