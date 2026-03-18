# Political News Spectrum

<div align="center">

![Version](https://img.shields.io/badge/version-2.5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

**A multi-perspective news analysis platform using algorithm-based bias detection with optional AI-powered deep analysis.**

[Features](#features) • [Installation](#installation) • [Configuration](#configuration) • [API Reference](#api-reference) • [FAQ](#faq)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Algorithm Details](#algorithm-details)
- [Outlet Database](#outlet-database)
- [Author Database](#author-database)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## Overview

Political News Spectrum is a comprehensive news analysis platform that provides transparent, evidence-based bias classification for news articles. Unlike simple keyword-based systems, this application uses a sophisticated **3-layer scoring pipeline** that considers outlet baselines, article framing signals, and source diversity.

### What Makes This Different?

| Traditional Systems | Political News Spectrum |
|---------------------|------------------------|
| Keyword-based bias detection | Multi-layer algorithm analysis |
| Hard ideological labels ("socialist", "fascist") | Signal-based tags with evidence |
| Single AI provider dependency | Round-robin multi-provider support |
| Black-box classification | Transparent evidence output |
| No historical tracking | SQL-queryable article archive |

---

## Features

### 🔬 Algorithm-Based Analysis (Default)

- **3-Layer Scoring Pipeline**: Outlet baseline → Article delta → Final score
- **Evidence Panel**: See exactly what influenced each classification
- **Signal Detection**: Headline emotionality, topic framing, source diversity, partisan rhetoric
- **Confidence Scoring**: Know how reliable each analysis is

### 🤖 AI-Powered Analysis (Optional)

- **6 AI Providers**: ChatGPT, Claude, Kimi, Z.ai, Grok, Gemini
- **Round-Robin Selection**: Automatically rotates between configured providers
- **Usage Tracking**: Monitor provider performance and success rates

### 📊 Analytics Dashboard

- Bias distribution visualization
- Top sources analysis
- Topic distribution tracking
- System health monitoring

### 👥 Author Database

- 18+ journalists with political lean scores
- Reliability ratings for each author
- Categorized by political perspective

### 🗄️ Historic Articles Archive

- SQL-queryable article database
- Full-text search capability
- Date range filtering
- Spectrum score filtering

### 🎯 Transparency Features

- Evidence-based tags (no rigid labels)
- Outlet information display
- Source diversity metrics
- Opposing viewpoint detection

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix primitives) |
| **Backend** | Next.js API Routes |
| **Database** | SQLite (Prisma ORM) |
| **AI SDK** | z-ai-web-dev-sdk |
| **State Management** | React hooks, Zustand |

---

## Installation

### One-Click Setup (Windows)

The easiest way to get started is using the automated setup script:

```powershell
# Clone the repository
git clone https://github.com/Shootre21/political-spectrum-app-v2.git
cd political-spectrum-app-v2

# Run one-click setup
.\setup.ps1
```

**What the setup script does:**
- ✅ Checks prerequisites (Node.js, Bun/npm, Git)
- ✅ Installs all dependencies
- ✅ Creates and configures the database
- ✅ Sets up environment variables
- ✅ Runs build verification
- ✅ Generates detailed logs

**Setup Options:**
```powershell
.\setup.ps1 -Force           # Force clean reinstall
.\setup.ps1 -SkipDeps        # Skip dependency installation
.\setup.ps1 -SkipDB          # Skip database setup
.\setup.ps1 -Verbose         # Enable verbose logging
.\setup.ps1 -LogFile my.log  # Custom log file
```

**Quick Start:**
```powershell
# After setup completes, start the app
.\start.ps1

# Or with options
.\start.ps1 -Port 3001       # Use custom port
.\start.ps1 -Studio          # Also start Prisma Studio
.\start.ps1 -Prod            # Production mode
```

### Prerequisites

- **Node.js** 18.17 or later
- **Bun** (recommended) or npm
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/Shootre21/Political-spectrum-app.git
cd Political-spectrum-app
```

### Step 2: Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Using npm:
```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./db/custom.db"

# AI Provider API Keys (configure any or all)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
KIMI_API_KEY=your-kimi-api-key
ZAI_API_KEY=your-zai-api-key
GROK_API_KEY=your-grok-api-key
GEMINI_API_KEY=your-gemini-api-key
```

> **Note**: The app works without any API keys using the built-in algorithm. AI providers are optional for enhanced analysis.

### Step 4: Initialize the Database

```bash
bun run db:push
```

This creates the SQLite database with all required tables.

### Step 5: Start the Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:3000`

---

## Database Setup

### SQLite (Default - No Setup Required)

SQLite is the default database. It requires no additional installation - Prisma creates the database file automatically.

**Database location**: `./db/custom.db`

### PostgreSQL (Optional - For Production)

For production deployments, you can switch to PostgreSQL:

1. **Install PostgreSQL** on your server

2. **Create a database**:
```sql
CREATE DATABASE political_spectrum;
```

3. **Update `.env.local`**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/political_spectrum"
```

4. **Update Prisma schema** in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

5. **Run migrations**:
```bash
bun run db:push
```

### Database Schema

The application uses the following tables:

| Table | Purpose |
|-------|---------|
| `Article` | Stores analyzed articles with full analysis data |
| `AIProvider` | Tracks AI provider configurations |
| `RequestLog` | Logs API requests for analytics |
| `AuthorHistory` | Tracks author writing patterns |
| `AnalyticsSnapshot` | Daily analytics aggregations |

---

## Configuration

### API Keys Configuration

You can configure API keys in two ways:

#### Method 1: Environment Variables

Add keys to `.env.local`:
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
```

#### Method 2: Settings UI

1. Click the **Settings** button in the app header
2. Navigate to **API Keys** tab
3. Enter your API keys
4. Click **Save API Keys**

Keys are stored locally in `settings.json` and `.env.local`.

### Preferences Configuration

| Setting | Options | Default |
|---------|---------|---------|
| Default Analysis Method | algorithm, ai | algorithm |
| Show Evidence Panel | true, false | true |
| Show Confidence Score | true, false | true |
| Enable Speech Synthesis | true, false | true |

---

## Usage Guide

### Analyzing an Article

1. **From Headlines**: Click any headline on the main page
2. **From Ticker**: Click breaking news in the scrolling ticker
3. **From Archive**: Browse historic articles and click to analyze

### Understanding the Analysis

#### Spectrum Score

The spectrum score ranges from **-10 (very liberal)** to **+10 (very conservative)**:

```
Liberal ←─────────────────────────────────→ Conservative
  -10        -5         0         +5        +10
   |----------|----------|----------|----------|
        Left    Center-Left   Center   Center-Right   Right
```

#### Tags

Instead of rigid labels, the system applies evidence-based tags:

| Tag | Meaning |
|-----|---------|
| "High Authoritarian Rhetoric" | Multiple authoritarian language markers detected |
| "Multiple Sources Cited" | Article references 3+ sources |
| "No Opposing Viewpoint" | Article presents only one perspective |
| "Emotional Headline" | Headline uses sensational language |
| "Partisan Language Present" | Contains partisan terminology |

#### Signal Analysis

| Signal | Scale | What It Measures |
|--------|-------|------------------|
| Headline Emotionality | 0-10 | Sensational language in title |
| Source Diversity | 0-10 | Variety and number of sources |
| Partisan Rhetoric | 0-10 | Use of partisan terminology |
| Authoritarian Rhetoric | 0-10 | Anti-democratic language patterns |
| Socialist Rhetoric | 0-10 | Anti-capitalist language patterns |

### Using AI Analysis

After algorithm analysis, click **"Analyze with AI"** for deeper insights:

- More detailed talking points
- Enhanced perspective summaries
- Additional context and analysis

### Querying Historic Articles

1. Click **Archive** in the header
2. Use filters:
   - **Source**: Filter by news outlet
   - **Category**: Filter by topic
   - **Search**: Full-text search
3. Or use **SQL Query** tab for advanced queries

#### Example SQL Queries

```sql
-- Get all right-leaning articles
SELECT * FROM article WHERE spectrumScore > 5 ORDER BY publishedAt DESC LIMIT 20

-- Get articles from CNN
SELECT title, spectrumScore FROM article WHERE source LIKE '%CNN%' ORDER BY publishedAt DESC

-- Get articles about immigration
SELECT * FROM article WHERE category = 'immigration'
```

---

## API Reference

### Headlines

```
GET /api/headlines
```

Returns headlines organized by political leaning.

**Response:**
```json
{
  "leftHeadlines": [...],
  "rightHeadlines": [...],
  "centerHeadlines": [...],
  "provider": "Z.ai",
  "model": "z-ai-default"
}
```

### Algorithm Analysis

```
POST /api/analyze-algo
```

Analyzes an article using the algorithm.

**Body:**
```json
{
  "headline": "Article title",
  "source": "CNN",
  "url": "https://...",
  "publishedAt": "2025-01-18"
}
```

**Response:**
```json
{
  "spectrumScore": -2.5,
  "finalLabel": "Lean Left",
  "tags": ["Multiple Sources Cited", "No Opposing Viewpoint"],
  "evidence": {...},
  "confidence": 0.75
}
```

### AI Analysis

```
POST /api/analyze
```

Analyzes an article using AI (requires API key).

### Analytics

```
GET /api/analytics?type=overview
GET /api/analytics?type=authors
GET /api/analytics?type=outlets
GET /api/analytics?type=timeseries&days=30
```

### Articles Archive

```
GET /api/articles?source=CNN&category=Politics&search=immigration
```

### Provider Status

```
GET /api/providers
```

Returns status of all configured AI providers.

### System Test

```
GET /api/test?type=all
```

Runs comprehensive system tests.

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Headlines│ │Analysis │ │Analytics│ │ Authors │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
└───────┼──────────┼──────────┼──────────┼───────────────────┘
        │          │          │          │
        ▼          ▼          ▼          ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Routes                              │
│  ┌──────────┐ ┌────────────┐ ┌───────────┐ ┌────────────┐  │
│  │/headlines│ │/analyze-*  │ │/analytics │ │ /articles  │  │
│  └────┬─────┘ └─────┬──────┘ └─────┬─────┘ └──────┬─────┘  │
└───────┼─────────────┼───────────────┼──────────────┼────────┘
        │             │               │              │
        ▼             ▼               ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Services Layer                           │
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────────┐  │
│  │ Bias Engine  │ │ AI Provider   │ │ Analytics Service │  │
│  │ (Algorithm)  │ │ (Round-Robin) │ │                   │  │
│  └──────┬───────┘ └───────┬───────┘ └─────────┬─────────┘  │
└─────────┼─────────────────┼───────────────────┼─────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐│
│  │   SQLite   │  │ Outlet DB    │  │ Lexicons & Authors   ││
│  │  (Prisma)  │  │ (35 outlets) │  │ (8 topics, 18 auth)  ││
│  └────────────┘  └──────────────┘  └──────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Analysis Flow

```
Article Input
      │
      ▼
┌─────────────────┐
│ Get Outlet Info │ ──── CNN → bias: -1.5, reliability: 75%
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│           Calculate Article Delta            │
│  ┌─────────────────────────────────────────┐│
│  │ Topic Framing Score     │  +0.5 (right) ││
│  │ Headline Emotionality   │  +0.3         ││
│  │ Source Diversity        │  -0.2 (left)  ││
│  │ Partisan Rhetoric       │  +0.4         ││
│  └─────────────────────────────────────────┘│
│              Total Delta: +1.0               │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│            Combine Scores                    │
│                                              │
│  Outlet Bias (-1.5) × 0.4 = -0.6            │
│  Article Delta (+1.0) × 0.6 = +0.6          │
│  ─────────────────────────────────          │
│  Final Score: 0.0 (Center)                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│         Generate Evidence & Tags             │
│  • "Multiple Sources Cited"                  │
│  • "Topics: politics, economy"               │
│  • Confidence: 75%                           │
└─────────────────────────────────────────────┘
```

---

## Algorithm Details

### 3-Layer Scoring Pipeline

#### Layer 1: Outlet Baseline

Each news outlet has a pre-configured bias score based on:
- Historical editorial positions
- Media bias ratings from multiple sources
- Ownership and funding sources
- Audience demographics

**Score Range**: -3 (far left) to +3 (far right)

#### Layer 2: Article Delta

The algorithm calculates how much an article deviates from its outlet's baseline:

| Factor | Weight | Measurement |
|--------|--------|-------------|
| Topic Framing | 25% | Match against topic-specific lexicons |
| Headline Emotionality | 15% | Count of sensational language |
| Source Diversity | 10% | Number and variety of sources |
| Partisan Rhetoric | 10% | Presence of partisan markers |
| **Outlet Baseline** | **40%** | Pre-configured outlet bias |

#### Layer 3: Evidence & Tags

Instead of hard labels, the system outputs:
- Specific terms that influenced the score
- Source count and types
- Whether opposing viewpoints are present
- Topic categories detected

### Lexicon Categories

The system includes curated lexicons for 8 major topics:

| Topic | Left Terms | Right Terms |
|-------|------------|-------------|
| Immigration | undocumented immigrant, asylum seeker | illegal alien, border invasion |
| Economy | income inequality, corporate greed | job creators, free market |
| Healthcare | universal healthcare, medicare for all | government takeover, socialized medicine |
| Climate | climate crisis, existential threat | energy independence, climate alarmism |
| Crime | criminal justice reform, systemic racism | law and order, soft on crime |
| Elections | voter suppression, voting rights | voter fraud, election integrity |
| LGBTQ | LGBTQ rights, gender-affirming care | biological sex, parental rights |
| Foreign Policy | diplomacy first, endless wars | America first, military strength |

---

## Outlet Database

The system includes 35+ news outlets with bias and reliability scores:

### Left-Leaning (-3 to -0.5)

| Outlet | Bias | Reliability |
|--------|------|-------------|
| Jacobin | -3.0 | 55% |
| Mother Jones | -2.8 | 70% |
| MSNBC | -2.5 | 65% |
| HuffPost | -2.2 | 60% |
| Vox | -2.0 | 70% |
| The Guardian | -1.5 | 80% |
| CNN | -1.5 | 75% |
| New York Times | -1.2 | 85% |
| Washington Post | -1.3 | 82% |
| NPR | -0.8 | 88% |

### Center (-0.5 to +0.5)

| Outlet | Bias | Reliability |
|--------|------|-------------|
| ProPublica | -0.5 | 95% |
| Associated Press | 0.0 | 95% |
| Reuters | 0.0 | 95% |
| BBC | -0.2 | 90% |
| Politico | -0.3 | 85% |
| The Hill | 0.2 | 78% |
| Wall Street Journal | 0.8 | 88% |

### Right-Leaning (+0.5 to +3)

| Outlet | Bias | Reliability |
|--------|------|-------------|
| Fox News | 2.5 | 55% |
| Daily Wire | 2.6 | 50% |
| Breitbart | 2.8 | 45% |
| Newsmax | 2.9 | 40% |
| OANN | 3.0 | 35% |
| National Review | 2.2 | 72% |
| New York Post | 1.8 | 60% |

---

## Author Database

18 journalists with tracked political leanings:

### Left-Leaning Authors

| Author | Outlet | Lean Score | Reliability |
|--------|--------|------------|-------------|
| Rachel Maddow | MSNBC | -2.5 | 72% |
| Ta-Nehisi Coates | The Atlantic | -2.3 | 88% |
| Paul Krugman | NYT | -2.2 | 85% |
| Michelle Goldberg | NYT | -2.0 | 78% |
| Ezra Klein | Vox | -1.8 | 82% |
| Ronan Farrow | The New Yorker | -1.2 | 88% |

### Center Authors

| Author | Outlet | Lean Score | Reliability |
|--------|--------|------------|-------------|
| Maggie Haberman | NYT | 0.0 | 88% |
| David Sanger | NYT | 0.0 | 90% |
| Fareed Zakaria | CNN | -0.3 | 85% |
| Thomas Friedman | NYT | 0.2 | 78% |
| David Brooks | NYT | 0.5 | 80% |

### Right-Leaning Authors

| Author | Outlet | Lean Score | Reliability |
|--------|--------|------------|-------------|
| Sean Hannity | Fox News | 2.8 | 45% |
| Tucker Carlson | Independent | 2.7 | 40% |
| Ben Shapiro | Daily Wire | 2.5 | 55% |
| Jonah Goldberg | The Dispatch | 2.0 | 72% |
| Peggy Noonan | WSJ | 1.5 | 82% |
| David French | NYT | 1.2 | 80% |

---

## FAQ

### General Questions

**Q: Is this app biased?**

A: The algorithm is designed to be transparent and evidence-based. Instead of hiding how classifications are made, the system shows you exactly what signals influenced each score. You can review the evidence panel to see specific terms and factors that affected the analysis.

**Q: Why algorithm instead of AI?**

A: Algorithm-based analysis is:
- **Transparent**: You can see exactly how scores are calculated
- **Consistent**: Same input always produces same output
- **Free**: No API costs for basic analysis
- **Fast**: No network latency for AI calls
- **Privacy-friendly**: Article text isn't sent to external services

AI analysis is available as an optional enhancement for users who want deeper insights.

**Q: How accurate is the bias detection?**

A: The system provides confidence scores with each analysis. Higher confidence (80%+) indicates the algorithm found clear signals. Lower confidence suggests ambiguous content. The evidence panel lets you verify the reasoning yourself.

### Technical Questions

**Q: What database do I need?**

A: SQLite is the default and requires no setup. For production deployments, PostgreSQL is recommended for better performance and scalability.

**Q: Can I add my own news sources?**

A: Yes! Edit `/src/lib/outlets.ts` to add new outlets with their bias scores. The format is:

```typescript
'example.com': {
  name: 'Example News',
  domain: 'example.com',
  biasScore: 0.5,  // -3 to +3
  reliabilityScore: 80,  // 0-100
  factualReporting: 'MOSTLY FACTUAL',
  traffic: 'HIGH',
  type: 'news',
  country: 'US',
  language: 'en',
}
```

**Q: How do I add new lexicon terms?**

A: Edit `/src/lib/lexicons.ts` to add terms to existing topics or create new topic categories.

**Q: Can I use this without any API keys?**

A: Yes! The algorithm-based analysis works without any external APIs. API keys are only needed for:
- AI-powered deep analysis
- Generating headlines (uses Z.ai SDK which has free tier)

**Q: Why does headline generation still need AI?**

A: Headlines are generated content (not analysis), which requires AI. However:
1. The Z.ai SDK is included and works without additional configuration
2. You can disable headline fetching and manually input articles
3. Historic articles from the archive work without AI

### Deployment Questions

**Q: Can I deploy this to Vercel?**

A: Yes, but note:
- SQLite doesn't work on Vercel (use PostgreSQL or Vercel Postgres)
- Update `DATABASE_URL` for your production database
- Set API keys in Vercel environment variables

**Q: How do I run this in production?**

A: 
```bash
# Build
bun run build

# Start production server
bun run start
```

For Docker deployment, see the Dockerfile in the repository.

**Q: How do I backup my data?**

A: For SQLite, simply copy the `db/custom.db` file. For PostgreSQL, use `pg_dump`:

```bash
pg_dump political_spectrum > backup.sql
```

---

## Troubleshooting

### Error Codes Reference

The setup script uses standardized error codes for easy troubleshooting:

| Code | Description | Quick Fix |
|------|-------------|-----------|
| E001 | Node.js not installed | `winget install OpenJS.NodeJS.LTS` |
| E002 | Node.js version too old | Update to Node.js 18+ |
| E003 | Bun not installed | `powershell -c "irm bun.sh/install.ps1 \| iex"` |
| E004 | Port 3000 in use | `.\start.ps1 -Port 3001` |
| E005 | Package install failed | Delete `node_modules` and retry |
| E006 | Database migration failed | `npx prisma migrate reset --force` |
| E007 | Prisma client failed | `npx prisma generate` |
| E008 | Environment file failed | Create `.env` manually |
| E009 | Build failed | Check TypeScript errors |
| E010 | Git not installed | `winget install Git.Git` |
| E011 | Insufficient disk space | Free up 500MB+ |
| E012 | Permission denied | Run as Administrator |
| E013 | Network connection failed | Check internet/proxy |
| E014 | Prisma CLI not found | `bun add -d prisma` |
| E015 | SQLite database locked | Close other connections |

For detailed solutions, see [docs/FAQ.md](docs/FAQ.md)

### Capture Error Screenshots

Use the Playwright-based error capture tool:

```powershell
# Install Playwright
.\capture-errors.ps1 -Install

# Generate error screenshots
.\capture-errors.ps1 -Generate

# Screenshots saved to docs/errors/
```

### Common Issues

#### "API_KEY is not set" Error

**Solution**: The app works without API keys for algorithm analysis. If you want AI features:
1. Go to Settings
2. Enter your API keys
3. Click Save

#### Headlines Not Loading

**Possible causes**:
1. Z.ai SDK quota exhausted
2. Network connectivity issues
3. Rate limiting from AI provider

**Solution**:
1. Wait a few minutes and refresh
2. Check if you have API keys configured
3. Use the Archive to analyze historic articles

#### Database Errors

**Solution**:
```bash
# Reset database
bun run db:reset

# Or re-push schema
bun run db:push
```

#### Slow Analysis

**Causes**:
- AI provider latency
- Large article content

**Solutions**:
1. Use algorithm analysis (faster)
2. Check provider status in Analytics
3. Consider switching to a faster AI provider

### Debug Mode

Enable debug logging:

```env
DEBUG=true
LOG_LEVEL=debug
```

Check logs in `dev.log` file.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation

### Running Tests

```bash
# Run system tests
curl http://localhost:3000/api/test?type=all

# Run lint
bun run lint
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Credits

### Creator

**Shootre21** - [GitHub](https://github.com/Shootre21)

### Acknowledgments

- Media bias ratings compiled from multiple sources including AllSides, Ad Fontes Media, and Media Bias/Fact Check
- shadcn/ui for the beautiful component library
- Next.js team for the excellent framework
- Z.ai for the AI SDK

### Data Sources

- Outlet bias ratings: AllSides, Ad Fontes Media, Media Bias/Fact Check
- Author leanings: Based on public statements, editorial history, and peer analysis
- Lexicon terms: Compiled from academic research on political communication

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Shootre21/Political-spectrum-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Shootre21/Political-spectrum-app/discussions)

---

<div align="center">

**Made with ❤️ by Shootre21**

[⬆ Back to Top](#political-news-spectrum)

</div>
