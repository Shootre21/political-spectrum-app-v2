import { NextRequest, NextResponse } from 'next/server';
import analyzeArticle, { type BiasAnalysisResult, type HeadlineData } from '@/lib/bias-engine';

/**
 * Algorithm Analysis API - PRIMARY METHOD
 * 
 * This endpoint provides algorithm-based bias analysis.
 * NO API KEYS REQUIRED - Works 100% locally.
 * NO DATABASE REQUIRED - Works even if database is not configured.
 * 
 * Flow:
 * 1. Algorithm analyzes the article (ALWAYS works)
 * 2. Try to store in database (optional, fails gracefully)
 * 3. Return analysis results
 * 
 * This is the DEFAULT analysis method.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HeadlineData;
    const { headline, source, url, content, publishedAt } = body;

    if (!headline || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: headline, source' },
        { status: 400 }
      );
    }

    console.log(`[Algorithm] Analyzing: "${headline}" from ${source}`);

    // Run algorithm analysis (ALWAYS works, no AI needed, no database needed)
    const analysis = analyzeArticle({
      headline,
      source,
      url: url || '',
      content,
      publishedAt,
    });

    console.log(`[Algorithm] Analysis complete. Bias: ${analysis.finalBias.toFixed(2)}, Confidence: ${(analysis.confidence * 100).toFixed(0)}%`);

    // Try to store in database (OPTIONAL - fails gracefully)
    let databaseStored = false;
    try {
      // Dynamically import db to avoid issues if not configured
      const { db } = await import('@/lib/db');
      
      // Check if article already exists
      const existingArticle = await db.article.findFirst({
        where: {
          title: headline,
          source: source,
        },
      });

      const articleData = {
        id: existingArticle?.id || crypto.randomUUID(),
        title: headline,
        url: url || '',
        source: source,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        category: analysis.evidence.topics[0] || 'Politics',
        spectrumScore: analysis.finalBias * 3.33,
        popularityScore: 'Medium',
        leftWingSummary: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'left')
          .map(t => t.term)
          .slice(0, 3)
          .join(', ') || 'No specific left-framing detected',
        rightWingSummary: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'right')
          .map(t => t.term)
          .slice(0, 3)
          .join(', ') || 'No specific right-framing detected',
        socialistSummary: analysis.evidence.socialistMarkers.join(', ') || null,
        leftWingPoints: JSON.stringify(analysis.evidence.framingTerms.filter(t => t.leaning === 'left').map(t => t.term)),
        rightWingPoints: JSON.stringify(analysis.evidence.framingTerms.filter(t => t.leaning === 'right').map(t => t.term)),
        socialistPoints: JSON.stringify(analysis.evidence.socialistMarkers),
        spectrumJustification: analysis.spectrumJustification,
        outletBias: analysis.outletBias,
        articleDelta: analysis.articleDelta,
        evidence: JSON.stringify(analysis.evidence),
        tags: JSON.stringify(analysis.tags),
        confidence: analysis.confidence,
        analysisMethod: 'algorithm',
        wasEdited: false,
        aiProvider: 'algorithm',
        updatedAt: new Date(),
      };

      if (existingArticle) {
        await db.article.update({
          where: { id: existingArticle.id },
          data: articleData,
        });
      } else {
        await db.article.create({
          data: articleData,
        });
      }
      
      databaseStored = true;
      console.log(`[Algorithm] Article stored in database`);
    } catch (dbError) {
      // Database not configured or error - CONTINUE ANYWAY
      console.log('[Algorithm] Database not available, skipping storage:', dbError instanceof Error ? dbError.message : 'Unknown error');
    }

    // Format response for frontend compatibility
    const response = {
      topic: headline,
      article: {
        title: headline,
        url: url || '',
        source: source,
        publishedAt: publishedAt || new Date().toISOString(),
      },
      // Algorithm-specific fields
      ...analysis,
      // Compatibility with old format
      category: analysis.evidence.topics[0] || 'Politics',
      popularity: {
        score: 'Medium',
        justification: 'Based on outlet traffic and topic relevance.',
      },
      wasEdited: {
        status: false,
        reasoning: 'Algorithm analysis does not detect edit status.',
      },
      leftWingPerspective: {
        summary: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'left')
          .map(t => t.term)
          .slice(0, 3)
          .join(', ') || 'No specific left-framing terms detected.',
        talkingPoints: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'left')
          .map(t => t.term)
          .slice(0, 5) || ['No specific talking points identified.'],
      },
      rightWingPerspective: {
        summary: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'right')
          .map(t => t.term)
          .slice(0, 3)
          .join(', ') || 'No specific right-framing terms detected.',
        talkingPoints: analysis.evidence.framingTerms
          .filter(t => t.leaning === 'right')
          .map(t => t.term)
          .slice(0, 5) || ['No specific talking points identified.'],
      },
      socialistPerspective: {
        summary: analysis.evidence.socialistMarkers.join(', ') || 'No socialist framing detected.',
        talkingPoints: analysis.evidence.socialistMarkers.slice(0, 5) || ['No specific talking points identified.'],
      },
      spectrumScore: analysis.finalBias * 3.33, // Convert -3 to +3 scale to -10 to +10
      spectrumJustification: analysis.spectrumJustification,
      provider: 'Algorithm',
      model: 'v2.0.0 - 3-Layer Scoring Pipeline',
      cached: false,
      method: 'algorithm',
      databaseStored,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Algorithm] Error in analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
