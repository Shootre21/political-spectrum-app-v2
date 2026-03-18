# AI Provider Documentation

This document provides detailed information about each AI provider supported by the Political Spectrum App, including API key setup, pricing, rate limits, and best practices.

## Table of Contents

- [Overview](#overview)
- [Provider Comparison](#provider-comparison)
- [OpenAI (ChatGPT)](#openai-chatgpt)
- [Anthropic (Claude)](#anthropic-claude)
- [Google (Gemini)](#google-gemini)
- [xAI (Grok)](#xai-grok)
- [Moonshot (Kimi)](#moonshot-kimi)
- [Z.ai](#zai)
- [Round-Robin Selection](#round-robin-selection)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Overview

The Political Spectrum App supports multiple AI providers with automatic round-robin selection. Each provider has unique characteristics:

| Provider | Best For | Free Tier | Speed | Quality |
|----------|----------|-----------|-------|---------|
| OpenAI | General analysis | No | Fast | Excellent |
| Anthropic | Nuanced analysis | No | Medium | Excellent |
| Google | Cost-effective | Yes | Fast | Good |
| xAI | News/real-time | No | Fast | Good |
| Kimi | Long context | Limited | Medium | Good |
| Z.ai | Built-in fallback | Yes | Fast | Good |

---

## Provider Comparison

### Pricing Comparison (per 1M tokens)

| Provider | Input Price | Output Price | Free Tier |
|----------|-------------|--------------|-----------|
| OpenAI GPT-4o | $2.50 | $10.00 | No |
| OpenAI GPT-4o-mini | $0.15 | $0.60 | No |
| Anthropic Claude 3.5 Sonnet | $3.00 | $15.00 | No |
| Anthropic Claude 3 Haiku | $0.25 | $1.25 | No |
| Google Gemini 2.5 Flash | $0.075 | $0.30 | Yes (15 RPM) |
| xAI Grok-2 | $2.00 | $10.00 | No |
| Moonshot Kimi | ¥12 (~$1.70) | ¥12 | Limited |
| Z.ai | Contact | Contact | Yes (dev) |

### Rate Limits

| Provider | Free Tier | Tier 1 | Tier 2+ |
|----------|-----------|--------|---------|
| OpenAI | - | 500 RPM | 5,000+ RPM |
| Anthropic | - | 50 RPM | 500+ RPM |
| Google | 15 RPM | 2,000 RPM | Higher |
| xAI | - | Varies | Varies |
| Kimi | 100 RPM | Higher | Higher |
| Z.ai | Built-in | Contact | Contact |

---

## OpenAI (ChatGPT)

### Overview

OpenAI's GPT models are the most widely used and offer excellent quality for political analysis.

### Getting Your API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key immediately (shown only once)

### Key Format

```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Starts with `sk-` or `sk-proj-`
- Approximately 51-56 characters long

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `gpt-4o` | 128K | Best quality, recommended |
| `gpt-4o-mini` | 128K | Cost-effective alternative |
| `gpt-4-turbo` | 128K | Previous generation flagship |
| `gpt-3.5-turbo` | 16K | Budget option |

### Configuration

```env
OPENAI_API_KEY=sk-proj-your-key-here
```

### Example Request

```json
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are a political analyst..."},
    {"role": "user", "content": "Analyze this article..."}
  ],
  "max_tokens": 4096,
  "temperature": 0.7
}
```

### Response Format

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Analysis result..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 500,
    "completion_tokens": 300,
    "total_tokens": 800
  }
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid API key | Verify key at platform.openai.com |
| `429 Rate Limited` | Too many requests | Wait or upgrade tier |
| `context_length_exceeded` | Input too long | Reduce article length |
| `insufficient_quota` | Billing issue | Add payment method |

---

## Anthropic (Claude)

### Overview

Claude excels at nuanced analysis and following complex instructions, making it ideal for political content.

### Getting Your API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to [API Keys](https://console.anthropic.com/settings/keys)
4. Click "Create Key"
5. Copy the key

### Key Format

```
sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Starts with `sk-ant-`
- Approximately 100+ characters

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `claude-3-5-sonnet-20241022` | 200K | Best balance, recommended |
| `claude-3-opus-20240229` | 200K | Highest quality |
| `claude-3-haiku-20240307` | 200K | Fast, economical |

### Configuration

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Example Request

```json
{
  "model": "claude-3-5-sonnet-20241022",
  "messages": [
    {"role": "user", "content": "Analyze this article..."}
  ],
  "system": "You are a political analyst...",
  "max_tokens": 4096
}
```

### Response Format

```json
{
  "content": [
    {
      "type": "text",
      "text": "Analysis result..."
    }
  ],
  "model": "claude-3-5-sonnet-20241022",
  "usage": {
    "input_tokens": 500,
    "output_tokens": 300
  }
}
```

### Differences from OpenAI

- `system` message is a separate parameter, not in messages array
- Response uses `content` array instead of `choices`
- No `temperature` in default request

---

## Google (Gemini)

### Overview

Google's Gemini offers a generous free tier and excellent performance for cost-conscious users.

### Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Click "Get API Key"
4. Create a new key or use existing
5. Copy the key

### Key Format

```
AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Starts with `AIza`
- Approximately 39 characters

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `gemini-2.5-flash` | 1M | Recommended, fast |
| `gemini-1.5-pro` | 2M | Complex analysis |
| `gemini-1.5-flash` | 1M | Quick responses |

### Configuration

```env
GEMINI_API_KEY=AIza-your-key-here
```

### Example Request

```json
{
  "model": "gemini-2.5-flash",
  "contents": [
    {
      "role": "user",
      "parts": [{"text": "Analyze this article..."}]
    }
  ],
  "generationConfig": {
    "maxOutputTokens": 8192,
    "temperature": 0.7
  }
}
```

### Response Format

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {"text": "Analysis result..."}
        ],
        "role": "model"
      }
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 500,
    "candidatesTokenCount": 300
  }
}
```

### Free Tier Limits

- 15 requests per minute
- 1,500 requests per day
- 1M tokens per minute

---

## xAI (Grok)

### Overview

xAI's Grok has access to real-time X (Twitter) data, making it excellent for current news analysis.

### Getting Your API Key

1. Go to [xAI Console](https://console.x.ai/)
2. Sign in or create an account
3. Navigate to API Keys
4. Generate a new key

### Key Format

```
xai-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Starts with `xai-`
- Variable length

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `grok-2-latest` | 128K | Recommended |
| `grok-2-1212` | 128K | Stable version |
| `grok-beta` | Variable | Experimental |

### Configuration

```env
GROK_API_KEY=xai-your-key-here
```

### Example Request

Same format as OpenAI (compatible API).

### Special Features

- Real-time X/Twitter data access
- Good for breaking news
- Supports function calling

---

## Moonshot (Kimi)

### Overview

Moonshot's Kimi is a Chinese AI provider offering very long context windows.

### Getting Your API Key

1. Go to [Moonshot Platform](https://platform.moonshot.cn/)
2. Sign in (may require Chinese phone number)
3. Navigate to [API Keys](https://platform.moonshot.cn/console/api-keys)
4. Create a new key

### Key Format

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Starts with `sk-`
- Similar to OpenAI format

### Available Models

| Model | Context | Best For |
|-------|---------|----------|
| `moonshot-v1-8k` | 8K | Standard use |
| `moonshot-v1-32k` | 32K | Longer articles |
| `moonshot-v1-128k` | 128K | Very long context |

### Configuration

```env
KIMI_API_KEY=sk-your-key-here
```

### Example Request

OpenAI-compatible API format.

### Notes

- Chinese language optimized
- Pricing in Chinese Yuan (¥)
- Good for Chinese news analysis

---

## Z.ai

### Overview

Z.ai is built into the app's SDK and works without explicit configuration in development.

### Configuration

```env
ZAI_API_KEY=your-key-here  # Optional for dev
```

### Notes

- Built into z-ai-web-dev-sdk
- Works automatically in development
- Contact Z.ai for production access

---

## Round-Robin Selection

The app automatically rotates between configured providers:

1. **Validation**: Only providers with valid API keys are used
2. **Rotation**: Each request uses the next provider in sequence
3. **Fallback**: Z.ai is used if no other providers are configured

### Implementation

```typescript
// Get next provider
const provider = getNextProvider();

// Or specify preferred provider
const response = await generateContent(prompt, systemPrompt, 'openai');
```

### Provider Priority

Providers are used in this order (when configured):
1. OpenAI (ChatGPT)
2. Anthropic (Claude)
3. Google (Gemini)
4. xAI (Grok)
5. Moonshot (Kimi)
6. Z.ai (fallback)

---

## Error Handling

### Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 401 | Invalid API key | Check key format and validity |
| 402 | Payment required | Add billing to account |
| 429 | Rate limited | Wait or upgrade tier |
| 500 | Server error | Retry with exponential backoff |
| 503 | Service unavailable | Try another provider |

### Error Response Format

```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### Automatic Error Handling

The app handles errors by:
1. Logging the error with context
2. Providing helpful resolution messages
3. Falling back to other providers if available
4. Recording statistics for monitoring

---

## Best Practices

### 1. Use Multiple Providers

```env
# Configure at least 2-3 providers for reliability
OPENAI_API_KEY=sk-proj-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GEMINI_API_KEY=AIza-xxx
```

### 2. Monitor Usage

```bash
# Check provider statistics
curl http://localhost:3000/api/analytics?type=providers
```

### 3. Set Appropriate Limits

```typescript
// Use appropriate max_tokens
const response = await generateContent(prompt, systemPrompt, {
  maxTokens: 2000,  // Adjust based on needs
});
```

### 4. Handle Rate Limits

```typescript
// The app automatically handles rate limits
// but you can specify preferred provider
try {
  return await generateContent(prompt, systemPrompt, 'openai');
} catch (error) {
  // Falls back to next provider automatically
  return await generateContent(prompt, systemPrompt);
}
```

### 5. Cache Results

For repeated analysis of the same article, the app caches results automatically.

### 6. Cost Optimization

| Use Case | Recommended Provider |
|----------|---------------------|
| Development/Testing | Gemini (free tier) |
| Production | OpenAI GPT-4o-mini or Claude Haiku |
| Complex Analysis | Claude 3.5 Sonnet |
| Breaking News | Grok |

---

## Troubleshooting

### "No AI providers configured"

**Solution**: Set at least one API key in `.env` or Settings page.

### "Invalid API key format"

**Solution**: Verify the key format matches the provider:
- OpenAI: starts with `sk-`
- Anthropic: starts with `sk-ant-`
- Gemini: starts with `AIza`
- Grok: starts with `xai-`

### "Rate limited"

**Solution**: 
1. Wait a few minutes
2. Use a different provider
3. Upgrade your API tier

### "Demo credentials detected"

**Solution**: Replace placeholder keys with real API keys from provider consoles.

---

*Last Updated: v2.5.0 - 2025-01-18*
