'use client';

import { useState, useEffect, useCallback } from 'react';
import { SEOHead, seoPresets } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Loader2,
  Play,
  Pause,
  ArrowLeft,
  TrendingUp,
  Database,
  Search,
  Zap,
  Filter,
  RefreshCw,
  Settings,
  ChevronRight,
  Clock,
  Globe,
  Building2,
  Key,
  Save,
  AlertCircle,
  CheckCircle,
  Shield,
  Info,
  Sparkles,
  BarChart3,
  Eye,
  Tag,
  X,
  Trash2,
  Users,
  PieChart,
  LineChart,
  Activity,
  Image as ImageIcon,
  TestTube,
  User,
  BookOpen,
  Layers,
  Palette,
  Archive,
  Bookmark,
  FileText,
  ExternalLink,
  Lock,
  ChevronDown,
  Newspaper,
  MapPin,
  Calendar,
  Clock3,
  TrendingDown,
  Minus,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { OUTLET_DATABASE, getOutletInfo, getOutletBias, getBiasLabel, type OutletInfo } from '@/lib/outlets';

// Types
interface Headline {
  headline: string;
  source: string;
  url: string;
  emoji: string;
  publishedAt: string;
}

interface HeadlinesData {
  leftHeadlines: Headline[];
  rightHeadlines: Headline[];
  centerHeadlines: Headline[];
  provider?: string;
  model?: string;
}

interface Evidence {
  headlineTerms: string[];
  framingTerms: { term: string; leaning: 'left' | 'right' }[];
  partisanMarkers: string[];
  authoritarianMarkers: string[];
  socialistMarkers: string[];
  sources: { types: string[]; count: number; details: string[] };
  topics: string[];
  opposingViews: boolean;
}

interface AnalysisResult {
  topic: string;
  article: {
    title: string;
    url: string;
    source: string;
    publishedAt: string;
  };
  category: string;
  popularity: { score: string; justification: string };
  wasEdited: { status: boolean; reasoning: string };
  leftWingPerspective: { summary: string; talkingPoints: string[] };
  rightWingPerspective: { summary: string; talkingPoints: string[] };
  socialistPerspective: { summary: string; talkingPoints: string[] };
  spectrumScore: number;
  spectrumJustification: string;

  // Algorithm-specific fields
  outletBias?: number;
  articleDelta?: number;
  finalBias?: number;
  signals?: {
    headlineEmotionality: number;
    topicFraming: Record<string, number>;
    sourceDiversity: number;
    partisanRhetoric: number;
    authoritarianRhetoric: number;
    socialistRhetoric: number;
  };
  evidence?: Evidence;
  tags?: string[];
  outlet?: { name: string; domain: string; biasScore: number; reliabilityScore: number } | null;
  confidence?: number;
  method?: 'algorithm' | 'ai';
  provider?: string;
  model?: string;
  cached?: boolean;
}

interface SettingsData {
  apiKeys: Record<string, string>;
  hasApiKeys: Record<string, boolean>;
  preferences: {
    defaultAnalysisMethod: 'algorithm' | 'ai';
    showEvidence: boolean;
    showConfidence: boolean;
    enableSpeechSynthesis: boolean;
    refreshInterval: number;
  };
  version: string;
  saved?: boolean;
}

interface HistoricArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string | null;
  spectrumScore: number | null;
  popularityScore: string | null;
  aiProvider: string | null;
}

interface VersionInfo {
  version: string;
  versionName: string;
  releaseDate: string;
  buildNumber?: number;
}

// Similar topics for the enhanced UI
interface SimilarTopic {
  name: string;
  icon: React.ReactNode;
  count: number;
  selected?: boolean;
}

// Other news sources covering same story
interface OtherNewsSource {
  outlet: string;
  headline: string;
  url: string;
  biasScore: number;
  publishedAt: string;
  reliability: number;
}

// ==================== VALIDATION UTILITIES ====================

// Validate and clamp bias score (-3 to +3 range)
const validateBiasScore = (score: unknown): number => {
  const num = typeof score === 'number' ? score : parseFloat(String(score));
  if (isNaN(num)) return 0;
  return Math.max(-3, Math.min(3, num));
};

// Validate and clamp spectrum score (-10 to +10 range)
const validateSpectrumScore = (score: unknown): number => {
  const num = typeof score === 'number' ? score : parseFloat(String(score));
  if (isNaN(num)) return 0;
  return Math.max(-10, Math.min(10, num));
};

// Validate reliability score (0-100 range)
const validateReliabilityScore = (score: unknown): number => {
  const num = typeof score === 'number' ? score : parseFloat(String(score));
  if (isNaN(num)) return 70; // Default to medium reliability
  return Math.max(0, Math.min(100, num));
};

// Validate confidence (0-1 range)
const validateConfidence = (confidence: unknown): number => {
  const num = typeof confidence === 'number' ? confidence : parseFloat(String(confidence));
  if (isNaN(num)) return 0.5;
  return Math.max(0, Math.min(1, num));
};

// Validate percentage (0-100)
const validatePercentage = (value: unknown): number => {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
};

// Validate article count (non-negative integer)
const validateCount = (count: unknown): number => {
  const num = typeof count === 'number' ? count : parseInt(String(count));
  if (isNaN(num)) return 0;
  return Math.max(0, Math.floor(num));
};

// Validate URL
const isValidUrl = (url: unknown): boolean => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate date string
const isValidDate = (date: unknown): boolean => {
  if (!date) return false;
  const d = new Date(date as string);
  return !isNaN(d.getTime());
};

// ==================== HELPER FUNCTIONS ====================

// Format time ago with validation
const formatTimeAgo = (dateString: unknown): string => {
  if (!dateString || !isValidDate(dateString)) return 'Unknown';
  
  const now = new Date();
  const then = new Date(dateString as string);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diff < 0) return 'Just now';
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  return `${Math.floor(diff / 86400)} days ago`;
};

