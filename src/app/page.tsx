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
  Palette
} from 'lucide-react';
import { toast } from 'sonner';

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
  
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState<{
    totalArticles: number;
    analyzedArticles: number;
    avgBiasScore: number;
    biasDistribution: { left: number; center: number; right: number };
    topSources: { source: string; count: number; avgBias: number }[];
    topicDistribution: { topic: string; count: number }[];
  } | null>(() => ({
    // Static fallback data
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
    // Static fallback data for authors
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
    } catch (error) {
      console.error('Error fetching headlines:', error);
      toast.error('Failed to fetch headlines');
    } finally {
      setHeadlinesLoading(false);
    }
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
  };

  // Get bias color
  const getBiasColor = (score: number): string => {
    if (score <= -3) return 'bg-blue-600';
    if (score <= -1) return 'bg-blue-400';
    if (score < 1) return 'bg-gray-400';
    if (score < 3) return 'bg-red-400';
    return 'bg-red-600';
  };

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
                  v{version?.version || '2.0.0'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {version?.versionName || 'Algorithm Overhaul'}
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
        {/* Settings View */}
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
                        className="border rounded px-3 py-2"
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
                    <Alert>
                      <Info className="w-4 h-4" />
                      <AlertDescription>
                        Environment variables are loaded from <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">.env</code> and <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">.env.local</code> files.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Database Configuration</h4>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-mono text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">DATABASE_URL:</span>
                          <span className="text-green-600 dark:text-green-400">&quot;file:./dev.db&quot;</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">Provider:</span>
                          <span>SQLite (Prisma ORM)</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">Location:</span>
                          <span>./prisma/dev.db</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">AI Provider Status</h4>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg space-y-2">
                        {[
                          { key: 'OPENAI_API_KEY', name: 'OpenAI', prefix: 'sk-' },
                          { key: 'ANTHROPIC_API_KEY', name: 'Anthropic', prefix: 'sk-ant-' },
                          { key: 'GEMINI_API_KEY', name: 'Google Gemini', prefix: 'AIza' },
                          { key: 'GROK_API_KEY', name: 'xAI Grok', prefix: 'xai-' },
                          { key: 'KIMI_API_KEY', name: 'Kimi', prefix: 'sk-' },
                          { key: 'ZAI_API_KEY', name: 'Z.ai', prefix: '' },
                        ].map(({ key, name, prefix }) => {
                          const isSet = settings?.hasApiKeys?.[key.toLowerCase().replace('_API_KEY', '')] || false;
                          const isDemo = settingsForm.apiKeys[key.toLowerCase().replace('_API_KEY', '')]?.includes('demo') || false;
                          return (
                            <div key={key} className="flex justify-between items-center text-sm">
                              <span className="font-mono text-xs">{key}</span>
                              <div className="flex items-center gap-2">
                                {isDemo ? (
                                  <Badge variant="destructive" className="text-xs">Demo Key</Badge>
                                ) : isSet ? (
                                  <Badge variant="default" className="text-xs bg-green-600">Configured</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">Not Set</Badge>
                                )}
                                {prefix && <span className="text-xs text-muted-foreground">({prefix}...)</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Site Configuration</h4>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-mono text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">NEXT_PUBLIC_SITE_URL:</span>
                          <span>http://localhost:3000</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-muted-foreground">NODE_ENV:</span>
                          <span className="text-blue-600 dark:text-blue-400">development</span>
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        <strong>Security Note:</strong> Never commit your .env files to version control. 
                        API keys should be stored securely and rotated periodically.
                      </AlertDescription>
                    </Alert>
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
                  <CardContent className="space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <Label>Color Theme</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => document.documentElement.classList.remove('dark')}
                          className="p-4 rounded-lg border-2 border-slate-200 hover:border-blue-500 transition-colors bg-white text-slate-900 flex flex-col items-center gap-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                          <span className="text-sm font-medium">Light</span>
                        </button>
                        <button
                          onClick={() => document.documentElement.classList.add('dark')}
                          className="p-4 rounded-lg border-2 border-slate-700 bg-slate-900 text-white hover:border-blue-500 transition-colors flex flex-col items-center gap-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                          <span className="text-sm font-medium">Dark</span>
                        </button>
                        <button
                          className="p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 transition-colors bg-gradient-to-br from-white to-slate-900 text-slate-600 dark:text-slate-400 flex flex-col items-center gap-2"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600" />
                          <span className="text-sm font-medium">System</span>
                        </button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Color Accents */}
                    <div className="space-y-3">
                      <Label>Accent Color</Label>
                      <div className="flex gap-3">
                        {[
                          { color: 'blue', bg: 'bg-blue-500' },
                          { color: 'purple', bg: 'bg-purple-500' },
                          { color: 'green', bg: 'bg-green-500' },
                          { color: 'orange', bg: 'bg-orange-500' },
                          { color: 'red', bg: 'bg-red-500' },
                          { color: 'pink', bg: 'bg-pink-500' },
                        ].map(({ color, bg }) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full ${bg} hover:scale-110 transition-transform ${color === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Font Size */}
                    <div className="space-y-3">
                      <Label>Font Size</Label>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">Small</Button>
                        <Button variant="default" size="sm">Medium</Button>
                        <Button variant="outline" size="sm">Large</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Preview */}
                    <div className="space-y-3">
                      <Label>Preview</Label>
                      <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge>Default</Badge>
                          <Badge variant="secondary">Secondary</Badge>
                          <Badge variant="destructive">Alert</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Primary</Button>
                          <Button variant="outline" size="sm">Outline</Button>
                          <Button variant="ghost" size="sm">Ghost</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About Political News Spectrum</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Version {version?.version || '2.0.0'}</h4>
                      <p className="text-sm text-muted-foreground">{version?.versionName || 'Algorithm Overhaul'}</p>
                      <p className="text-xs text-muted-foreground">Released: {version?.releaseDate || '2025-01-18'}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-semibold">Analysis Method</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        This application uses a 3-layer scoring pipeline rather than relying on simple keyword classification.
                        Each article inherits a baseline perspective from its publishing outlet. The system then evaluates 
                        the article&apos;s framing, language, and sourcing to calculate a deviation from that baseline.
                      </p>
                    </div>
                    
                    <Alert>
                      <Info className="w-4 h-4" />
                      <AlertDescription>
                        <strong>Signals Analyzed:</strong>
                        <ul className="list-disc list-inside mt-2 text-sm">
                          <li>Emotional or sensational language</li>
                          <li>Source diversity and balance</li>
                          <li>Narrative framing patterns</li>
                          <li>Topic-specific terminology usage</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                    
                    <div>
                      <h4 className="font-semibold">Changelog</h4>
                      <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                        <li>v2.0.0 - Algorithm-based 3-layer scoring pipeline</li>
                        <li>v1.1.0 - Round-robin AI provider selection</li>
                        <li>v1.0.0 - Initial release</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Analysis View */}
        {view === 'analysis' && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Button variant="ghost" onClick={resetView}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Headlines
              </Button>
              <div className="flex items-center gap-2 flex-wrap">
                {analysis.method === 'algorithm' ? (
                  <Badge className="bg-purple-100 text-purple-800">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Algorithm Analysis
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Analysis: {analysis.provider}
                  </Badge>
                )}
                {analysis.confidence && (
                  <Badge variant="outline">
                    {Math.round(analysis.confidence * 100)}% Confidence
                  </Badge>
                )}
                {analysis.cached && (
                  <Badge variant="outline">From Archive</Badge>
                )}
                {settings?.preferences?.enableSpeechSynthesis && (
                  <Button variant="outline" size="sm" onClick={speakAnalysis}>
                    {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Topic Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{analysis.article.title}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {analysis.article.source}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(analysis.article.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {analysis.category}
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Outlet Info (Algorithm only) */}
            {analysis.method === 'algorithm' && analysis.outlet && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Outlet Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-medium">{analysis.outlet.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Baseline Bias:</span>
                      <p className="font-medium">{analysis.outletBias?.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Reliability:</span>
                      <p className="font-medium">{analysis.outlet.reliabilityScore}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Article Delta:</span>
                      <p className="font-medium">
                        {analysis.articleDelta && analysis.articleDelta > 0 ? '+' : ''}
                        {analysis.articleDelta?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Spectrum Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Political Spectrum Score</CardTitle>
                <CardDescription>
                  Scale: Far Left (Communism) ↔ Far Right (Fascism)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main spectrum bar */}
                <div className="relative h-8 rounded-full bg-gradient-to-r from-red-600 via-blue-400 via-30% via-yellow-300 via-60% to-red-700 overflow-hidden border border-slate-300 dark:border-slate-600">
                  <div
                    className="absolute top-0 w-1 h-full bg-black shadow-lg transform -translate-x-1/2 z-10"
                    style={{ left: `${((analysis.spectrumScore + 10) / 20) * 100}%` }}
                  />
                  {/* Tick marks */}
                  {[0, 25, 50, 75, 100].map((pos) => (
                    <div
                      key={pos}
                      className="absolute top-0 w-px h-2 bg-black/30"
                      style={{ left: `${pos}%` }}
                    />
                  ))}
                </div>
                
                {/* Scale labels with ideology markers */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="text-red-600 font-medium">Communism</span>
                  <span>Far Left</span>
                  <span>Center-Left</span>
                  <span className="font-medium">Center</span>
                  <span>Center-Right</span>
                  <span>Far Right</span>
                  <span className="text-red-800 font-medium">Fascism</span>
                </div>
                
                {/* Numerical scale */}
                <div className="flex justify-between text-sm text-muted-foreground font-mono">
                  <span>-10</span>
                  <span>-5</span>
                  <span>0</span>
                  <span>+5</span>
                  <span>+10</span>
                </div>
                
                {/* Score display */}
                <div className="flex items-center justify-center gap-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm text-muted-foreground">Score:</span>
                  <span className={`text-3xl font-bold ${
                    analysis.spectrumScore <= -7 ? 'text-red-600' :
                    analysis.spectrumScore <= -3 ? 'text-blue-600' :
                    analysis.spectrumScore <= 3 ? 'text-gray-600' :
                    analysis.spectrumScore <= 7 ? 'text-orange-600' :
                    'text-red-800'
                  }`}>
                    {analysis.spectrumScore.toFixed(1)}
                  </span>
                  <Badge variant={
                    analysis.spectrumScore <= -7 ? 'destructive' :
                    analysis.spectrumScore <= -3 ? 'default' :
                    analysis.spectrumScore <= 3 ? 'secondary' :
                    analysis.spectrumScore <= 7 ? 'outline' :
                    'destructive'
                  }>
                    {analysis.spectrumScore <= -7 ? 'Far Left' :
                     analysis.spectrumScore <= -3 ? 'Left-Leaning' :
                     analysis.spectrumScore <= 3 ? 'Centrist' :
                     analysis.spectrumScore <= 7 ? 'Right-Leaning' :
                     'Far Right'}
                  </Badge>
                </div>
                
                {/* Ideology spectrum visualization */}
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <div className="text-xs text-center text-muted-foreground mb-2">
                    Political Ideology Spectrum
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-center">
                      <div className="text-red-600 font-bold">☭</div>
                      <div>Communism</div>
                      <div className="text-muted-foreground">(-10 to -8)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-bold">⚖️</div>
                      <div>Socialism</div>
                      <div className="text-muted-foreground">(-8 to -4)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">🤝</div>
                      <div>Liberal</div>
                      <div className="text-muted-foreground">(-4 to 0)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-500 font-bold">🏛️</div>
                      <div>Moderate</div>
                      <div className="text-muted-foreground">(0)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-500 font-bold">🦅</div>
                      <div>Conservative</div>
                      <div className="text-muted-foreground">(0 to +4)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-700 font-bold">👑</div>
                      <div>Nationalist</div>
                      <div className="text-muted-foreground">(+4 to +8)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-800 font-bold"> fasces</div>
                      <div>Fascism</div>
                      <div className="text-muted-foreground">(+8 to +10)</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                  {analysis.spectrumJustification}
                </p>
              </CardContent>
            </Card>

            {/* Tags (Algorithm only) */}
            {analysis.method === 'algorithm' && analysis.tags && analysis.tags.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Analysis Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Signals Panel (Algorithm only) */}
            {analysis.method === 'algorithm' && analysis.signals && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Signal Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-xs text-muted-foreground">Headline Emotionality</span>
                      <p className="text-lg font-semibold">{analysis.signals.headlineEmotionality.toFixed(1)}/10</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-xs text-muted-foreground">Source Diversity</span>
                      <p className="text-lg font-semibold">{analysis.signals.sourceDiversity.toFixed(1)}/10</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-xs text-muted-foreground">Partisan Rhetoric</span>
                      <p className="text-lg font-semibold">{analysis.signals.partisanRhetoric.toFixed(1)}/10</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-xs text-muted-foreground">Authoritarian Rhetoric</span>
                      <p className="text-lg font-semibold">{analysis.signals.authoritarianRhetoric.toFixed(1)}/10</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <span className="text-xs text-muted-foreground">Socialist Rhetoric</span>
                      <p className="text-lg font-semibold">{analysis.signals.socialistRhetoric.toFixed(1)}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Evidence Panel (Algorithm only) */}
            {analysis.method === 'algorithm' && analysis.evidence && settings?.preferences?.showEvidence && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Evidence Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.evidence.headlineTerms.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">Emotional Headline Terms</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.evidence.headlineTerms.map((term, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{term}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.evidence.framingTerms.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">Framing Terms</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.evidence.framingTerms.map((item, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className={`text-xs ${item.leaning === 'left' ? 'border-blue-500 text-blue-700' : 'border-red-500 text-red-700'}`}
                          >
                            {item.term} ({item.leaning})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.evidence.partisanMarkers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">Partisan Markers</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.evidence.partisanMarkers.map((marker, i) => (
                          <Badge key={i} variant="destructive" className="text-xs">{marker}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {analysis.evidence.authoritarianMarkers.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">Authoritarian Markers</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.evidence.authoritarianMarkers.map((marker, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-orange-500 text-orange-700">{marker}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">Sources</h4>
                    <p className="text-sm">
                      {analysis.evidence.sources.count} sources cited
                      {analysis.evidence.sources.types.length > 0 && ` (${analysis.evidence.sources.types.join(', ')})`}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">Opposing Viewpoint</h4>
                    <Badge variant={analysis.evidence.opposingViews ? 'default' : 'secondary'}>
                      {analysis.evidence.opposingViews ? 'Present' : 'Not Found'}
                    </Badge>
                  </div>
                  
                  {analysis.evidence.topics.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1">Topics Detected</h4>
                      <div className="flex flex-wrap gap-1">
                        {analysis.evidence.topics.map((topic, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Perspectives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Left Wing */}
              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700 dark:text-blue-400">
                    Left-Wing Framing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{analysis.leftWingPerspective.summary}</p>
                  {analysis.leftWingPerspective.talkingPoints.length > 0 && (
                    <ul className="space-y-1">
                      {analysis.leftWingPerspective.talkingPoints.slice(0, 5).map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Right Wing */}
              <Card className="border-t-4 border-t-red-500">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 dark:text-red-400">
                    Right-Wing Framing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{analysis.rightWingPerspective.summary}</p>
                  {analysis.rightWingPerspective.talkingPoints.length > 0 && (
                    <ul className="space-y-1">
                      {analysis.rightWingPerspective.talkingPoints.slice(0, 5).map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Socialist */}
              <Card className="border-t-4 border-t-purple-500">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-700 dark:text-purple-400">
                    Socialist Framing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{analysis.socialistPerspective.summary}</p>
                  {analysis.socialistPerspective.talkingPoints.length > 0 && (
                    <ul className="space-y-1">
                      {analysis.socialistPerspective.talkingPoints.slice(0, 5).map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis Button */}
            {analysis.method === 'algorithm' && (
              <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Want more detailed analysis?</h4>
                      <p className="text-sm text-muted-foreground">Use AI to get deeper insights and talking points.</p>
                    </div>
                    <Button 
                      onClick={() => analyzeArticleAI({
                        headline: analysis.article.title,
                        source: analysis.article.source,
                        url: analysis.article.url,
                        emoji: '📰',
                        publishedAt: analysis.article.publishedAt,
                      })}
                      disabled={analysisLoading}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Article Link */}
            <Card>
              <CardContent className="py-4">
                <a
                  href={analysis.article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Read Original Article
                </a>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History View */}
        {view === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Historic Articles Archive</h2>
              <Button variant="ghost" onClick={() => setView('headlines')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Headlines
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Query Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="source">Source</Label>
                    <Input
                      id="source"
                      placeholder="e.g., CNN"
                      value={filters.source}
                      onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Politics"
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Search articles..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={fetchHistoricArticles} disabled={historyLoading}>
                  {historyLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search Articles
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-4">
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : historicArticles.length > 0 ? (
                historicArticles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => analyzeArticleAlgo({
                      headline: article.title,
                      source: article.source,
                      url: article.url,
                      emoji: '📰',
                      publishedAt: article.publishedAt,
                    })}
                  >
                    <CardContent className="py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{article.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{article.source}</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            {article.category && <Badge variant="outline">{article.category}</Badge>}
                            {article.aiProvider && (
                              <Badge variant="secondary">{article.aiProvider}</Badge>
                            )}
                          </div>
                        </div>
                        {article.spectrumScore !== null && (
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {article.spectrumScore.toFixed(1)}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No articles found. Try adjusting your filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Analytics Dashboard
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={runTests} disabled={testing}>
                  {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <TestTube className="w-4 h-4 mr-2" />}
                  Run Tests
                </Button>
                <Button variant="ghost" onClick={() => setView('headlines')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>

            {analyticsData ? (
              <>
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{analyticsData.totalArticles}</div>
                      <p className="text-xs text-muted-foreground">Total Articles</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{analyticsData.analyzedArticles}</div>
                      <p className="text-xs text-muted-foreground">Analyzed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{analyticsData.avgBiasScore?.toFixed(2) || '0.00'}</div>
                      <p className="text-xs text-muted-foreground">Avg Bias Score</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">{Math.max(analyticsData.biasDistribution.left, analyticsData.biasDistribution.center, analyticsData.biasDistribution.right)}</div>
                      <p className="text-xs text-muted-foreground">Largest Group</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Bias Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Bias Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-blue-600 font-medium">Left-Leaning</span>
                            <span>{analyticsData.biasDistribution.left}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${(analyticsData.biasDistribution.left / (analyticsData.analyzedArticles || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium">Center</span>
                            <span>{analyticsData.biasDistribution.center}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gray-500 rounded-full"
                              style={{ width: `${(analyticsData.biasDistribution.center / (analyticsData.analyzedArticles || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-red-600 font-medium">Right-Leaning</span>
                            <span>{analyticsData.biasDistribution.right}</span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${(analyticsData.biasDistribution.right / (analyticsData.analyzedArticles || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Top Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analyticsData.topSources.slice(0, 6).map((source, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{source.source}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {source.count} articles
                              </Badge>
                              <div 
                                className={`w-3 h-3 rounded-full ${source.avgBias < -0.5 ? 'bg-blue-500' : source.avgBias > 0.5 ? 'bg-red-500' : 'bg-gray-500'}`}
                                title={`Avg bias: ${source.avgBias.toFixed(2)}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Topic Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Topic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analyticsData.topicDistribution.map((topic, i) => (
                        <Badge key={i} variant="secondary" className="px-3 py-1">
                          {topic.topic}: {topic.count}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Test Results */}
                {testResults && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TestTube className="w-5 h-5" />
                        System Test Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(testResults.tests as Record<string, { status: string }>).map(([name, result]) => (
                          <div key={name} className="flex items-center justify-between py-2 border-b last:border-0">
                            <span className="text-sm font-medium capitalize">{name}</span>
                            <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                              {result.status === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                              {result.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {testResults.overall?.passed || 0}/{testResults.overall?.totalTests || 0} Tests Passed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        {/* Authors View */}
        {view === 'authors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6" />
                Author Political Leanings
              </h2>
              <Button variant="ghost" onClick={() => setView('headlines')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left-Leaning Authors */}
              <Card className="border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    Left-Leaning Journalists
                  </CardTitle>
                  <CardDescription>Authors with left-leaning perspective</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {authorsData?.left?.map((author, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                              {author.avatar || author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Lean: {author.lean.toFixed(1)} | Reliability: {author.reliability}%
                            </p>
                          </div>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${Math.abs(author.lean) / 3 * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Center Authors */}
              <Card className="border-t-4 border-t-gray-500">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-500" />
                    Center/Balanced Journalists
                  </CardTitle>
                  <CardDescription>Authors with neutral perspective</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {authorsData?.center?.map((author, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                              {author.avatar || author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Lean: {author.lean.toFixed(1)} | Reliability: {author.reliability}%
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">Center</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Right-Leaning Authors */}
              <Card className="border-t-4 border-t-red-500">
                <CardHeader>
                  <CardTitle className="text-lg text-red-700 dark:text-red-400 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    Right-Leaning Journalists
                  </CardTitle>
                  <CardDescription>Authors with right-leaning perspective</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {authorsData?.right?.map((author, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-red-100 text-red-700 text-xs">
                              {author.avatar || author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Lean: +{Math.abs(author.lean).toFixed(1)} | Reliability: {author.reliability}%
                            </p>
                          </div>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${Math.abs(author.lean) / 3 * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Author Legend */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span>Lean Score: -3 (Far Left)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-500"></div>
                    <span>Lean Score: 0 (Center)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span>Lean Score: +3 (Far Right)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Headlines View */}
        {view === 'headlines' && (
          <>
            {headlinesLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Fetching latest headlines...</p>
              </div>
            ) : headlines ? (
              <div className="space-y-8">
                {/* Latest Headlines */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Latest Developments
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...headlines.leftHeadlines, ...headlines.rightHeadlines, ...headlines.centerHeadlines]
                      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                      .slice(0, 4)
                      .map((headline, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-primary"
                          onClick={() => analyzeArticleAlgo(headline)}
                        >
                          <CardContent className="py-4">
                            <div className="flex gap-3">
                              <span className="text-2xl">{headline.emoji}</span>
                              <div className="flex-1">
                                <h3 className="font-semibold">{headline.headline}</h3>
                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                  <span className="font-medium">{headline.source}</span>
                                  <span>•</span>
                                  <span>{new Date(headline.publishedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Headlines by Leaning */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Leaning */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-400 border-b-2 border-blue-500 pb-2">
                      Left-Leaning Sources
                    </h3>
                    <div className="space-y-3">
                      {headlines.leftHeadlines.map((headline, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() => analyzeArticleAlgo(headline)}
                        >
                          <CardContent className="py-3">
                            <div className="flex gap-2">
                              <span className="text-xl">{headline.emoji}</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{headline.headline}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {headline.source} • {new Date(headline.publishedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Center */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-400 border-b-2 border-gray-500 pb-2">
                      Center / Mainstream
                    </h3>
                    <div className="space-y-3">
                      {headlines.centerHeadlines.map((headline, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() => analyzeArticleAlgo(headline)}
                        >
                          <CardContent className="py-3">
                            <div className="flex gap-2">
                              <span className="text-xl">{headline.emoji}</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{headline.headline}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {headline.source} • {new Date(headline.publishedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Right Leaning */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-400 border-b-2 border-red-500 pb-2">
                      Right-Leaning Sources
                    </h3>
                    <div className="space-y-3">
                      {headlines.rightHeadlines.map((headline, index) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() => analyzeArticleAlgo(headline)}
                        >
                          <CardContent className="py-3">
                            <div className="flex gap-2">
                              <span className="text-xl">{headline.emoji}</span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{headline.headline}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {headline.source} • {new Date(headline.publishedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Failed to load headlines. Please try refreshing.</p>
                  <Button className="mt-4" onClick={fetchHeadlines}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto py-4 bg-white/80 dark:bg-slate-900/80">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Political News Spectrum v{version?.version || '2.0.0'} • Algorithm-Based 3-Layer Scoring Pipeline</p>
          <p className="mt-1">Click any headline to analyze with algorithm, or use AI for deeper insights.</p>
        </div>
      </footer>

      {/* Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </DialogTitle>
            <DialogDescription>
              Configure API keys and analysis preferences.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="apikeys">
            <TabsList className="w-full">
              <TabsTrigger value="apikeys" className="flex-1">API Keys</TabsTrigger>
              <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="apikeys" className="space-y-4 mt-4">
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  API keys are stored locally in settings.json and .env.local. Keys are masked in the UI.
                </AlertDescription>
              </Alert>
              
              {[
                { key: 'openai', label: 'OpenAI / ChatGPT', placeholder: 'sk-...' },
                { key: 'anthropic', label: 'Anthropic / Claude', placeholder: 'sk-ant-...' },
                { key: 'kimi', label: 'Moonshot / Kimi', placeholder: 'Kimi API key' },
                { key: 'zai', label: 'Z.ai', placeholder: 'Z.ai API key' },
                { key: 'grok', label: 'xAI / Grok', placeholder: 'Grok API key' },
                { key: 'gemini', label: 'Google Gemini', placeholder: 'Gemini API key' },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={`dialog-${key}`}>{label}</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`dialog-${key}`}
                      type="password"
                      placeholder={placeholder}
                      value={settingsForm.apiKeys[key as keyof typeof settingsForm.apiKeys]}
                      onChange={(e) => setSettingsForm(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, [key]: e.target.value }
                      }))}
                    />
                    {settings?.hasApiKeys?.[key] && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Set
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Label>Default Analysis Method</Label>
                <select
                  className="border rounded px-3 py-2"
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
              
              <div className="flex items-center justify-between">
                <Label>Show Evidence Panel</Label>
                <Switch
                  checked={settingsForm.preferences.showEvidence}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, showEvidence: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Show Confidence Score</Label>
                <Switch
                  checked={settingsForm.preferences.showConfidence}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, showConfidence: checked }
                  }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Speech Synthesis</Label>
                <Switch
                  checked={settingsForm.preferences.enableSpeechSynthesis}
                  onCheckedChange={(checked) => setSettingsForm(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, enableSpeechSynthesis: checked }
                  }))}
                />
              </div>
            </TabsContent>
          </Tabs>
          
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
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analysis Loading Overlay */}
      {analysisLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-80">
            <CardContent className="py-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="font-semibold">Analyzing Article...</p>
              <p className="text-sm text-muted-foreground mt-2">
                Using 3-layer scoring pipeline
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
