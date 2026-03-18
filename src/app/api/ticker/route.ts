import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai-provider';

interface TickerHeadline {
  headline: string;
  source: string;
  url: string;
}

interface TickerResponse {
  headlines: TickerHeadline[];
}

export async function GET() {
  try {
    const prompt = `Generate a list of 10 breaking news headlines from major US media outlets 
    (including sources like CNN, FOX News, NPR, Politico, CBS, Google News, Yahoo News) from the last 24-48 hours. 
    
    For each, provide the headline, source, and a realistic URL.

    Respond with a JSON object in this exact format:
    {
      "headlines": [
        {"headline": "...", "source": "...", "url": "..."}
      ]
    }`;

    const systemPrompt = `You are a news aggregator. Generate realistic, current breaking news headlines 
    from major US media outlets. Focus on the most important and timely stories.`;

    const result = await generateJSON<TickerResponse>(prompt, systemPrompt);

    const headlinesWithDefaults = result.data.headlines.map(h => ({
      ...h,
      emoji: '⚡️',
      publishedAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      headlines: headlinesWithDefaults,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error('Error fetching ticker headlines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ticker headlines' },
      { status: 500 }
    );
  }
}