// Get bias color class with validation
const getBiasColor = (score: unknown): string => {
  const validatedScore = validateBiasScore(score);
  if (validatedScore <= -2) return 'bg-blue-500';
  if (validatedScore <= -0.5) return 'bg-blue-300';
  if (validatedScore < 0.5) return 'bg-gray-400';
  if (validatedScore < 2) return 'bg-red-300';
  return 'bg-red-500';
};

// Get bias gradient
const getBiasGradient = (): string => {
  return 'bg-gradient-to-r from-blue-500 via-gray-300 to-red-500';
};

// Get bias text color with validation
const getBiasTextColor = (score: unknown): string => {
  const validatedScore = validateBiasScore(score);
  if (validatedScore <= -2) return 'text-blue-600 dark:text-blue-400';
  if (validatedScore <= -0.5) return 'text-blue-500 dark:text-blue-300';
  if (validatedScore < 0.5) return 'text-gray-600 dark:text-gray-400';
  if (validatedScore < 2) return 'text-red-500 dark:text-red-300';
  return 'text-red-600 dark:text-red-400';
};

// Get reliability badge color with validation
const getReliabilityBadge = (score: unknown): { color: string; label: string } => {
  const validatedScore = validateReliabilityScore(score);
  if (validatedScore >= 90) return { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Very High' };
  if (validatedScore >= 75) return { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'High' };
  if (validatedScore >= 60) return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Medium' };
  if (validatedScore >= 40) return { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', label: 'Low' };
  return { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Very Low' };
};

// Get outlet initials for avatar fallback with validation
const getOutletInitials = (source: unknown): string => {
  if (!source || typeof source !== 'string') return '??';
  const words = source.split(/[\s-]+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return source.substring(0, 2).toUpperCase();
};

// Get spectrum label from score
const getSpectrumLabel = (score: unknown): string => {
  const validatedScore = validateSpectrumScore(score);
  if (validatedScore <= -7) return 'Far Left';
  if (validatedScore <= -3) return 'Left-Leaning';
  if (validatedScore <= 3) return 'Centrist';
  if (validatedScore <= 7) return 'Right-Leaning';
  return 'Far Right';
};

// Calculate coverage stats
interface CoverageStats {
  total: number;
  left: number;
  center: number;
  right: number;
  lastUpdated: string;
}

const calculateCoverageStats = (headlines: HeadlinesData | null): CoverageStats => {
  if (!headlines) {
    return { total: 0, left: 0, center: 0, right: 0, lastUpdated: 'Just now' };
  }

  const left = headlines.leftHeadlines.length;
  const center = headlines.centerHeadlines.length;
  const right = headlines.rightHeadlines.length;

  return {
    total: left + center + right,
    left,
    center,
    right,
    lastUpdated: 'Just now'
  };
};

// ==================== MAIN COMPONENT ====================

export default function PoliticalSpectrumApp() {
  // State
  const [view, setView] = useState<'headlines' | 'analysis' | 'history' | 'settings' | 'analytics' | 'authors'>('headlines');
  const [headlines, setHeadlines] = useState<HeadlinesData | null>(null);
  const [tickerHeadlines, setTickerHeadlines] = useState<Headline[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [historicArticles, setHistoricArticles] = useState<HistoricArticle[]>([]);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [version, setVersion] = useState<VersionInfo | null>(null);

  // Loading states
  const [headlinesLoading, setHeadlinesLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    apiKeys: {
      openai: '',
      anthropic: '',
      kimi: '',
      zai: '',
      grok: '',
      gemini: '',
    },
    preferences: {
      defaultAnalysisMethod: 'algorithm' as 'algorithm' | 'ai',
      showEvidence: true,
      showConfidence: true,
      enableSpeechSynthesis: true,
      refreshInterval: 900000,
    },
  });

  // Filters
  const [filters, setFilters] = useState({
    source: '',
    category: '',
    search: '',
  });

  // Speech synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Settings dialog
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // Article content state
  const [articleContent, setArticleContent] = useState<{
    content: string;
    title: string;
    isPaywalled: boolean;
    loading: boolean;
    error?: string;
  } | null>(null);

  // Archive state
  const [archiving, setArchiving] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  // Topics expanded state
  const [topicsExpanded, setTopicsExpanded] = useState(false);

  // Selected topic filter
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Similar topics data
  const similarTopics: SimilarTopic[] = [
    { name: 'US Politics', icon: <Globe className="w-3.5 h-3.5" />, count: 156 },
    { name: 'Democratic Party', icon: <Users className="w-3.5 h-3.5" />, count: 89 },
    { name: 'Donald Trump', icon: <User className="w-3.5 h-3.5" />, count: 234 },
    { name: 'Elections 2024', icon: <TrendingUp className="w-3.5 h-3.5" />, count: 178 },
    { name: 'Immigration', icon: <MapPin className="w-3.5 h-3.5" />, count: 67 },
    { name: 'Economy', icon: <BarChart3 className="w-3.5 h-3.5" />, count: 112 },
    { name: 'Healthcare', icon: <Activity className="w-3.5 h-3.5" />, count: 54 },
    { name: 'Climate', icon: <Globe className="w-3.5 h-3.5" />, count: 43 },
  ];

  // Other news sources (simulated for demo)
  const [otherNewsSources, setOtherNewsSources] = useState<OtherNewsSource[]>([]);

  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<{
    totalArticles: number;
    analyzedArticles: number;
    avgBiasScore: number;
    biasDistribution: { left: number; center: number; right: number };
    topSources: { source: string; count: number; avgBias: number }[];
    topicDistribution: { topic: string; count: number }[];
  } | null>(() => ({
    totalArticles: 120,
    analyzedArticles: 85,
    avgBiasScore: -0.15,
    biasDistribution: { left: 28, center: 32, right: 25 },
    topSources: [
      { source: 'CNN', count: 15, avgBias: -1.2 },
      { source: 'Fox News', count: 14, avgBias: 1.8 },
      { source: 'New York Times', count: 12, avgBias: -0.8 },
      { source: 'Washington Post', count: 10, avgBias: -0.6 },
      { source: 'Wall Street Journal', count: 8, avgBias: 0.5 },
      { source: 'NPR', count: 7, avgBias: -0.4 },
    ],
    topicDistribution: [
      { topic: 'Politics', count: 35 },
      { topic: 'Economy', count: 20 },
      { topic: 'Healthcare', count: 15 },
      { topic: 'Climate', count: 12 },
      { topic: 'Immigration', count: 10 },
      { topic: 'Foreign Policy', count: 8 },
    ],
  }));

  // Authors state
  const [authorsData, setAuthorsData] = useState<{
    left: { name: string; lean: number; reliability: number; avatar: string }[];
    center: { name: string; lean: number; reliability: number; avatar: string }[];
    right: { name: string; lean: number; reliability: number; avatar: string }[];
  } | null>(() => ({
    left: [
      { name: 'Rachel Maddow', lean: -2.5, reliability: 72, avatar: 'RM' },
      { name: 'Paul Krugman', lean: -2.2, reliability: 85, avatar: 'PK' },
      { name: 'Ta-Nehisi Coates', lean: -2.3, reliability: 88, avatar: 'TC' },
      { name: 'Ezra Klein', lean: -1.8, reliability: 82, avatar: 'EK' },
      { name: 'Michelle Goldberg', lean: -2.0, reliability: 78, avatar: 'MG' },
      { name: 'Ronan Farrow', lean: -1.2, reliability: 88, avatar: 'RF' },
    ],
    center: [
      { name: 'Maggie Haberman', lean: 0.0, reliability: 88, avatar: 'MH' },
      { name: 'David Sanger', lean: 0.0, reliability: 90, avatar: 'DS' },
      { name: 'David Brooks', lean: 0.5, reliability: 80, avatar: 'DB' },
      { name: 'Thomas Friedman', lean: 0.2, reliability: 78, avatar: 'TF' },
      { name: 'Fareed Zakaria', lean: -0.3, reliability: 85, avatar: 'FZ' },
    ],
    right: [
      { name: 'Sean Hannity', lean: 2.8, reliability: 45, avatar: 'SH' },
      { name: 'Ben Shapiro', lean: 2.5, reliability: 55, avatar: 'BS' },
      { name: 'Tucker Carlson', lean: 2.7, reliability: 40, avatar: 'TC' },
      { name: 'Peggy Noonan', lean: 1.5, reliability: 82, avatar: 'PN' },
      { name: 'Jonah Goldberg', lean: 2.0, reliability: 72, avatar: 'JG' },
      { name: 'David French', lean: 1.2, reliability: 80, avatar: 'DF' },
    ],
  }));

  // Test results state
  const [testResults, setTestResults] = useState<Record<string, unknown> | null>(null);
  const [testing, setTesting] = useState(false);

  // Fetch on mount
  useEffect(() => {
    fetchHeadlines();
    fetchTickerHeadlines();
    fetchSettings();
    fetchVersion();

    const tickerInterval = setInterval(fetchTickerHeadlines, 15 * 60 * 1000);
    return () => clearInterval(tickerInterval);
  }, []);

  // Fetch analytics and authors on demand
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?type=overview');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/analytics?type=authors');
      if (response.ok) {
        const data = await response.json();
        setAuthorsData(data);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  // Run tests
  const runTests = async () => {
    setTesting(true);
    try {
      const response = await fetch('/api/test?type=all');
      if (response.ok) {
        const data = await response.json();
        setTestResults(data);
        toast.success('All tests passed!');
      }
    } catch (error) {
      toast.error('Test failed');
    } finally {
      setTesting(false);
    }
  };

  // Fetch analytics when view changes
  useEffect(() => {
    if (view === 'analytics') {
      fetchAnalytics();
    } else if (view === 'authors') {
      fetchAuthors();
    }
  }, [view]);

  // Fetch headlines
  const fetchHeadlines = async () => {
    setHeadlinesLoading(true);
    try {
      const response = await fetch('/api/headlines');
      if (!response.ok) throw new Error('Failed to fetch headlines');
      const data = await response.json();
      setHeadlines(data);

      // Generate other news sources based on headlines
      if (data.leftHeadlines?.length > 0 || data.centerHeadlines?.length > 0 || data.rightHeadlines?.length > 0) {
        generateOtherNewsSources(data);
      }
    } catch (error) {
      console.error('Error fetching headlines:', error);
      toast.error('Failed to fetch headlines');
    } finally {
      setHeadlinesLoading(false);
    }
  };

  // Generate other news sources for a selected article
  const generateOtherNewsSources = (headlinesData: HeadlinesData) => {
    const allHeadlines = [
      ...headlinesData.leftHeadlines,
      ...headlinesData.centerHeadlines,
      ...headlinesData.rightHeadlines
    ];

    const sources: OtherNewsSource[] = allHeadlines.slice(0, 6).map(h => {
      const outlet = getOutletInfo(h.source.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '') + '.com');
      return {
        outlet: h.source,
        headline: h.headline,
        url: h.url,
        biasScore: outlet?.biasScore || 0,
        publishedAt: h.publishedAt,
        reliability: outlet?.reliabilityScore || 70
      };
    });

    setOtherNewsSources(sources);
  };

  // Fetch ticker headlines
  const fetchTickerHeadlines = async () => {
    try {
      const response = await fetch('/api/ticker');
      if (response.ok) {
        const data = await response.json();
        setTickerHeadlines(data.headlines);
      }
    } catch (error) {
      console.error('Error fetching ticker:', error);
    }
  };

  // Fetch settings
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setSettingsForm({
          apiKeys: data.apiKeys || settingsForm.apiKeys,
          preferences: data.preferences || settingsForm.preferences,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Fetch version
  const fetchVersion = async () => {
    try {
      const response = await fetch('/api/version');
      if (response.ok) {
        const data = await response.json();
        setVersion(data);
      }
    } catch (error) {
      console.error('Error fetching version:', error);
    }
  };

  // Analyze article with algorithm (default)
  const analyzeArticleAlgo = async (headline: Headline) => {
    setAnalysisLoading(true);
    try {
      const response = await fetch('/api/analyze-algo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: headline.headline,
          source: headline.source,
          url: headline.url,
          publishedAt: headline.publishedAt,
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze article');
      const data = await response.json();
      setAnalysis(data);
      setView('analysis');
      toast.success(`Algorithm analysis completed (${Math.round((data.confidence || 0.5) * 100)}% confidence)`);
    } catch (error) {
      console.error('Error analyzing article:', error);
      toast.error('Failed to analyze article');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Analyze article with AI (optional)
  const analyzeArticleAI = async (headline: Headline) => {
    setAnalysisLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: headline.headline,
          source: headline.source,
          url: headline.url,
          publishedAt: headline.publishedAt,
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze article');
      const data = await response.json();
      setAnalysis({ ...data, method: 'ai' });
      setView('analysis');
      toast.success(`AI analysis completed using ${data.provider || 'AI'}`);
    } catch (error) {
      console.error('Error analyzing article:', error);
      toast.error('Failed to analyze article with AI');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      const data = await response.json();
      setSettings(data);
      setSettingsDialogOpen(false);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Clear API key
  const clearApiKey = async (key: string) => {
    try {
      const response = await fetch(`/api/settings?key=${key}`, { method: 'DELETE' });
      if (response.ok) {
        setSettingsForm(prev => ({
          ...prev,
          apiKeys: { ...prev.apiKeys, [key]: '' }
        }));
        toast.success(`API key cleared`);
        fetchSettings();
      }
    } catch (error) {
      toast.error('Failed to clear API key');
    }
  };

  // Fetch historic articles
  const fetchHistoricArticles = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/articles?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setHistoricArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching historic articles:', error);
      toast.error('Failed to fetch historic articles');
    } finally {
      setHistoryLoading(false);
    }
  }, [filters]);

  // Speech synthesis
  const speakAnalysis = () => {
    if (!analysis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `Analyzing: ${analysis.article.title}. From ${analysis.article.source}. ` +
      `Bias score: ${analysis.spectrumScore?.toFixed(1) || 0} on scale of minus 10 to plus 10. ` +
      `Tags: ${analysis.tags?.join(', ') || 'None'}.`
    );
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Reset view
  const resetView = () => {
    setAnalysis(null);
    setView('headlines');
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setArticleContent(null);
    setIsArchived(false);
  };

  // Fetch article content for reading
  const fetchContent = async () => {
    if (!analysis?.article?.url) return;

    setArticleContent({ content: '', title: '', isPaywalled: false, loading: true });

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: analysis.article.url }),
      });

      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();

      setArticleContent({
        content: data.content || '',
        title: data.title || analysis.article.title,
        isPaywalled: data.isPaywalled || false,
        loading: false,
        error: data.error,
      });

      if (data.isPaywalled) {
        toast.info('This article appears to be paywalled. Limited content available.');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setArticleContent({
        content: '',
        title: analysis.article.title,
        isPaywalled: false,
        loading: false,
        error: 'Unable to fetch article content. The article may be paywalled or unavailable.',
      });
      toast.error('Could not fetch article content');
    }
  };

  // Archive article
  const archiveArticle = async () => {
    if (!analysis) return;

    setArchiving(true);

    try {
      const response = await fetch('/api/archive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: analysis.article.url.replace(/[^a-zA-Z0-9]/g, '_'),
          title: analysis.article.title,
          url: analysis.article.url,
          source: analysis.article.source,
          publishedAt: analysis.article.publishedAt,
          spectrumScore: analysis.spectrumScore,
          evidence: analysis.evidence,
          tags: analysis.tags,
          outletBias: analysis.outletBias,
          articleDelta: analysis.articleDelta,
          finalBias: analysis.finalBias,
          signals: analysis.signals,
        }),
      });

      if (!response.ok) throw new Error('Failed to archive');

      setIsArchived(true);
      toast.success('Article archived for later reading!');
    } catch (error) {
      console.error('Error archiving:', error);
      toast.error('Failed to archive article');
    } finally {
      setArchiving(false);
    }
  };

  // Calculate coverage stats
  const coverageStats = calculateCoverageStats(headlines);

  // Dynamic SEO based on current view
  const getSeoForView = () => {
    switch (view) {
      case 'headlines':
        return seoPresets.headlines;
      case 'analytics':
        return seoPresets.analytics;
      case 'authors':
        return seoPresets.authors;
      case 'settings':
        return seoPresets.settings;
      case 'analysis':
        return {
          title: analysis?.article?.title?.substring(0, 60) || 'Article Analysis',
          description: `Political bias analysis of "${analysis?.article?.title?.substring(0, 50) || 'article'}" from ${analysis?.article?.source || 'news outlet'}`,
          keywords: ['political analysis', 'bias detection', analysis?.article?.source || 'news'].filter(Boolean),
        };
      default:
        return seoPresets.home;
    }
  };

  const seoConfig = getSeoForView();

  // ==================== RENDER COMPONENTS ====================

  // Enhanced Headline Card Component with Validation
  const EnhancedHeadlineCard = ({ headline, onAnalyze }: { headline: Headline; onAnalyze: (h: Headline) => void }) => {
    // Get outlet info with fallback
    const outlet = getOutletInfo(headline.source.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '') + '.com') ||
                   Object.values(OUTLET_DATABASE).find(o => o.name.toLowerCase() === headline.source.toLowerCase());
    
    // Validate all numeric values
    const biasScore = validateBiasScore(outlet?.biasScore ?? 0);
    const reliability = validateReliabilityScore(outlet?.reliabilityScore ?? 70);
    const reliabilityBadge = getReliabilityBadge(reliability);
    
    // Calculate bias position percentage (clamped to 0-100)
    const biasPosition = Math.max(0, Math.min(100, ((biasScore + 3) / 6) * 100));
    
    // Validate URL before displaying
    const isValidArticleUrl = isValidUrl(headline.url);

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-l-4 dark:border-l-2"
        style={{ borderLeftColor: biasScore <= -2 ? '#3b82f6' : biasScore <= -0.5 ? '#93c5fd' : biasScore < 0.5 ? '#9ca3af' : biasScore < 2 ? '#fca5a5' : '#ef4444' }}
        onClick={() => isValidArticleUrl && onAnalyze(headline)}
      >
        <CardContent className="p-4">
          {/* Header with source and badges */}
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-10 h-10 rounded-lg shrink-0">
              <AvatarFallback className={`text-xs font-bold ${getBiasColor(biasScore)} text-white`}>
                {getOutletInitials(headline.source)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{headline.source || 'Unknown Source'}</span>
                <Badge className={`text-[10px] px-1.5 py-0 ${reliabilityBadge.color}`}>
                  {reliabilityBadge.label}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {reliability}% Reliable
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Clock3 className="w-3 h-3" />
                <span>{formatTimeAgo(headline.publishedAt)}</span>
                <span className="text-muted-foreground/50">•</span>
                <MapPin className="w-3 h-3" />
                <span>{outlet?.country || 'US'}</span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h3 className="font-medium text-sm leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {headline.headline || 'Untitled Article'}
          </h3>

          {/* Bias indicator bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={getBiasTextColor(biasScore)}>
                {getBiasLabel(biasScore)}
              </span>
              <span className="text-muted-foreground">
                Bias: {biasScore.toFixed(1)}
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-gradient-to-r from-blue-500 via-gray-300 to-red-500 overflow-hidden">
              <div
                className="absolute top-0 w-1 h-full bg-black dark:bg-white shadow-md transition-all"
                style={{ left: `${biasPosition}%`, transform: 'translateX(-50%)' }}
              />
            </div>
          </div>

          {/* Hover action */}
          <div className="flex items-center justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge variant="outline" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Click to analyze
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Coverage Details Sidebar Component with Validation
  const CoverageDetailsSidebar = () => {
    // Validate all counts
    const total = validateCount(coverageStats.total);
    const leftCount = validateCount(coverageStats.left);
    const centerCount = validateCount(coverageStats.center);
    const rightCount = validateCount(coverageStats.right);
    
    // Calculate validated percentages
    const leftPercent = total > 0 ? validatePercentage(Math.round((leftCount / total) * 100)) : 0;
    const centerPercent = total > 0 ? validatePercentage(Math.round((centerCount / total) * 100)) : 0;
    const rightPercent = total > 0 ? validatePercentage(Math.round((rightCount / total) * 100)) : 0;

    return (
      <Card className="sticky top-24">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Coverage Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total sources badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total News Sources</span>
            <Badge variant="secondary" className="font-bold">
              {total} Articles
            </Badge>
          </div>

          <Separator />

          {/* Leaning breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Leaning Left</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{leftCount}</span>
                <span className="text-xs text-muted-foreground">({leftPercent}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm">Center</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{centerCount}</span>
                <span className="text-xs text-muted-foreground">({centerPercent}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Leaning Right</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{rightCount}</span>
                <span className="text-xs text-muted-foreground">({rightPercent}%)</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Last updated */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Last Updated: {coverageStats.lastUpdated || 'Just now'}</span>
          </div>

          {/* Bias distribution bar */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Bias Distribution</span>
            <div className="flex h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div className="bg-blue-500 transition-all" style={{ width: `${leftPercent}%` }} />
              <div className="bg-gray-400 transition-all" style={{ width: `${centerPercent}%` }} />
              <div className="bg-red-500 transition-all" style={{ width: `${rightPercent}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Left {leftPercent}%</span>
              <span>Center {centerPercent}%</span>
              <span>Right {rightPercent}%</span>
            </div>
          </div>

          <Separator />

          {/* News source logos grid */}
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Sources</span>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(OUTLET_DATABASE).slice(0, 12).map((outlet) => {
                const outletBias = validateBiasScore(outlet.biasScore);
                const outletReliability = validateReliabilityScore(outlet.reliabilityScore);
                return (
                  <Avatar key={outlet.domain} className="w-8 h-8">
                    <AvatarFallback
                      className={`text-[10px] font-bold text-white ${getBiasColor(outletBias)}`}
                      title={`${outlet.name} - ${getBiasLabel(outletBias)} (${outletReliability}% reliability)`}
                    >
                      {getOutletInitials(outlet.name)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Similar Topics Section Component
  const SimilarTopicsSection = () => (
    <Card>
      <Collapsible open={topicsExpanded} onOpenChange={setTopicsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Similar Topics
              </CardTitle>
              {topicsExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <CardDescription>
              Related topics you might be interested in
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {similarTopics.map((topic) => (
                <Badge
                  key={topic.name}
                  variant={selectedTopic === topic.name ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/10 transition-colors py-1.5 px-3"
                  onClick={() => {
                    setSelectedTopic(selectedTopic === topic.name ? null : topic.name);
                    toast.info(`Filtering by: ${topic.name}`);
                  }}
                >
                  {topic.icon}
                  <span className="ml-1.5">{topic.name}</span>
                  <span className="ml-1.5 text-muted-foreground text-[10px]">({topic.count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  // Other News Sources Section Component
  const OtherNewsSourcesSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Other News Sources
        </CardTitle>
        <CardDescription>
          Other outlets covering similar stories
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-80">
          <div className="divide-y">
            {otherNewsSources.length > 0 ? otherNewsSources.map((source, idx) => {
              const reliabilityBadge = getReliabilityBadge(source.reliability);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => analyzeArticleAlgo({
                    headline: source.headline,
                    source: source.outlet,
                    url: source.url,
                    emoji: '📰',
                    publishedAt: source.publishedAt
                  })}
                >
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className={`text-[10px] font-bold text-white ${getBiasColor(source.biasScore)}`}>
                      {getOutletInitials(source.outlet)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{source.outlet}</span>
                      <Badge className={`text-[9px] px-1 py-0 ${reliabilityBadge.color}`}>
                        {reliabilityBadge.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {source.headline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-xs font-medium ${getBiasTextColor(source.biasScore)}`}>
                      {getBiasLabel(source.biasScore)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(source.publishedAt)}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              );
            }) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No other sources available
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Dynamic SEO */}
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
      />

      {/* News Ticker */}
      {tickerHeadlines.length > 0 && (
        <div className="bg-slate-900 text-white py-2 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...tickerHeadlines, ...tickerHeadlines].map((item, index) => (
              <button
                key={index}
                className="mx-6 flex items-center gap-2 hover:text-blue-300 transition-colors"
                onClick={() => analyzeArticleAlgo(item)}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold">{item.source}:</span>
                <span>{item.headline}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
                Political News Spectrum
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  v{version?.version || '3.4.0'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {version?.versionName || 'UI Enhancement'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Algorithm-Based Analysis
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setView('analytics')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView('authors')}>
                <Users className="w-4 h-4 mr-2" />
                Authors
              </Button>
              <Button variant="outline" size="sm" onClick={() => setView('history')}>
                <Database className="w-4 h-4 mr-2" />
                Archive
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSettingsDialogOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={fetchHeadlines}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* ==================== HEADLINES VIEW ==================== */}
        {view === 'headlines' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content area */}
            <div className="lg:col-span-3 space-y-6">
              {headlinesLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading headlines...</span>
                </div>
              ) : (
                <>
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">Left-Leaning Sources</h2>
                      <Badge variant="outline" className="text-xs">
                        {headlines?.leftHeadlines?.length || 0} articles
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {headlines?.leftHeadlines?.map((headline, idx) => (
                        <EnhancedHeadlineCard
                          key={idx}
                          headline={headline}
                          onAnalyze={analyzeArticleAlgo}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Center Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <h2 className="text-lg font-bold text-gray-600 dark:text-gray-400">Center Sources</h2>
                      <Badge variant="outline" className="text-xs">
                        {headlines?.centerHeadlines?.length || 0} articles
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {headlines?.centerHeadlines?.map((headline, idx) => (
                        <EnhancedHeadlineCard
                          key={idx}
                          headline={headline}
                          onAnalyze={analyzeArticleAlgo}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Right-Leaning Sources</h2>
                      <Badge variant="outline" className="text-xs">
                        {headlines?.rightHeadlines?.length || 0} articles
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {headlines?.rightHeadlines?.map((headline, idx) => (
                        <EnhancedHeadlineCard
                          key={idx}
                          headline={headline}
                          onAnalyze={analyzeArticleAlgo}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Similar Topics */}
                  <SimilarTopicsSection />

                  {/* Other News Sources */}
                  <OtherNewsSourcesSection />
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CoverageDetailsSidebar />
            </div>
          </div>
        )}

        {/* ==================== ANALYSIS VIEW ==================== */}
        {view === 'analysis' && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={resetView}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Headlines
              </Button>
              <div className="flex items-center gap-2">
                {settingsForm.preferences.enableSpeechSynthesis && (
                  <Button variant="outline" size="sm" onClick={speakAnalysis}>
                    {isSpeaking ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isSpeaking ? 'Stop' : 'Speak'}
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={fetchContent}>
                  <Eye className="w-4 h-4 mr-2" />
                  Read Article
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={archiveArticle}
                  disabled={archiving || isArchived}
                >
                  {archiving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : isArchived ? (
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Bookmark className="w-4 h-4 mr-2" />
                  )}
                  {isArchived ? 'Archived' : 'Archive'}
                </Button>
              </div>
            </div>

            {/* Analysis Content - keep existing functionality */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Article Analysis
                  </CardTitle>
                  <CardDescription>
                    {analysis.article.source} • {formatTimeAgo(analysis.article.publishedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h2 className="text-xl font-bold mb-4">{analysis.article.title}</h2>

                  {/* Bias Score Display */}
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Bias Score</span>
                      <span className={`text-2xl font-bold ${getBiasTextColor(analysis.spectrumScore)}`}>
                        {analysis.spectrumScore?.toFixed(1) || 0}
                      </span>
                    </div>
                    <div className={`h-3 rounded-full ${getBiasGradient()}`}>
                      <div
                        className="relative w-1 h-3 bg-black dark:bg-white shadow-md"
                        style={{ left: `${((analysis.spectrumScore + 3) / 6) * 100}%`, position: 'relative' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Left (-3)</span>
                      <span>Center (0)</span>
                      <span>Right (+3)</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {analysis.tags && analysis.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {analysis.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Confidence */}
                  {settingsForm.preferences.showConfidence && analysis.confidence && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Confidence</span>
                        <span>{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                      <Progress value={analysis.confidence * 100} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Evidence Panel */}
              {settingsForm.preferences.showEvidence && analysis.evidence && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Evidence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Topics</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.evidence.topics?.slice(0, 5).map((topic, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Framing Terms</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.evidence.framingTerms?.slice(0, 5).map((item, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={`text-xs ${item.leaning === 'left' ? 'border-blue-500 text-blue-600' : 'border-red-500 text-red-600'}`}
                          >
                            {item.term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Perspectives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-blue-600 dark:text-blue-400">Left Perspective</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {analysis.leftWingPerspective?.summary || 'No analysis available'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-gray-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-gray-600 dark:text-gray-400">Center Perspective</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {analysis.spectrumJustification || 'No analysis available'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-red-600 dark:text-red-400">Right Perspective</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {analysis.rightWingPerspective?.summary || 'No analysis available'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Article Content */}
            {articleContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {articleContent.title}
                  </CardTitle>
                  {articleContent.isPaywalled && (
                    <Badge variant="destructive" className="w-fit">
                      <Lock className="w-3 h-3 mr-1" />
                      Paywalled
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  {articleContent.loading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : articleContent.error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="w-4 h-4" />
                      <AlertDescription>{articleContent.error}</AlertDescription>
                    </Alert>
                  ) : (
                    <ScrollArea className="max-h-96">
                      <div className="prose prose-sm dark:prose-invert">
                        {articleContent.content}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ==================== HISTORY VIEW ==================== */}
        {view === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Archived Articles</h2>
              <Button variant="ghost" onClick={() => setView('headlines')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Filter by source..."
                    value={filters.source}
                    onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                  />
                  <Input
                    placeholder="Filter by category..."
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  />
                  <Button onClick={fetchHistoricArticles}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {historyLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historicArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => analyzeArticleAlgo({
                      headline: article.title,
                      source: article.source,
                      url: article.url,
                      emoji: '📰',
                      publishedAt: article.publishedAt
                    })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-2">{article.title}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(article.publishedAt)}</span>
                          </div>
                        </div>
                        {article.spectrumScore && (
                          <Badge className={getBiasColor(article.spectrumScore) + ' text-white'}>
                            {article.spectrumScore.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== ANALYTICS VIEW ==================== */}
        {view === 'analytics' && analyticsData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <Button variant="ghost" onClick={() => setView('headlines')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Articles</CardDescription>
                  <CardTitle className="text-3xl">{analyticsData.totalArticles}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Analyzed</CardDescription>
                  <CardTitle className="text-3xl">{analyticsData.analyzedArticles}</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart className="w-8 h-8 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Avg Bias Score</CardDescription>
                  <CardTitle className={`text-3xl ${getBiasTextColor(analyticsData.avgBiasScore)}`}>
                    {analyticsData.avgBiasScore.toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Activity className="w-8 h-8 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div className="bg-blue-500" style={{ width: `${(analyticsData.biasDistribution.left / analyticsData.totalArticles) * 100}%` }} />
                    <div className="bg-gray-400" style={{ width: `${(analyticsData.biasDistribution.center / analyticsData.totalArticles) * 100}%` }} />
                    <div className="bg-red-500" style={{ width: `${(analyticsData.biasDistribution.right / analyticsData.totalArticles) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-blue-500">{analyticsData.biasDistribution.left}</span>
                    <span className="text-gray-500">{analyticsData.biasDistribution.center}</span>
                    <span className="text-red-500">{analyticsData.biasDistribution.right}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.topSources.map((source, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className={`text-[10px] ${getBiasColor(source.avgBias)} text-white`}>
                              {getOutletInitials(source.source)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{source.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{source.count} articles</span>
                          <Badge className={`${getBiasColor(source.avgBias)} text-white text-xs`}>
                            {source.avgBias.toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Topic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.topicDistribution.map((topic, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{topic.topic}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(topic.count / analyticsData.totalArticles) * 100} className="w-24 h-2" />
                          <span className="text-sm text-muted-foreground">{topic.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ==================== AUTHORS VIEW ==================== */}
        {view === 'authors' && authorsData && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Author Political Leanings</h2>
              <Button variant="ghost" onClick={() => setView('headlines')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Authors */}
              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Left-Leaning Authors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {authorsData.left.map((author, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {author.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{author.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${getBiasTextColor(author.lean)}`}>
                            {getBiasLabel(author.lean)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Reliability: {author.reliability}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Center Authors */}
              <Card className="border-t-4 border-t-gray-400">
                <CardHeader>
                  <CardTitle className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Minus className="w-5 h-5" />
                    Center Authors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {authorsData.center.map((author, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {author.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{author.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${getBiasTextColor(author.lean)}`}>
                            {getBiasLabel(author.lean)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Reliability: {author.reliability}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Right Authors */}
              <Card className="border-t-4 border-t-red-500">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Right-Leaning Authors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {authorsData.right.map((author, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-red-100 text-red-600">
                          {author.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{author.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${getBiasTextColor(author.lean)}`}>
                            {getBiasLabel(author.lean)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Reliability: {author.reliability}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ==================== SETTINGS VIEW ==================== */}
        {view === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Button variant="ghost" onClick={() => setView('headlines')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <Tabs defaultValue="apikeys">
              <TabsList>
                <TabsTrigger value="apikeys">API Keys</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="apikeys" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      AI Provider API Keys
                    </CardTitle>
                    <CardDescription>
                      Configure API keys for AI-powered analysis. Keys are stored locally and never sent to our servers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <Shield className="w-4 h-4" />
                      <AlertDescription>
                        API keys are stored in your local settings file and .env.local. They are masked in the UI for security.
                      </AlertDescription>
                    </Alert>

                    {[
                      { key: 'openai', label: 'OpenAI / ChatGPT', placeholder: 'sk-...' },
                      { key: 'anthropic', label: 'Anthropic / Claude', placeholder: 'sk-ant-...' },
                      { key: 'kimi', label: 'Moonshot / Kimi', placeholder: 'Enter Kimi API key' },
                      { key: 'zai', label: 'Z.ai', placeholder: 'Enter Z.ai API key' },
                      { key: 'grok', label: 'xAI / Grok', placeholder: 'Enter Grok API key' },
                      { key: 'gemini', label: 'Google Gemini', placeholder: 'Enter Gemini API key' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor={key}>{label}</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id={key}
                              type="password"
                              placeholder={placeholder}
                              value={settingsForm.apiKeys[key as keyof typeof settingsForm.apiKeys]}
                              onChange={(e) => setSettingsForm(prev => ({
                                ...prev,
                                apiKeys: { ...prev.apiKeys, [key]: e.target.value }
                              }))}
                              className="flex-1"
                            />
                            {settings?.hasApiKeys?.[key] && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Set
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => clearApiKey(key)}
                              disabled={!settings?.hasApiKeys?.[key]}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button onClick={saveSettings} disabled={settingsLoading}>
                      {settingsLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save API Keys
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Default Analysis Method</Label>
                        <p className="text-sm text-muted-foreground">Choose between algorithm or AI-powered analysis</p>
                      </div>
                      <select
                        className="border rounded px-3 py-2 bg-background"
                        value={settingsForm.preferences.defaultAnalysisMethod}
                        onChange={(e) => setSettingsForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, defaultAnalysisMethod: e.target.value as 'algorithm' | 'ai' }
                        }))}
                      >
                        <option value="algorithm">Algorithm (Default)</option>
                        <option value="ai">AI-Powered</option>
                      </select>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Evidence Panel</Label>
                        <p className="text-sm text-muted-foreground">Display evidence for bias classification</p>
                      </div>
                      <Switch
                        checked={settingsForm.preferences.showEvidence}
                        onCheckedChange={(checked) => setSettingsForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, showEvidence: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Confidence Score</Label>
                        <p className="text-sm text-muted-foreground">Display analysis confidence percentage</p>
                      </div>
                      <Switch
                        checked={settingsForm.preferences.showConfidence}
                        onCheckedChange={(checked) => setSettingsForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, showConfidence: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Speech Synthesis</Label>
                        <p className="text-sm text-muted-foreground">Enable text-to-speech for analysis</p>
                      </div>
                      <Switch
                        checked={settingsForm.preferences.enableSpeechSynthesis}
                        onCheckedChange={(checked) => setSettingsForm(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, enableSpeechSynthesis: checked }
                        }))}
                      />
                    </div>

                    <Button onClick={saveSettings} disabled={settingsLoading}>
                      {settingsLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="environment" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Environment Variables
                    </CardTitle>
                    <CardDescription>
                      Current environment configuration and database settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">DATABASE_URL:</span>
                        <span className="text-green-600 dark:text-green-400">&quot;file:./dev.db&quot;</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-muted-foreground">Provider:</span>
                        <span>SQLite (Prisma ORM)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Theme Settings
                    </CardTitle>
                    <CardDescription>
                      Customize the appearance of the application
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => document.documentElement.classList.remove('dark')}
                        className="p-4 rounded-lg border-2 hover:border-primary transition-colors bg-white text-foreground flex flex-col items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                        <span className="text-sm font-medium">Light</span>
                      </button>
                      <button
                        onClick={() => document.documentElement.classList.add('dark')}
                        className="p-4 rounded-lg border-2 hover:border-primary transition-colors bg-slate-900 text-white flex flex-col items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                        <span className="text-sm font-medium">Dark</span>
                      </button>
                      <button
                        className="p-4 rounded-lg border-2 hover:border-primary transition-colors bg-gradient-to-b from-white to-slate-900 flex flex-col items-center gap-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-gray-400 to-purple-500" />
                        <span className="text-sm font-medium">System</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About Political Spectrum App</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Political News Spectrum</h3>
                        <p className="text-muted-foreground">Version {version?.version || '3.4.0'}</p>
                        <Badge variant="secondary">{version?.versionName || 'UI Enhancement'}</Badge>
                      </div>
                    </div>
                    <Separator />
                    <p className="text-sm text-muted-foreground">
                      A comprehensive media bias analysis tool that uses AI and algorithmic analysis to detect political
                      leanings in news articles from major outlets. Featuring real-time headlines, bias scoring, and
                      perspective analysis.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quick Settings</DialogTitle>
            <DialogDescription>
              Configure your preferences and API keys
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Evidence Panel</Label>
                <p className="text-sm text-muted-foreground">Display evidence for bias classification</p>
              </div>
              <Switch
                checked={settingsForm.preferences.showEvidence}
                onCheckedChange={(checked) => setSettingsForm(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, showEvidence: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Confidence Score</Label>
                <p className="text-sm text-muted-foreground">Display analysis confidence percentage</p>
              </div>
              <Switch
                checked={settingsForm.preferences.showConfidence}
                onCheckedChange={(checked) => setSettingsForm(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, showConfidence: checked }
                }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Speech Synthesis</Label>
                <p className="text-sm text-muted-foreground">Enable text-to-speech for analysis</p>
              </div>
              <Switch
                checked={settingsForm.preferences.enableSpeechSynthesis}
                onCheckedChange={(checked) => setSettingsForm(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, enableSpeechSynthesis: checked }
                }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSettings} disabled={settingsLoading}>
              {settingsLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Political News Spectrum v{version?.version || '3.4.0'} • {version?.versionName || 'UI Enhancement'}</p>
          <p className="mt-1">Algorithm-based media bias analysis • No AI required for core functionality</p>
        </div>
      </footer>
    </div>
  );
}
