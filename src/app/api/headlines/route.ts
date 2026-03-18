import { NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai-provider';
import { db } from '@/lib/db';

interface Headline {
  headline: string;
  source: string;
  url: string;
  emoji: string;
  publishedAt: string;
}

interface HeadlinesResponse {
  leftHeadlines: Headline[];
  rightHeadlines: Headline[];
  centerHeadlines: Headline[];
}

export async function GET() {
  try {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const prompt = `Generate a list of recent, distinct, and highly significant news headlines from US media. 
    IMPORTANT: The current date is ${formattedDate}. All articles must be published within the last month. 
    Focus on major, trending topics that are currently driving the national conversation, including significant political events, 
    major policy changes, or impactful national incidents. 
    
    Provide 4 headlines from left-leaning sources (like CNN, MSNBC, NPR), 
    4 from right-leaning sources (like FOX News, Daily Wire), 
    and 4 from center/mainstream sources (like Politico, CBS, Google News, Yahoo News). 
    
    For each headline, provide the source, the full URL to the article, an emoji that reflects its tone, 
    and the publication date. Use moderate emojis (e.g., 😐, 🤔) for neutral stories, 
    and more impactful emojis (e.g., 🤯, 😡, 🚨) for highly partisan or urgent stories.

    Respond with a JSON object in this exact format:
    {
      "leftHeadlines": [
        {"headline": "...", "source": "...", "url": "...", "emoji": "...", "publishedAt": "..."}
      ],
      "rightHeadlines": [...],
      "centerHeadlines": [...]
    }`;

    const systemPrompt = `You are a political news analyst. Generate realistic, current news headlines 
    from various media outlets across the political spectrum. Each headline should represent actual 
    ongoing news topics and debates in American politics. Use diverse, credible sources.`;

    const result = await generateJSON<HeadlinesResponse>(prompt, systemPrompt);

    // Store headlines in database for history
    const allHeadlines = [
      ...result.data.leftHeadlines.map(h => ({ ...h, leaning: 'left' })),
      ...result.data.rightHeadlines.map(h => ({ ...h, leaning: 'right' })),
      ...result.data.centerHeadlines.map(h => ({ ...h, leaning: 'center' })),
    ];

    // Store each headline as an article (without full analysis)
    for (const headline of allHeadlines) {
      try {
        await db.article.create({
          data: {
            title: headline.headline,
            url: headline.url,
            source: headline.source,
            publishedAt: new Date(headline.publishedAt || new Date()),
            category: 'Politics',
            aiProvider: result.provider,
          },
        });
      } catch {
        // Article might already exist, skip
      }
    }

    return NextResponse.json({
      ...result.data,
      provider: result.provider,
      model: result.model,
    });
  } catch (error) {
    console.error('Error fetching headlines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch headlines', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
