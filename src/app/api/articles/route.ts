import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

/**
 * SQL-like query interface for historic articles
 * Supports filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Query parameters
    const source = searchParams.get('source');
    const category = searchParams.get('category');
    const minScore = searchParams.get('minScore');
    const maxScore = searchParams.get('maxScore');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'publishedAt';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sql = searchParams.get('sql'); // Raw SQL-like query

    // Handle raw SQL query
    if (sql) {
      return handleRawSQL(sql);
    }

    // Build Prisma query
    const where: Prisma.ArticleWhereInput = {};

    if (source) {
      where.source = { contains: source, mode: 'insensitive' };
    }

    if (category) {
      where.category = category;
    }

    if (minScore || maxScore) {
      where.spectrumScore = {};
      if (minScore) where.spectrumScore.gte = parseFloat(minScore);
      if (maxScore) where.spectrumScore.lte = parseFloat(maxScore);
    }

    if (startDate || endDate) {
      where.publishedAt = {};
      if (startDate) where.publishedAt.gte = new Date(startDate);
      if (endDate) where.publishedAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { leftWingSummary: { contains: search, mode: 'insensitive' } },
        { rightWingSummary: { contains: search, mode: 'insensitive' } },
        { socialistSummary: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Only get articles with full analysis
    where.leftWingSummary = { not: null };

    // Build orderBy
    const orderBy: Prisma.ArticleOrderByWithRelationInput = {};
    if (sort === 'spectrumScore') {
      orderBy.spectrumScore = order === 'desc' ? 'desc' : 'asc';
    } else if (sort === 'source') {
      orderBy.source = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.publishedAt = order === 'desc' ? 'desc' : 'asc';
    }

    // Execute query
    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
      }),
      db.article.count({ where }),
    ]);

    // Format response
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      url: article.url,
      source: article.source,
      publishedAt: article.publishedAt.toISOString(),
      category: article.category,
      spectrumScore: article.spectrumScore,
      popularityScore: article.popularityScore,
      leftWingSummary: article.leftWingSummary,
      rightWingSummary: article.rightWingSummary,
      socialistSummary: article.socialistSummary,
      aiProvider: article.aiProvider,
    }));

    return NextResponse.json({
      articles: formattedArticles,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      query: {
        source,
        category,
        minScore,
        maxScore,
        startDate,
        endDate,
        search,
        sort,
        order,
      },
    });
  } catch (error) {
    console.error('Error querying articles:', error);
    return NextResponse.json(
      { error: 'Failed to query articles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Handle raw SQL-like queries
 */
async function handleRawSQL(sql: string): Promise<NextResponse> {
  try {
    // Parse simple SQL-like queries
    const sqlLower = sql.toLowerCase().trim();
    
    // Only allow SELECT queries for security
    if (!sqlLower.startsWith('select')) {
      return NextResponse.json(
        { error: 'Only SELECT queries are allowed' },
        { status: 400 }
      );
    }

    // Extract columns, table, and conditions
    const selectMatch = sql.match(/select\s+(.+?)\s+from\s+(\w+)/i);
    if (!selectMatch) {
      return NextResponse.json(
        { error: 'Invalid SQL syntax. Expected: SELECT columns FROM table' },
        { status: 400 }
      );
    }

    const [, columns, table] = selectMatch;
    
    // Only allow querying the Article table
    if (table.toLowerCase() !== 'article' && table.toLowerCase() !== 'articles') {
      return NextResponse.json(
        { error: 'Only querying the Article table is allowed' },
        { status: 400 }
      );
    }

    // Build Prisma query from SQL-like syntax
    const where: Prisma.ArticleWhereInput = {};
    
    // Parse WHERE clause
    const whereMatch = sql.match(/where\s+(.+?)(?:\s+order\s+by|\s+limit|$)/i);
    if (whereMatch) {
      const conditions = whereMatch[1];
      
      // Simple condition parsing
      const conditionRegex = /(\w+)\s*(=|!=|>|<|>=|<=|like)\s*['"]?([^'"\s]+)['"]?/gi;
      let match;
      while ((match = conditionRegex.exec(conditions)) !== null) {
        const [, field, operator, value] = match;
        
        switch (field.toLowerCase()) {
          case 'source':
            if (operator === '=') where.source = value;
            else if (operator === 'like') where.source = { contains: value, mode: 'insensitive' };
            break;
          case 'category':
            if (operator === '=') where.category = value;
            break;
          case 'spectrumscore':
            if (operator === '>=' || operator === '>') where.spectrumScore = { gte: parseFloat(value) };
            else if (operator === '<=' || operator === '<') where.spectrumScore = { lte: parseFloat(value) };
            else if (operator === '=') where.spectrumScore = parseFloat(value);
            break;
        }
      }
    }

    // Parse ORDER BY
    const orderBy: Prisma.ArticleOrderByWithRelationInput = { publishedAt: 'desc' };
    const orderMatch = sql.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/i);
    if (orderMatch) {
      const [, field, direction] = orderMatch;
      const orderDirection = (direction || 'desc').toLowerCase() as 'asc' | 'desc';
      
      switch (field.toLowerCase()) {
        case 'spectrumscore':
          orderBy.spectrumScore = orderDirection;
          break;
        case 'publishedat':
          orderBy.publishedAt = orderDirection;
          break;
        case 'source':
          orderBy.source = orderDirection;
          break;
      }
    }

    // Parse LIMIT
    let limit = 50;
    const limitMatch = sql.match(/limit\s+(\d+)/i);
    if (limitMatch) {
      limit = parseInt(limitMatch[1]);
    }

    // Execute query
    const articles = await db.article.findMany({
      where,
      orderBy,
      take: limit,
    });

    // Select specific columns if not *
    let result = articles;
    if (columns.trim() !== '*') {
      const selectedColumns = columns.split(',').map(c => c.trim().toLowerCase());
      result = articles.map(article => {
        const filtered: Record<string, unknown> = {};
        for (const col of selectedColumns) {
          const key = col as keyof typeof article;
          if (key in article) {
            filtered[col] = article[key];
          }
        }
        return filtered as typeof article;
      });
    }

    return NextResponse.json({
      sql: sql,
      resultCount: result.length,
      articles: result,
    });
  } catch (error) {
    console.error('Error executing SQL:', error);
    return NextResponse.json(
      { error: 'Failed to execute SQL query', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Get unique sources and categories for filtering
 */
export async function POST() {
  try {
    const [sources, categories] = await Promise.all([
      db.article.findMany({
        where: { leftWingSummary: { not: null } },
        select: { source: true },
        distinct: ['source'],
      }),
      db.article.findMany({
        where: { leftWingSummary: { not: null } },
        select: { category: true },
        distinct: ['category'],
      }),
    ]);

    return NextResponse.json({
      sources: sources.map(s => s.source).filter(Boolean),
      categories: categories.map(c => c.category).filter(Boolean),
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    return NextResponse.json(
      { error: 'Failed to get filter options' },
      { status: 500 }
    );
  }
}
