'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Sparkles, ThumbsUp, ThumbsDown, Maximize2, TrendingUp, Users, DollarSign, Activity, Sun, Moon, MoreVertical, Trash2, Mic, Upload, Pause as PauseIcon, Play, StopCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';

interface FixframeAIProps {
  show: boolean;
  onClose: () => void;
}

// Dashboard component interface
interface DashboardComponent {
  id: string;
  type: string;
  title: string;
  colSpan: number;
  rowSpan: number;
  data?: any;
}

// Chat message interface
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  showLoader?: boolean;
  showTyping?: boolean;
  showPreview?: boolean;
}

export default function FixframeAI({ show, onClose }: FixframeAIProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLayout, setGeneratedLayout] = useState<JSX.Element | null>(null);
  const [showDashboardModal, setShowDashboardModal] = useState(false);
  const [detectedComponents, setDetectedComponents] = useState<string[]>([]);
  const [currentThinkingText, setCurrentThinkingText] = useState('✨ Analyzing your request...');
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showShimmer, setShowShimmer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [memoryContext, setMemoryContext] = useState<{ lastQuery?: string; filters?: Record<string, string>; timeRange?: string; importanceHints?: string[] }>({});
  const [brandTheme, setBrandTheme] = useState<{ primary?: string; secondary?: string; accent?: string; font?: string; logoUrl?: string }>({});
  const [showIframeCode, setShowIframeCode] = useState<string | null>(null);
  
  // New dashboard state
  const [hasDashboard, setHasDashboard] = useState(false);
  const [dashboardComponents, setDashboardComponents] = useState<DashboardComponent[]>([]);
  const [nextGridPosition, setNextGridPosition] = useState({ row: 1, col: 1 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const dashboardModalContentRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cancelTypingRef = useRef<boolean>(false);

  // Clear chat function
  const clearChat = () => {
    setChatMessages([{
      id: '1',
      type: 'ai',
      content: '👋 Hi! I\'m Fixframe AI, your dashboard design assistant. I can help you create beautiful dashboards with charts, tables, and components. Try saying "create a dashboard with bar chart and donut chart" or "add a table to my dashboard".',
      timestamp: new Date()
    }]);
    setHasDashboard(false);
    setDashboardComponents([]);
    setNextGridPosition({ row: 1, col: 1 });
    setShowMenu(false);
  };

  // Resolve API base robustly

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu) {
        const target = event.target as Element;
        // Check if click is outside the menu
        if (!target.closest('[data-menu="true"]')) {
          setShowMenu(false);
        }
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Mock data for charts
  const mockData = {
    bar: [
      { name: 'Jan', value: 4000, color: '#3B82F6' },
      { name: 'Feb', value: 3000, color: '#3B82F6' },
      { name: 'Mar', value: 2000, color: '#3B82F6' },
      { name: 'Apr', value: 2780, color: '#3B82F6' },
      { name: 'May', value: 1890, color: '#3B82F6' },
      { name: 'Jun', value: 2390, color: '#3B82F6' }
    ],
    line: [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 }
    ],
    area: [
      { name: 'Jan', value: 4000 },
      { name: 'Feb', value: 3000 },
      { name: 'Mar', value: 2000 },
      { name: 'Apr', value: 2780 },
      { name: 'May', value: 1890 },
      { name: 'Jun', value: 2390 }
    ],
    donut: [
      { name: 'Desktop', value: 400, color: '#3B82F6' },
      { name: 'Mobile', value: 300, color: '#10B981' },
      { name: 'Tablet', value: 200, color: '#F59E0B' },
      { name: 'Other', value: 100, color: '#EF4444' }
    ],
    multiBar: [
      { name: 'Jan', series1: 4000, series2: 2400, series3: 2400 },
      { name: 'Feb', series1: 3000, series2: 1398, series3: 2210 },
      { name: 'Mar', series1: 2000, series2: 9800, series3: 2290 },
      { name: 'Apr', series1: 2780, series2: 3908, series3: 2000 },
      { name: 'May', series1: 1890, series2: 4800, series3: 2181 },
      { name: 'Jun', series1: 2390, series2: 3800, series3: 2500 }
    ],
    combo: [
      { name: 'Jan', barValue: 4000, lineValue: 2400 },
      { name: 'Feb', barValue: 3000, lineValue: 1398 },
      { name: 'Mar', barValue: 2000, lineValue: 9800 },
      { name: 'Apr', barValue: 2780, lineValue: 3908 },
      { name: 'May', barValue: 1890, lineValue: 4800 },
      { name: 'Jun', barValue: 2390, lineValue: 3800 }
    ]
  };

  // Simple CSV parser (no dependencies)
  const parseCSV = (text: string): { headers: string[]; rows: Record<string, string>[] } => {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const cols = line.split(',');
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = (cols[i] || '').trim(); });
      return obj;
    });
    return { headers, rows };
  };

  // Recommend chart type based on detected fields
  const recommendChartType = (headers: string[]): 'bar chart' | 'line chart' | 'area chart' | 'donut chart' | 'combo chart' | 'multi bar chart' => {
    const lower = headers.map(h => h.toLowerCase());
    const hasTime = lower.some(h => ['date', 'month', 'week', 'day', 'time', 'period'].includes(h));
    const metricCount = lower.filter(h => !['category', 'region', 'name', 'label'].includes(h) && h !== 'date' && h !== 'month').length;
    if (hasTime && metricCount >= 2) return 'combo chart';
    if (hasTime) return 'line chart';
    if (lower.includes('region') || lower.includes('category') || lower.includes('name')) {
      return metricCount > 1 ? 'multi bar chart' : 'bar chart';
    }
    return 'bar chart';
  };

  // Generate mock dataset and pseudo SQL from NL query
  const generateDataFromQuery = (query: string): { sql: string; data: any[]; headers: string[]; title: string } => {
    const q = query.toLowerCase();
    const timeMatch = q.match(/last\s+(\d+)\s*(months|weeks|days|quarters)/);
    const periodCount = timeMatch ? parseInt(timeMatch[1], 10) : 6;
    const periodUnit = timeMatch ? timeMatch[2] : 'months';
    const byRegion = /by\s+region/.test(q);
    const byCategory = /by\s+category/.test(q);
    const metric = (q.match(/(sales|revenue|users|sessions|orders|profit)/) || [])[1] || 'sales';

    const headers = byRegion ? ['month', 'region', 'value'] : byCategory ? ['month', 'category', 'value'] : ['month', 'value'];
    const regions = ['North', 'South', 'East', 'West'];
    const categories = ['A', 'B', 'C', 'D'];
    const now = new Date();
    const months = Array.from({ length: periodCount }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (periodCount - 1 - i), 1);
      return d.toLocaleString('default', { month: 'short' });
    });
    const data: any[] = [];
    if (headers.includes('region')) {
      months.forEach(m => {
        regions.forEach(r => {
          data.push({ month: m, region: r, value: Math.floor(1000 + Math.random() * 5000) });
        });
      });
    } else if (headers.includes('category')) {
      months.forEach(m => {
        categories.forEach(c => {
          data.push({ month: m, category: c, value: Math.floor(200 + Math.random() * 1200) });
        });
      });
    } else {
      months.forEach(m => data.push({ month: m, value: Math.floor(1000 + Math.random() * 5000) }));
    }

    const sql = `SELECT ${headers.join(', ')} FROM ${metric}_table WHERE date >= DATEADD(${periodUnit.toUpperCase()}, -${periodCount}, GETDATE())` + (byRegion ? ' GROUP BY month, region' : byCategory ? ' GROUP BY month, category' : '');
    const title = `${metric.charAt(0).toUpperCase() + metric.slice(1)} ${byRegion ? 'by Region' : byCategory ? 'by Category' : ''} (${periodCount} ${periodUnit})`;
    return { sql, data, headers, title };
  };

  // Explain simple insights from a time series dataset
  const generateInsights = (rows: any[], headers: string[]): string[] => {
    const insights: string[] = [];
    const hasMonth = headers.includes('month');
    const hasValue = headers.includes('value');
    if (hasMonth && hasValue) {
      const series = rows.filter(r => r.value != null).map(r => ({ m: r.month, v: Number(r.value) }));
      if (series.length >= 2) {
        const first = series[0].v;
        const last = series[series.length - 1].v;
        const change = ((last - first) / Math.max(1, first)) * 100;
        insights.push(`Trend: ${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(1)}% from ${series[0].m} to ${series[series.length - 1].m}.`);
        const maxPoint = series.reduce((a, b) => (b.v > a.v ? b : a));
        insights.push(`Peak: ${maxPoint.m} had the highest value (${maxPoint.v}).`);
      }
    }
    if (headers.includes('region')) {
      const byRegion: Record<string, number> = {};
      rows.forEach(r => { byRegion[r.region] = (byRegion[r.region] || 0) + Number(r.value || 0); });
      const entries = Object.entries(byRegion);
      if (entries.length) {
        const top = entries.sort((a, b) => b[1] - a[1])[0];
        insights.push(`Top region: ${top[0]} leads with total ${top[1].toLocaleString()}.`);
      }
    }
    return insights;
  };

  // Export helpers
  const exportDashboardPNG = async () => {
    const node = dashboardModalContentRef.current;
    if (!node) return;
    const canvas = await html2canvas(node);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'dashboard.png';
    link.click();
  };

  const exportDashboardCSV = () => {
    if (dashboardComponents.length === 0) return;
    const lines: string[] = [];
    dashboardComponents.forEach(c => {
      if (Array.isArray(c.data) && c.data.length > 0) {
        const headers = Object.keys(c.data[0]);
        lines.push(`# ${c.title}`);
        lines.push(headers.join(','));
        c.data.forEach((row: any) => {
          lines.push(headers.map(h => row[h]).join(','));
        });
        lines.push('');
      }
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareAsLink = () => {
    const state = { components: dashboardComponents, theme: isDarkMode ? 'dark' : 'light' };
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
    const link = `${window.location.origin}${window.location.pathname}?dashboard=${encoded}`;
    navigator.clipboard?.writeText(link);
    alert('Share link copied to clipboard');
  };

  const generateIframeCode = () => {
    const state = { components: dashboardComponents, theme: isDarkMode ? 'dark' : 'light' };
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(state)))));
    const link = `${window.location.origin}${window.location.pathname}?dashboard=${encoded}`;
    const iframe = `<iframe src="${link}" style="width:100%;height:600px;border:0;" allowfullscreen></iframe>`;
    setShowIframeCode(iframe);
  };

  // Chart rendering functions
  const renderBarChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value">
          {data.map((entry, index) => {
            const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#22D3EE', '#84CC16', '#F97316'];
            const fillColor = entry?.color || palette[index % palette.length];
            return <Cell key={`cell-bar-${index}`} fill={fillColor} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLineChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderAreaChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderDonutChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => {
            const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#22D3EE', '#84CC16', '#F97316'];
            const fillColor = entry?.color || palette[index % palette.length];
            return <Cell key={`cell-${index}`} fill={fillColor} />;
          })}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderMultiBarChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="series1" fill="#3B82F6" />
        <Bar dataKey="series2" fill="#10B981" />
        <Bar dataKey="series3" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderComboChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="barValue">
          {data.map((entry, index) => {
            const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#22D3EE', '#84CC16', '#F97316'];
            const fillColor = entry?.barColor || palette[index % palette.length];
            return <Cell key={`cell-combo-bar-${index}`} fill={fillColor} />;
          })}
        </Bar>
        <Line type="monotone" dataKey="lineValue" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  // Chat messages state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai' as const,
      content: '👋 Hi! I\'m Fixframe AI, your dashboard assistant. I can help you create professional analytics dashboards with real charts and components. Try saying "create a dashboard with bar chart and donut chart" to get started!',
      timestamp: new Date()
    }
  ]);
  const [currentMessageId, setCurrentMessageId] = useState(2);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Thinking text rotation effect
  useEffect(() => {
    const thinkingTexts = [
      "✨ Analyzing your request...",
      "🎨 Designing the layout...",
      "⚡ Generating components...",
      "🔧 Building the dashboard...",
      "📊 Adding charts and data...",
      "🎯 Finalizing the design..."
    ];

    const interval = setInterval(() => {
      setCurrentThinkingText(prev => {
        const currentIndex = thinkingTexts.indexOf(prev);
        return thinkingTexts[(currentIndex + 1) % thinkingTexts.length];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Typing animation function
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const typeText = async (text: string, messageId: string) => {
    setIsTyping(true);
    setTypingText('');
    cancelTypingRef.current = false;
    
    for (let i = 0; i < text.length; i++) {
      if (cancelTypingRef.current) {
        setIsTyping(false);
        return;
      }
      while (isPaused) {
        // eslint-disable-next-line no-await-in-loop
        await delay(120);
      }
      setTypingText(text.slice(0, i + 1));
      // eslint-disable-next-line no-await-in-loop
      await delay(28);
    }
    
    setIsTyping(false);
    
    // Update the message with the final text
    setChatMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.type === 'ai' 
        ? { ...msg, content: text, showTyping: false }
        : msg
    ));
  };

  // Auto-grow input and remove scrollbars
  const adjustTextAreaHeight = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const maxHeight = 120; // px (about ~6 lines)
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  };

  useEffect(() => {
    adjustTextAreaHeight();
  }, [inputText]);

  const detectDashboard = (text: string): boolean => {
    const lowerText = text.toLowerCase().trim();
    const dashboardKeywords = ["dashboard", "dashboards", "create dashboard", "make dashboard", "build dashboard"];
    return dashboardKeywords.some(keyword => lowerText.includes(keyword));
  };

  const detectComponents = (text: string): string[] => {
    const lowerText = text.toLowerCase().trim();
    
    // Component detection with multiple keyword variations
    const componentKeywords = [
      // Charts - with multiple variations
      { 
        key: "bar chart", 
        label: "bar chart", 
        keywords: ["bar chart", "bar charts", "bar", "bars"] 
      },
      { 
        key: "area chart", 
        label: "area chart", 
        keywords: ["area chart", "area charts", "area"] 
      },
      { 
        key: "line chart", 
        label: "line chart", 
        keywords: ["line chart", "line charts", "line"] 
      },
      { 
        key: "donut chart", 
        label: "donut chart", 
        keywords: ["donut chart", "donut charts", "doughnut chart", "doughnut charts", "donut", "doughnut"] 
      },
      { 
        key: "combo chart", 
        label: "combo chart", 
        keywords: ["combo chart", "combo charts", "combination chart", "combination charts", "combo"] 
      },
      { 
        key: "multi bar chart", 
        label: "multi bar chart", 
        keywords: ["multi bar chart", "multi bar charts", "multiple bar chart", "multiple bar charts", "multi bar", "multiple bar"] 
      },
      
      // UI Components
      { 
        key: "table", 
        label: "table", 
        keywords: ["table", "tables"] 
      },
      { 
        key: "button", 
        label: "button", 
        keywords: ["button", "buttons", "btn"] 
      },
      { 
        key: "text", 
        label: "text", 
        keywords: ["text", "texts", "text content", "text block"] 
      },
      { 
        key: "separator", 
        label: "separator", 
        keywords: ["separator", "separators", "divider", "dividers", "line"] 
      }
    ];

    // Detect components by checking if any of their keywords are in the text
    const detected = componentKeywords
      .filter(component => 
        component.keywords.some(keyword => lowerText.includes(keyword))
      )
      .map(component => component.label);
    
    // Debug logging to see what's detected
    console.log('Input text:', text);
    console.log('Detected components:', detected);
    
    return detected;
  };

  // Detect follow-up actions like "make this bigger" or filters like "only Europe"
  const detectFollowUp = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('make this bigger') || lower.includes('increase size')) {
      return { action: 'resize', size: 'bigger' } as const;
    }
    if (lower.includes('make this smaller') || lower.includes('decrease size')) {
      return { action: 'resize', size: 'smaller' } as const;
    }
    const filterMatch = lower.match(/only\s+(europe|asia|north|south|east|west)/);
    if (filterMatch) {
      return { action: 'filter', value: filterMatch[1] } as const;
    }
    const moveMatch = lower.match(/move (this|it) (below|above)/);
    if (moveMatch) {
      return { action: 'reorder', direction: moveMatch[2] as 'below' | 'above' } as const;
    }
    return null;
  };

  const detectSmallTalk = (text: string): string | null => {
    const lowerText = text.toLowerCase().trim();
    
    // Greeting patterns - more flexible matching
    if (lowerText === 'hi' || lowerText === 'hii' || lowerText === 'hello' || lowerText === 'hey' || 
        lowerText === 'hiya' || lowerText === 'howdy' || lowerText === 'greetings') {
      return "Hey 👋, I'm Fixframe AI! I can help you build dashboards. Try saying \"create a dashboard with bar chart\" or \"add a table\".";
    }
    
    if (lowerText === 'who are you' || lowerText === 'what are you') {
      return "I'm your AI design assistant that creates dashboards and wireframes from text prompts. I can build professional analytics dashboards with real charts and components.";
    }
    
    if (lowerText === 'help' || lowerText === 'what can you do') {
      return "You can ask me to create dashboards with things like bar charts, donut charts, line charts, tables, or even entire dashboard layouts. Try saying \"create a dashboard with bar chart and donut chart\".";
    }
    
    if (lowerText === 'bye' || lowerText === 'goodbye' || lowerText === 'see you') {
      return "Goodbye! 👋 Talk to you soon.";
    }
    
    if (lowerText === 'thanks' || lowerText === 'thank you' || lowerText === 'thx') {
      return "You're welcome! Happy to help 😃.";
    }
    
    return null;
  };

  // Intent classification for FixFrame domain Q&A
  type Intent = 'definition' | 'features' | 'guidance' | 'detailed' | null;
  const inferIntent = (text: string): Intent => {
    const t = text.toLowerCase().trim();
    if (!t) return null;
    const isQuestion = /^(what|who|how|why|explain|define|tell me)/.test(t);
    const definitionHints = /(what is|define|meaning of|explain .*? is)/;
    const featuresHints = /(features|benefits|what can .* (do|provide)|use cases|advantages)/;
    const guidanceHints = /(how to|steps|best practices|guide|example|examples)/;
    const detailedHints = /(explain .* in detail|detailed|comprehensive|step by step|long)/;
    if (detailedHints.test(t)) return 'detailed';
    if (definitionHints.test(t) || (isQuestion && /fixframe|wireframe|prototype|low fidelity/.test(t))) return 'definition';
    if (featuresHints.test(t)) return 'features';
    if (guidanceHints.test(t)) return 'guidance';
    // very short queries like "fixframe" or "wireframe" → definition
    if (t.split(/\s+/).length <= 3 && /(fixframe|wireframe)/.test(t)) return 'definition';
    return null;
  };

  const generateIntentAnswer = (intent: Exclude<Intent, null>, text: string): string => {
    const shortDefFixframe = 'FixFrame is an AI-powered platform that helps create and manage wireframes quickly, streamlining design for teams.';
    const shortDefWireframe = 'A wireframe is a simple blueprint of a website or app showing structure and layout without visual styling.';

    switch (intent) {
      case 'definition': {
        const t = text.toLowerCase();
        if (t.includes('wireframe')) return shortDefWireframe;
        if (t.includes('fixframe')) return shortDefFixframe;
        return `It's a concept within the FixFrame and wireframing workflow. Tell me which term you'd like defined (e.g., "FixFrame", "wireframe").`;
      }
      case 'features': {
        return [
          '1. AI-powered wireframe generation',
          '2. Ready-to-use templates',
          '3. Team collaboration features',
          '4. Faster design-to-development workflow'
        ].join('\n');
      }
      case 'guidance': {
        return [
          'Step 1: Start with a basic wireframe to outline structure',
          'Step 2: Add content blocks and define user flow',
          'Step 3: Share with team members for feedback',
          'Step 4: Convert into high-fidelity design for developers'
        ].join('\n');
      }
      case 'detailed': {
        return [
          '1) Define the goal: clarify the page or flow objective',
          '2) Layout structure: place headers, nav, sections, and CTAs',
          '3) Annotate interactions: note states, errors, and transitions',
          '4) Iterate with feedback: review with stakeholders and refine',
          '5) Handoff: translate into high-fidelity design and components'
        ].join('\n');
      }
    }
  };

  // Detect whether user wants to append to the existing preview
  const wantsAppendToExisting = (text: string): boolean => {
    const t = text.toLowerCase();
    const hasExistingWord = /(existing|this|current|previous|previos)/.test(t);
    const hasPreviewRef = /(preview|dashboard|board|one|it)/.test(t);
    return hasExistingWord && hasPreviewRef;
  };

  // Fuzzy helpers for chart type tokens
  const levenshtein = (a: string, b: string): number => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  };

  const normalizeTypeWord = (raw: string): string | null => {
    const token = raw.replace(/\s+/g, ' ').replace(/-+/g, '-').trim();
    // Canonical labels
    const canonical: Record<string, string> = {
      'bar': 'bar chart',
      'line': 'line chart',
      'area': 'area chart',
      'donut': 'donut chart',
      'multi bar': 'multi bar chart',
      'multi-bar': 'multi bar chart',
      'multibar': 'multi bar chart',
      'multi bars': 'multi bar chart',
      'combo': 'combo chart',
      'table': 'table'
    };
    const synonyms: Record<string, string[]> = {
      'donut': ['donut', 'doughnut', 'dunot', 'donut chart', 'doughnut chart'],
      'multi bar': ['multi bar', 'multi-bar', 'multibar', 'multi bars', 'multi bar chart'],
      'bar': ['bar', 'bars', 'bar chart'],
      'line': ['line', 'line chart'],
      'area': ['area', 'area chart'],
      'combo': ['combo', 'combination', 'combo chart'],
      'table': ['table', 'tables', 'tabel', 'tabels', 'teble', 'tebles']
    };
    // Direct hit
    if (canonical[token]) return canonical[token];
    // Synonym hit
    for (const [key, arr] of Object.entries(synonyms)) {
      if (arr.includes(token)) return canonical[key];
    }
    // Fuzzy by distance against flat list
    const candidates: Array<{ key: string; label: string; variants: string[] }> = [
      { key: 'bar', label: canonical['bar'], variants: synonyms['bar'] },
      { key: 'line', label: canonical['line'], variants: synonyms['line'] },
      { key: 'area', label: canonical['area'], variants: synonyms['area'] },
      { key: 'donut', label: canonical['donut'], variants: synonyms['donut'] },
      { key: 'multi bar', label: canonical['multi bar'], variants: synonyms['multi bar'] },
      { key: 'combo', label: canonical['combo'], variants: synonyms['combo'] },
      { key: 'table', label: canonical['table'], variants: synonyms['table'] },
    ];
    let best: { label: string; dist: number } | null = null;
    const norm = token.replace(/\s+/g, '').toLowerCase();
    for (const c of candidates) {
      for (const v of c.variants) {
        const vn = v.replace(/\s+/g, '').toLowerCase();
        const d = levenshtein(norm, vn);
        if (best == null || d < best.dist) {
          best = { label: c.label, dist: d };
        }
      }
    }
    // Accept small distance threshold
    if (best && best.dist <= 2) return best.label;
    return null;
  };

  // Helper: create a chart component by type label
  const createComponentByType = (typeLabel: string, index: number, fileNameHint?: string): DashboardComponent => {
    const colSpan = typeLabel === 'table' ? 12 : typeLabel === 'donut chart' ? 4 : 6;
    const mockKeyMap: Record<string, keyof typeof mockData> = {
      'bar chart': 'bar',
      'line chart': 'line',
      'area chart': 'area',
      'donut chart': 'donut',
      'multi bar chart': 'multiBar',
      'combo chart': 'combo',
    };
    const key = mockKeyMap[typeLabel as keyof typeof mockKeyMap] || 'bar';
    const title = fileNameHint ? `Uploaded ${fileNameHint}` : typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
    let data = (mockData as any)[key];
    // Ensure donut gets a colorful palette if missing colors
    if (key === 'donut') {
      const palette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#22D3EE', '#84CC16', '#F97316'];
      data = data.map((d: any, i: number) => ({ ...d, color: d.color || palette[i % palette.length] }));
    }
    return {
      id: `comp-${Date.now()}-${index}`,
      type: typeLabel,
      title,
      colSpan,
      rowSpan: 1,
      data
    };
  };

  // Helper function to get next grid position
  const getNextGridPosition = (colSpan: number) => {
    let { row, col } = nextGridPosition;
    
    // Check if component fits in current row
    if (col + colSpan > 12) {
      row++;
      col = 1;
    }
    
    const position = { row, col };
    
    // Update next position
    setNextGridPosition({ row, col: col + colSpan });
    
    return position;
  };

  // Helper function to render a dashboard component
  const renderDashboardComponent = (component: DashboardComponent) => {
    const { type, title, data } = component;
    const headers = Array.isArray(data) && data.length ? Object.keys(data[0]) : [];
    const insights = Array.isArray(data) ? generateInsights(data, headers) : [];
    
    switch (type) {
      case 'bar chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full min-h-[22rem] flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`} title="Explain this chart" onClick={() => alert((insights.join('\n') || 'No significant insights detected.'))}>Explain</button>
            </div>
            <div className="flex-1 min-h-[16rem]">
              {renderBarChart(data || mockData.bar)}
            </div>
            {insights.length > 0 && (
              <ul className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {insights.map((i, idx) => (<li key={idx}>• {i}</li>))}
              </ul>
            )}
          </div>
        );
      case 'line chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full min-h-[22rem] flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`} title="Explain this chart" onClick={() => alert((insights.join('\n') || 'No significant insights detected.'))}>Explain</button>
            </div>
            <div className="flex-1 min-h-[16rem]">
              {renderLineChart(data || mockData.line)}
            </div>
            {insights.length > 0 && (
              <ul className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {insights.map((i, idx) => (<li key={idx}>• {i}</li>))}
              </ul>
            )}
          </div>
        );
      case 'area chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full min-h-[22rem] flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`} title="Explain this chart" onClick={() => alert((insights.join('\n') || 'No significant insights detected.'))}>Explain</button>
            </div>
            <div className="flex-1 min-h-[16rem]">
              {renderAreaChart(data || mockData.area)}
            </div>
            {insights.length > 0 && (
              <ul className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {insights.map((i, idx) => (<li key={idx}>• {i}</li>))}
              </ul>
            )}
          </div>
        );
      case 'donut chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full min-h-[22rem] flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`} title="Explain this chart" onClick={() => alert((insights.join('\n') || 'No significant insights detected.'))}>Explain</button>
            </div>
            <div className="flex-1 min-h-[16rem]">
              {renderDonutChart(data || mockData.donut)}
            </div>
            {insights.length > 0 && (
              <ul className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {insights.map((i, idx) => (<li key={idx}>• {i}</li>))}
              </ul>
            )}
          </div>
        );
      case 'multi bar chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full min-h-[22rem] flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`} title="Explain this chart" onClick={() => alert((insights.join('\n') || 'No significant insights detected.'))}>Explain</button>
            </div>
            <div className="flex-1 min-h-[16rem]">
              {renderMultiBarChart(data || mockData.multiBar)}
            </div>
            {insights.length > 0 && (
              <ul className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {insights.map((i, idx) => (<li key={idx}>• {i}</li>))}
              </ul>
            )}
          </div>
        );
      case 'combo chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full min-h-[22rem] flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
              <button className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`} title="Explain this chart" onClick={() => alert((insights.join('\n') || 'No significant insights detected.'))}>Explain</button>
            </div>
            <div className="flex-1 min-h-[16rem]">
              {renderComboChart(data || mockData.combo)}
            </div>
            {insights.length > 0 && (
              <ul className={`mt-2 text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {insights.map((i, idx) => (<li key={idx}>• {i}</li>))}
              </ul>
            )}
          </div>
        );
      case 'table':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                    <th className={`text-left p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Value</th>
                    <th className={`text-left p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Item {i}</td>
                      <td className={`p-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{Math.floor(Math.random() * 1000)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          i % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {i % 2 === 0 ? 'Active' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              This is a sample text component. You can add any content here to provide context or information to your dashboard users.
            </p>
          </div>
        );
      case 'button':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              {title}
            </button>
          </div>
        );
      case 'separator':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`w-full h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>
        );
      default:
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{title}</p>
          </div>
        );
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    // Store the input text and clear it immediately
    const userInput = inputText;
    setInputText('');
    
    // Add user message
    const userMessage = {
      id: currentMessageId.toString(),
      type: 'user' as const,
      content: userInput,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessageId(prev => prev + 1);
    
    // Always show shimmer loader first (1-2 seconds)
    const shimmerMessage = {
      id: currentMessageId.toString(),
      type: 'ai' as const,
      content: 'AI is thinking...',
      timestamp: new Date(),
      showLoader: true
    };
    setChatMessages(prev => [...prev, shimmerMessage]);
    setCurrentMessageId(prev => prev + 1);
    
    // Wait 1.5 seconds for natural feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check for small talk first
    const smallTalkResponse = detectSmallTalk(userInput);
    if (smallTalkResponse) {
      // Remove loader and add typing animation
      const aiMessageId = currentMessageId.toString();
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.showLoader);
        const typingMessage = {
          id: aiMessageId,
          type: 'ai' as const,
          content: smallTalkResponse,
          timestamp: new Date(),
          showTyping: true
        };
        return [...filtered, typingMessage];
      });
      setCurrentMessageId(prev => prev + 1);
      
      // Start typing animation
      await typeText(smallTalkResponse, aiMessageId);
      return;
    }
    // Detect specific typed charts: e.g., "create 2 donut chart", "add three line charts"
    {
      const lower = userInput.toLowerCase();
      const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
      const types = ['bar chart', 'line chart', 'area chart', 'donut chart', 'multi bar chart', 'combo chart'];
      // Build a regex group for types (handle optional trailing 's' and common typos)
      const typeGroup = '(bar|line|area|donut|doughnut|dunot|multi\\s*[- ]?bar|multibar|multi\\s*bars|combo|teble|table|tabel|tebles?)\\s+charts?';
      // Single-match handler removed to allow multi-group handler below to process the entire sentence
    }

    // Detect multiple typed groups across sentence: e.g., "one combo chart and 2 donut chart"
    {
      const lower = userInput.toLowerCase();
      const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
      const typeGroup = '(bar|line|area|donut|doughnut|dunot|multi\\s*[- ]?bar|multibar|multi\\s*bars|combo)\\s+charts?';
      const canonical: Record<string, string> = {
        'bar': 'bar chart',
        'line': 'line chart',
        'area': 'area chart',
        'donut': 'donut chart',
        'doughnut': 'donut chart',
        'dunot': 'donut chart',
        'multi bar': 'multi bar chart',
        'multi-bar': 'multi bar chart',
        'multibar': 'multi bar chart',
        'multi bars': 'multi bar chart',
        'combo': 'combo chart'
      };
      const re = new RegExp(`\\b(?:add\\s*)?(\\d+|one|two|three|four|five|six)\\s+${typeGroup}\\b`, 'g');
      let match: RegExpExecArray | null;
      const components: DashboardComponent[] = [];
      while ((match = re.exec(lower)) !== null) {
        const countTok = match[1];
        const typeWord = match[2];
        const parsed = isNaN(Number(countTok)) ? (wordToNum[countTok] || 1) : Number(countTok);
        const count = Math.max(1, Math.min(6, parsed));
        const normalizedKey = typeWord.replace(/\s+/g, ' ').replace(/-+/g, '-');
        const normalizedType = normalizeTypeWord(normalizedKey) || canonical[normalizedKey] || 'bar chart';
        for (let i = 0; i < count; i++) {
          components.push(createComponentByType(normalizedType, components.length));
        }
      }
      // Also parse tables with typos globally
      const reTable = /\b(\d+|one|two|three|four|five|six)\s+(tables?|tabels?|tabel|tebale|teble|tebles?)\b/g;
      let tm: RegExpExecArray | null;
      while ((tm = reTable.exec(lower)) !== null) {
        const ctok = tm[1];
        const parsed = isNaN(Number(ctok)) ? (wordToNum[ctok] || 1) : Number(ctok);
        const tcount = Math.max(1, Math.min(6, parsed));
        for (let i = 0; i < tcount; i++) {
          components.push(createComponentByType('table', components.length));
        }
      }
      if (components.length > 0) {
        const addToExisting = wantsAppendToExisting(userInput);
        if (hasDashboard && addToExisting) {
          setDashboardComponents(prev => [...prev, ...components]);
        } else {
          setHasDashboard(true);
          setDashboardComponents(components);
          setNextGridPosition({ row: 1, col: 1 });
        }
        setGeneratedLayout(renderDashboard());
        const countByType: Record<string, number> = {};
        components.forEach(c => { countByType[c.type] = (countByType[c.type] || 0) + 1; });
        const parts = Object.entries(countByType).map(([t, n]) => `${n} ${t}${n > 1 ? 's' : ''}`);
        const summary = parts.join(' and ');
        const reply = addToExisting ? `Added ${summary} to your dashboard.` : `Created a dashboard with ${summary}.`;
        const aiMessageId = currentMessageId.toString();
        setChatMessages(prev => {
          const filtered = prev.filter(msg => !msg.showLoader);
          const typingMessage = {
            id: aiMessageId,
            type: 'ai' as const,
            content: reply,
            timestamp: new Date(),
            showTyping: true,
            showPreview: true
          };
          return [...filtered, typingMessage];
        });
        setCurrentMessageId(prev => prev + 1);
        await typeText(reply, aiMessageId);
        return;
      }
    }

    // Detect mixed requests like "three charts and 1 table" (supports number words up to six)
    const lowerCmd = userInput.toLowerCase();
    const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
    const numFromToken = (tok?: string): number => {
      if (!tok) return 0;
      return isNaN(Number(tok)) ? (wordToNum[tok] || 0) : Number(tok);
    };
    const chartTok = lowerCmd.match(/\b(\d+|one|two|three|four|five|six)\s+charts?\b/);
    const tableTok = lowerCmd.match(/\b(\d+|one|two|three|four|five|six)\s+(tables?|tabels?|tabel|tebale|teble|tebles?)\b/);
    const chartsRequested = Math.max(0, Math.min(6, numFromToken(chartTok?.[1])));
    const tablesRequested = Math.max(0, Math.min(6, numFromToken(tableTok?.[1])));
    const addToExisting = /\badd\b/.test(lowerCmd);
    if (chartsRequested > 0 || tablesRequested > 0) {
      const pool = ['bar chart', 'line chart', 'area chart', 'donut chart', 'multi bar chart', 'combo chart'];
      const chartComponents: DashboardComponent[] = Array.from({ length: chartsRequested }).map((_, i) => {
        const t = pool[Math.floor(Math.random() * pool.length)];
        return createComponentByType(t, i);
      });
      const tableComponents: DashboardComponent[] = Array.from({ length: tablesRequested }).map((_, i) => createComponentByType('table', chartsRequested + i));
      const newComponents = [...chartComponents, ...tableComponents];

      if (hasDashboard && addToExisting) {
        setDashboardComponents(prev => [...prev, ...newComponents]);
      } else {
        setHasDashboard(true);
        setDashboardComponents(newComponents);
        setNextGridPosition({ row: 1, col: 1 });
      }

      setGeneratedLayout(renderDashboard());

      const parts: string[] = [];
      if (chartsRequested > 0) parts.push(`${chartsRequested} chart${chartsRequested > 1 ? 's' : ''}`);
      if (tablesRequested > 0) parts.push(`${tablesRequested} table${tablesRequested > 1 ? 's' : ''}`);
      const summary = parts.join(' and ');
      const reply = addToExisting
        ? `Added ${summary} to your dashboard.`
        : `Created a dashboard with ${summary}.`;

      const aiMessageId = currentMessageId.toString();
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.showLoader);
        const typingMessage = {
          id: aiMessageId,
          type: 'ai' as const,
          content: reply,
          timestamp: new Date(),
          showTyping: true,
          showPreview: true
        };
        return [...filtered, typingMessage];
      });
      setCurrentMessageId(prev => prev + 1);
      await typeText(reply, aiMessageId);
      return;
    }
    // Intent-based Q&A for FixFrame domain (only if not an analytics/dashboard command)
    const intent = inferIntent(userInput);
    const looksLikeAnalytics = /(show|plot|graph|visualize|compare|trend)/i.test(userInput) || /(sales|revenue|users|orders|profit)/i.test(userInput);
    if (!looksLikeAnalytics && intent) {
      const answer = generateIntentAnswer(intent, userInput);
      const aiMessageId = currentMessageId.toString();
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.showLoader);
        const typingMessage = {
          id: aiMessageId,
          type: 'ai' as const,
          content: answer,
          timestamp: new Date(),
          showTyping: true
        };
        return [...filtered, typingMessage];
      });
      setCurrentMessageId(prev => prev + 1);
      await typeText(answer, aiMessageId);
      return;
    }
    
    // Skip external backend; use local logic only

    // Check if user wants to create a dashboard
    const wantsDashboard = detectDashboard(userInput);
    const detected = detectComponents(userInput);
    const followUp = detectFollowUp(userInput);

    // Apply follow-ups to existing dashboard
    if (hasDashboard && followUp) {
      if (followUp.action === 'resize' && dashboardComponents.length) {
        setDashboardComponents(prev => prev.map((c, idx) => idx === prev.length - 1 ? { ...c, colSpan: Math.max(3, Math.min(12, c.colSpan + (followUp.size === 'bigger' ? 3 : -3))) } : c));
      } else if (followUp.action === 'reorder' && dashboardComponents.length >= 2) {
        setDashboardComponents(prev => {
          const arr = [...prev];
          const last = arr.pop()!;
          if (followUp.direction === 'above') arr.unshift(last); else arr.push(last);
          return arr;
        });
      } else if (followUp.action === 'filter' && dashboardComponents.length) {
        const v = followUp.value;
        setDashboardComponents(prev => prev.map(c => {
          if (Array.isArray(c.data)) {
            if (c.data[0] && 'region' in c.data[0]) {
              return { ...c, data: c.data.filter((r: any) => String(r.region).toLowerCase().includes(v)) };
            }
          }
          return c;
        }));
      }
      // Remove loader and reply
      const aiMessageId = currentMessageId.toString();
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.showLoader);
        const typingMessage = {
          id: aiMessageId,
          type: 'ai' as const,
          content: 'Done. Updated your dashboard.',
          timestamp: new Date(),
          showTyping: true,
          showPreview: true
        };
        return [...filtered, typingMessage];
      });
      setCurrentMessageId(prev => prev + 1);
      await typeText('Done. Updated your dashboard.', aiMessageId);
      return;
    }

    // Natural language → data (mock JSON + pseudo SQL)
    if (looksLikeAnalytics) {
      const { sql, data, headers, title } = generateDataFromQuery(userInput);
      const recommended = recommendChartType(headers);
      setHasDashboard(true);
      setNextGridPosition({ row: 1, col: 1 });
      setDashboardComponents([{
        id: `comp-${Date.now()}`,
        type: recommended,
        title: title,
        colSpan: recommended === 'donut chart' ? 4 : 8,
        rowSpan: 1,
        data
      }]);
      setGeneratedLayout(renderDashboard());
      setMemoryContext(prev => ({ ...prev, lastQuery: userInput }));
      const response = `Here is a ${recommended} for: ${title}.\nSQL (mock): ${sql}`;
      const aiMessageId = currentMessageId.toString();
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.showLoader);
        const typingMessage = {
          id: aiMessageId,
          type: 'ai' as const,
          content: response,
          timestamp: new Date(),
          showTyping: true,
          showPreview: true
        };
        return [...filtered, typingMessage];
      });
      setCurrentMessageId(prev => prev + 1);
      await typeText(response, aiMessageId);
      return;
    }
    
    if (wantsDashboard && detected.length > 0) {
      // Create new dashboard
      setHasDashboard(true);
      setDashboardComponents([]);
      setNextGridPosition({ row: 1, col: 1 });
      
      // Add components to dashboard
      const newComponents: DashboardComponent[] = detected.map((comp, index) => ({
        id: `comp-${Date.now()}-${index}`,
        type: comp,
        title: comp.charAt(0).toUpperCase() + comp.slice(1),
        colSpan: comp === 'table' ? 12 : comp === 'donut chart' ? 4 : 6,
        rowSpan: 1,
        data: mockData[comp.replace(' ', '') as keyof typeof mockData] || mockData.bar
      }));
      
      setDashboardComponents(newComponents);
      
      // Generate the dashboard layout for preview
      const dashboardLayout = renderDashboard();
      setGeneratedLayout(dashboardLayout);
      
      // Remove loader and add success message with preview
      const successText = `Perfect! I've created a new dashboard with ${detected.length} component${detected.length > 1 ? 's' : ''}. You can now add more components by saying "add [component name]".`;
      const aiMessageId = currentMessageId.toString();
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.showLoader);
        const typingMessage = {
          id: aiMessageId,
          type: 'ai' as const,
          content: successText,
          timestamp: new Date(),
          showTyping: true,
          showPreview: true
        };
        return [...filtered, typingMessage];
      });
      setCurrentMessageId(prev => prev + 1);
      
      // Start typing animation
      await typeText(successText, aiMessageId);
      return;
    }
    
    if (hasDashboard && detected.length > 0) {
      const wantsAppend = /\b(add|append)\b/i.test(userInput);
      const newComponents: DashboardComponent[] = detected.map((comp, index) => ({
        id: `comp-${Date.now()}-${index}`,
        type: comp,
        title: comp.charAt(0).toUpperCase() + comp.slice(1),
        colSpan: comp === 'table' ? 12 : comp === 'donut chart' ? 4 : 6,
        rowSpan: 1,
        data: mockData[comp.replace(' ', '') as keyof typeof mockData] || mockData.bar
      }));

      if (wantsAppend) {
        setDashboardComponents(prev => [...prev, ...newComponents]);
        const dashboardLayout = renderDashboard();
        setGeneratedLayout(dashboardLayout);
        const successText = `Great! I've added ${detected.length} new component${detected.length > 1 ? 's' : ''} to your dashboard.`;
        const aiMessageId = currentMessageId.toString();
        setChatMessages(prev => {
          const filtered = prev.filter(msg => !msg.showLoader);
          const typingMessage = {
            id: aiMessageId,
            type: 'ai' as const,
            content: successText,
            timestamp: new Date(),
            showTyping: true,
            showPreview: true
          };
          return [...filtered, typingMessage];
        });
        setCurrentMessageId(prev => prev + 1);
        await typeText(successText, aiMessageId);
      } else {
        // Create a new preview instead of adding
        setHasDashboard(true);
        setDashboardComponents(newComponents);
        setNextGridPosition({ row: 1, col: 1 });
        setGeneratedLayout(renderDashboard());
        const text = `Created a new dashboard with ${detected.length} component${detected.length > 1 ? 's' : ''}.`;
        const aiMessageId = currentMessageId.toString();
        setChatMessages(prev => {
          const filtered = prev.filter(msg => !msg.showLoader);
          const typingMessage = {
            id: aiMessageId,
            type: 'ai' as const,
            content: text,
            timestamp: new Date(),
            showTyping: true,
            showPreview: true
          };
          return [...filtered, typingMessage];
        });
        setCurrentMessageId(prev => prev + 1);
        await typeText(text, aiMessageId);
      }
      return;
    }
    
    if (detected.length === 0) {
      // Remove loader and add fallback message
      const fallbackText = hasDashboard 
        ? 'I can add charts, tables, or components to your dashboard. Try saying "add a bar chart" or "add a table".'
        : 'I can help you create a dashboard or add components. Try saying "create a dashboard with bar chart" or "make a dashboard with table and line chart".';
      const aiMessageId = currentMessageId.toString();
      setChatMessages(prev => {
        const filtered = prev.filter(msg => !msg.showLoader);
        const typingMessage = {
          id: aiMessageId,
          type: 'ai' as const,
          content: fallbackText,
          timestamp: new Date(),
          showTyping: true
        };
        return [...filtered, typingMessage];
      });
      setCurrentMessageId(prev => prev + 1);
      
      // Start typing animation
      await typeText(fallbackText, aiMessageId);
      return;
    }
  };

  // Render dashboard with KPI cards and grid layout
  const renderDashboard = () => {
    if (!hasDashboard || dashboardComponents.length === 0) return null;

    return (
      <div ref={dashboardModalContentRef} className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Revenue</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$45,231</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5%
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <DollarSign className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2,350</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.2%
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                <Users className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversion Rate</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>3.24%</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                  -2.1%
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'}`}>
                <Activity className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg shadow-sm border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg. Session</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>4m 32s</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5.3%
                </p>
              </div>
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                <Activity className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 auto-rows-fr gap-6 items-stretch">
          {dashboardComponents.map((component) => (
            <div
              key={component.id}
              style={{
                gridColumn: `span ${component.colSpan} / span ${component.colSpan}`,
                gridRow: `span ${component.rowSpan} / span ${component.rowSpan}`
              }}
              className="h-full"
            >
              {renderDashboardComponent(component)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render shimmer loader
  const renderShimmerLoader = () => (
    <div className="flex items-center space-x-3 p-4">
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className={`text-sm animate-pulse ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI is thinking...</span>
    </div>
  );

  // Render typing animation
  const renderTypingAnimation = () => (
    <div className="flex items-center space-x-2">
      <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{typingText}</span>
      {isTyping && (
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  );

  // Render chat bubble
  const renderChatBubble = (message: any) => {
    if (message.type === 'user') {
      return (
        <div className="flex justify-end mb-3">
          <div className="px-3 py-1.5 rounded-xl rounded-br-md max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-start mb-3">
        <div className={`px-3 py-2 rounded-xl rounded-bl-md max-w-md shadow-sm border text-xs ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}>
          {message.showLoader ? (
            renderShimmerLoader()
          ) : message.showTyping ? (
            renderTypingAnimation()
          ) : (
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{message.content}</p>
              {message.showPreview && hasDashboard && (
                <div className="mt-4">
                  <div 
                    className={`w-48 h-36 border-2 border-dashed rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 mx-auto relative group ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}
                    onClick={() => setShowDashboardModal(true)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Dashboard Preview</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to enlarge</div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                        Click to enlarge
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-3 space-x-2">
                    <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
                      Add to board
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all duration-200">
                      Board theme toggle
                    </button>
                  </div>
                  <div className="flex justify-center mt-2 space-x-2">
                    <button className={`p-1 text-sm rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      👍
                    </button>
                    <button className={`p-1 text-sm rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                      👎
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render dashboard modal
  const renderDashboardModal = () => {
    if (!showDashboardModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className={`rounded-lg shadow-2xl w-full max-w-7xl mx-4 max-h-[95vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Preview</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* Export / Share */}
              <button onClick={exportDashboardPNG} className={`px-3 py-1.5 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>Export PNG</button>
              <button onClick={exportDashboardCSV} className={`px-3 py-1.5 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>Export CSV</button>
              {/* Share Link option removed */}
              {/* iFrame option removed */}
              {/* 3-Dot Menu */}
              <div className="relative" data-menu="true">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  title="More options"
                  data-menu="true"
                >
                  <MoreVertical className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} data-menu="true">
                    <div className="py-1">
                      {/* Theme Toggle */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDarkMode(!isDarkMode);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-opacity-10 transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
                        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      </button>
                      
                      {/* Clear Chat */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearChat();
                        }}
                        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-opacity-10 transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Clear chat
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowDashboardModal(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-0">
            {hasDashboard ? renderDashboard() : generatedLayout}
          </div>
          {/* iFrame embed removed */}
        </div>
      </div>
    );
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
        <div className={`rounded-lg rounded-r-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col relative z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fixframe AI Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              {/* 3-Dot Menu */}
              <div className="relative" data-menu="true">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  title="More options"
                  data-menu="true"
                >
                  <MoreVertical className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} data-menu="true">
                    <div className="py-1">
                      {/* Theme Toggle */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDarkMode(!isDarkMode);
                          setShowMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-opacity-10 transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-600" />}
                        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                      </button>
                      
                      {/* Clear Chat */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearChat();
                        }}
                        className={`w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-opacity-10 transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Clear chat
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {chatMessages.map((message) => (
              <div key={message.id}>
                {renderChatBubble(message)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t rounded-b-lg ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gradient-to-r from-gray-50 to-white'}`}>
            <div
              className={`relative flex items-end space-x-3 rounded-2xl shadow-lg border p-3 hover:shadow-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const text = String(reader.result || '');
                    const parsed = parseCSV(text);
                    if (parsed.headers.length && parsed.rows.length) {
                      const rec = recommendChartType(parsed.headers);
                      setHasDashboard(true);
                      setDashboardComponents([{
                        id: `comp-${Date.now()}`,
                        type: rec,
                        title: `Uploaded ${file.name}`,
                        colSpan: rec === 'donut chart' ? 4 : 8,
                        rowSpan: 1,
                        data: parsed.rows
                      }]);
                      setGeneratedLayout(renderDashboard());
                      setChatMessages(prev => [...prev, { id: (Date.now()).toString(), type: 'ai', content: `Parsed ${file.name}. Recommended a ${rec}.`, timestamp: new Date() }]);
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            >
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Ask me to create a dashboard or add components..."
                 className={`w-full px-4 py-3 border-0 bg-transparent resize-none overflow-hidden text-sm focus:outline-none focus:ring-0 ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'}`}
                 rows={1}
              />
              <input ref={fileInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const text = String(reader.result || '');
                  const parsed = parseCSV(text);
                  if (parsed.headers.length && parsed.rows.length) {
                    const rec = recommendChartType(parsed.headers);
                    setHasDashboard(true);
                    setDashboardComponents([{
                      id: `comp-${Date.now()}`,
                      type: rec,
                      title: `Uploaded ${file.name}`,
                      colSpan: rec === 'donut chart' ? 4 : 8,
                      rowSpan: 1,
                      data: parsed.rows
                    }]);
                    setGeneratedLayout(renderDashboard());
                    setChatMessages(prev => [...prev, { id: (Date.now()).toString(), type: 'ai', content: `Parsed ${file.name}. Recommended a ${rec}.`, timestamp: new Date() }]);
                  }
                };
                reader.readAsText(file);
              }} />
              {/* Upload button removed as requested; drag-and-drop still supported */}
              <button
                onClick={() => {
                  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (!SR) {
                    alert('Speech recognition not supported in this browser.');
                    return;
                  }
                  const rec = new SR();
                  rec.lang = 'en-US';
                  rec.onresult = (ev: any) => {
                    const transcript = ev.results[0][0].transcript;
                    setInputText(transcript);
                  };
                  rec.start();
                }}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${isDarkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
                title="Voice input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (isTyping) {
                    // Stop current response
                    setIsPaused(false);
                    setIsTyping(false);
                    cancelTypingRef.current = true;
                  } else {
                    // Send message (uses Upload icon per request)
                    if (inputText.trim()) {
                      handleGenerate();
                    }
                  }
                }}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-600 text-gray-100 hover:bg-gray-500' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} ${!isTyping && !inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isTyping ? 'Stop' : 'Send'}
                disabled={!isTyping && !inputText.trim()}
              >
                {isTyping ? <StopCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Modal */}
      {renderDashboardModal()}
    </>
  );
}