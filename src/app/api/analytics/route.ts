import { NextResponse } from 'next/server';
import { 
  getAnalyticsOverview, 
  getSourceAnalytics, 
  getTimeSeriesData,
  getAuthorStatistics,
  getOutletStatistics 
} from '@/lib/analytics';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';
  const source = searchParams.get('source');
  const days = parseInt(searchParams.get('days') || '30');

  try {
    switch (type) {
      case 'overview':
        const overview = await getAnalyticsOverview();
        return NextResponse.json(overview);

      case 'source':
        if (!source) {
          return NextResponse.json({ error: 'Source parameter required' }, { status: 400 });
        }
        const sourceData = await getSourceAnalytics(source);
        return NextResponse.json(sourceData || { error: 'Source not found' });

      case 'timeseries':
        const timeSeries = await getTimeSeriesData(days);
        return NextResponse.json(timeSeries);

      case 'authors':
        const authors = getAuthorStatistics();
        return NextResponse.json(authors);

      case 'outlets':
        const outlets = getOutletStatistics();
        return NextResponse.json(outlets);

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
