# Political News Spectrum

<div align="center">

![Version](https://img.shields.io/badge/version-3.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

**A multi-perspective news analysis platform using algorithm-based bias detection with optional AI-powered deep analysis.**

**✨ Works 100% locally - NO external API keys required! ✨**

[Features](#features) • [Installation](#installation) • [Architecture](#architecture) • [FAQ](#faq)

</div>

---

## Key Features

### 🚀 Works Completely Offline
- **Real RSS Feeds**: Articles fetched from actual news sources (NYT, Fox, NPR, etc.)
- **Algorithm-Based Analysis**: Primary analysis method works without any AI
- **No Rate Limits**: Your own local instance with no restrictions
- **Privacy-First**: Article text never leaves your machine

### 🔬 Algorithm-Based Analysis (PRIMARY - Default)
- **3-Layer Scoring Pipeline**: Outlet baseline → Article delta → Final score
- **Evidence Panel**: See exactly what influenced each classification
- **Signal Detection**: Headline emotionality, topic framing, source diversity, partisan rhetoric
- **Confidence Scoring**: Know how reliable each analysis is
- **NO API KEYS NEEDED**

### 🤖 AI-Powered Analysis (OPTIONAL - Secondary)
- **5 AI Providers**: OpenAI, Anthropic, Google Gemini, xAI Grok, Moonshot Kimi
- **Your Keys, Your Control**: Use your own API keys for optional AI analysis
- **Round-Robin Selection**: Automatically rotates between configured providers
- **Usage Tracking**: Monitor provider performance and success rates

### 📊 Analytics Dashboard
- Bias distribution visualization
- Top sources analysis
- Topic distribution tracking
- System health monitoring

### 🗄️ Historic Articles Archive
- SQL-queryable article database
- Full-text search capability
- Date range filtering
- Spectrum score filtering

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Backend** | Next.js API Routes |
| **Database** | SQLite (Prisma ORM) |
| **News Sources** | Real RSS Feeds (No AI needed) |
| **AI SDK** | User-provided API keys (optional) |

---

## Installation

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Shootre21/political-spectrum-app-v2.git
cd political-spectrum-app-v2

# Install dependencies
bun install

# Set up database
bun run db:push

# Start the app
bun run dev
```

The app will be available at `http://localhost:3000`

**That's it! No API keys required. The app works immediately with real news from RSS feeds.**

### Prerequisites

- **Node.js** 18.17 or later
- **Bun** (recommended) or npm
- **Git**

### Environment Variables (Optional)

Create a `.env.local` file for optional AI features:

```env
# Database (required)
DATABASE_URL="file:./db/custom.db"

# AI API Keys (OPTIONAL - only for AI-powered analysis)
# OPENAI_API_KEY="sk-proj-your-key-here"
# ANTHROPIC_API_KEY="sk-ant-your-key-here"
# GEMINI_API_KEY="AIza-your-key-here"
# GROK_API_KEY="xai-your-key-here"
# KIMI_API_KEY="sk-your-key-here"
```

> **IMPORTANT**: The app works FULLY without any API keys! Only add keys if you want optional AI-powered analysis.

---

## Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                      NEWS FETCHING                           │
│                                                              │
│  REAL RSS FEEDS (No AI Required)                            │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                 │
│  │ NYT, CNN  │ │ NPR, AP   │ │ Fox, DW   │                 │
│  │ (Left)    │ │ (Center)  │ │ (Right)   │                 │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                 │
└────────┼─────────────┼─────────────┼────────────────────────┘
         │             │             │
         ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE STORAGE                          │
│                    (Always Happens)                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  SQLite Database - All articles stored locally          ││
│  │  • Title, URL, Source, Published Date                   ││
│  │  • Ready for analysis (algorithm or AI)                 ││
│  └─────────────────────────────────────────────────────────┘│
└────────────────────────────┬────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
         ▼                                       ▼
┌─────────────────────┐               ┌─────────────────────┐
│   ALGORITHM         │               │   AI ANALYSIS       │
│   (PRIMARY)         │               │   (OPTIONAL)        │
│                     │               │                     │
│ • Outlet Baseline   │               │ • Requires API Key  │
│ • Article Delta     │               │ • Deep Analysis     │
│ • Evidence Tags     │               │ • More Detail       │
│ • Confidence Score  │               │                     │
│                     │               │                     │
│ ✅ NO API NEEDED    │               │ ⚙️ USER'S KEY       │
└─────────────────────┘               └─────────────────────┘
```

### Primary: Algorithm Analysis

The default analysis method. Works without any external services:

1. **Outlet Baseline**: Uses pre-configured bias scores for 35+ news outlets
2. **Article Delta**: Calculates deviation from baseline based on:
   - Topic framing (25%)
   - Headline emotionality (15%)
   - Source diversity (10%)
   - Partisan rhetoric (10%)
3. **Evidence Generation**: Shows exactly what influenced the score

### Secondary: AI Analysis (Optional)

If you configure API keys, you can get deeper AI-powered analysis:

1. Click "Analyze with AI" after algorithm analysis
2. Uses your configured AI provider (OpenAI, Anthropic, etc.)
3. Returns more detailed perspective summaries

---

## News Sources

The app fetches real news from RSS feeds:

### Left-Leaning Sources
- New York Times
- Washington Post
- HuffPost
- MSNBC
- Vox

### Center Sources
- NPR
- Associated Press
- Reuters
- Politico
- Axios

### Right-Leaning Sources
- Fox News
- Daily Wire
- National Review
- Washington Times
- Townhall

---

## API Reference

### Headlines (RSS Feeds - No AI)

```
GET /api/headlines
```

Returns real headlines from RSS feeds. Works without any AI.

### Algorithm Analysis (No AI)

```
POST /api/analyze-algo
```

Analyzes an article using the local algorithm. Always works.

**Body:**
```json
{
  "headline": "Article title",
  "source": "CNN",
  "url": "https://..."
}
```

### AI Analysis (Requires API Key)

```
POST /api/analyze
```

Analyzes an article using AI. Only works if you've configured an API key.

### Articles Archive

```
GET /api/articles?source=CNN&category=Politics
```

Query historic articles from the database.

---

## Configuration

### Adding Custom News Sources

Edit `/src/lib/outlets.ts` to add new outlets:

```typescript
'example.com': {
  name: 'Example News',
  domain: 'example.com',
  biasScore: 0.5,  // -3 (far left) to +3 (far right)
  reliabilityScore: 80,  // 0-100
  factualReporting: 'MOSTLY FACTUAL',
  traffic: 'HIGH',
  type: 'news',
  country: 'US',
  language: 'en',
}
```

### Adding RSS Feeds

Edit `/src/lib/news-fetcher.ts` to add new RSS feed sources:

```typescript
const RSS_FEEDS = {
  left: [
    { url: 'https://example.com/rss', source: 'Example', domain: 'example.com' },
    // ...
  ],
  // ...
};
```

---

## FAQ

### Does this app require API keys?

**NO!** The app works completely without any API keys:
- Real news fetched from RSS feeds
- Algorithm-based bias analysis works locally
- All data stored in local SQLite database

API keys are only needed for optional AI-powered deep analysis.

### How does the algorithm analysis work?

The algorithm uses a 3-layer scoring pipeline:
1. **Outlet Baseline** (40%): Pre-configured bias scores for news outlets
2. **Article Delta** (60%): Deviation from baseline based on framing, emotionality, sources
3. **Evidence**: Shows exactly what terms and factors influenced the score

### Is this app biased?

The algorithm is transparent - you can see exactly what influenced each classification. The outlet bias scores are compiled from multiple media bias rating sources (AllSides, Ad Fontes Media, Media Bias/Fact Check).

### Can I run this offline?

Yes! Once set up:
- RSS feeds require internet to fetch new articles
- Algorithm analysis works completely offline
- Database stores everything locally

### What if RSS feeds are blocked?

The app falls back to cached articles in the database. You can also manually input article URLs for analysis.

---

## Development

### Available Scripts

```bash
bun run dev        # Start development server
bun run build      # Build for production
bun run start      # Start production server
bun run db:push    # Push database schema
bun run db:generate # Generate Prisma client
bun run lint       # Run ESLint
```

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── headlines/route.ts    # RSS feed fetching
│   │   ├── analyze-algo/route.ts # Algorithm analysis
│   │   ├── analyze/route.ts      # AI analysis (optional)
│   │   └── articles/route.ts     # Article archive
│   └── page.tsx                  # Main UI
├── lib/
│   ├── news-fetcher.ts           # RSS feed parser
│   ├── bias-engine.ts            # Algorithm analysis
│   ├── outlets.ts                # Outlet bias database
│   ├── lexicons.ts               # Topic lexicons
│   └── ai-provider.ts            # AI provider (optional)
└── components/ui/                # UI components
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Credits

- Media bias ratings compiled from AllSides, Ad Fontes Media, and Media Bias/Fact Check
- shadcn/ui for the component library
- Next.js team for the framework

---

<div align="center">

**Made with ❤️ by Shootre21**

**No rate limits. No AI dependency. Just real news analysis.**

</div>
