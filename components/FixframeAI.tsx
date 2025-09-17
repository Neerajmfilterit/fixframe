'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ThumbsUp, ThumbsDown, Maximize2, TrendingUp, Users, DollarSign, Activity, Sun, Moon, MoreVertical, Trash2 } from 'lucide-react';
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
  
  // New dashboard state
  const [hasDashboard, setHasDashboard] = useState(false);
  const [dashboardComponents, setDashboardComponents] = useState<DashboardComponent[]>([]);
  const [nextGridPosition, setNextGridPosition] = useState({ row: 1, col: 1 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  // Chart rendering functions
  const renderBarChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3B82F6" />
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
        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
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
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
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
        <Bar dataKey="barValue" fill="#3B82F6" />
        <Line type="monotone" dataKey="lineValue" stroke="#EF4444" strokeWidth={2} />
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
  const typeText = async (text: string, messageId: string) => {
    setIsTyping(true);
    setTypingText('');
    
    for (let i = 0; i < text.length; i++) {
      setTypingText(text.slice(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    setIsTyping(false);
    
    // Update the message with the final text
    setChatMessages(prev => prev.map(msg => 
      msg.id === messageId && msg.type === 'ai' 
        ? { ...msg, content: text, showTyping: false }
        : msg
    ));
  };

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
    
    switch (type) {
      case 'bar chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="h-64">
              {renderBarChart(data || mockData.bar)}
            </div>
          </div>
        );
      case 'line chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="h-64">
              {renderLineChart(data || mockData.line)}
            </div>
          </div>
        );
      case 'area chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="h-64">
              {renderAreaChart(data || mockData.area)}
            </div>
          </div>
        );
      case 'donut chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="h-64">
              {renderDonutChart(data || mockData.donut)}
            </div>
          </div>
        );
      case 'multi bar chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="h-64">
              {renderMultiBarChart(data || mockData.multiBar)}
            </div>
          </div>
        );
      case 'combo chart':
        return (
          <div className={`rounded-lg shadow-sm border p-4 h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <div className="h-64">
              {renderComboChart(data || mockData.combo)}
            </div>
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

  // Helper: Tailwind needs literal span classes; map numbers to safe classes
  const getColSpanClass = (span: number) => {
    if (span >= 12) return 'col-span-12';
    if (span >= 8) return 'col-span-8';
    if (span >= 6) return 'col-span-6';
    if (span >= 5) return 'col-span-5';
    if (span >= 4) return 'col-span-4';
    if (span >= 3) return 'col-span-3';
    if (span >= 2) return 'col-span-2';
    return 'col-span-1';
  };

  const getRowSpanClass = (span: number) => {
    if (span >= 4) return 'row-span-4';
    if (span >= 3) return 'row-span-3';
    if (span >= 2) return 'row-span-2';
    return 'row-span-1';
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
    
    // Check if user wants to create a dashboard
    const wantsDashboard = detectDashboard(userInput);
    const detected = detectComponents(userInput);
    
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
      // Add components to existing dashboard
      const newComponents: DashboardComponent[] = detected.map((comp, index) => {
        const position = getNextGridPosition(comp === 'table' ? 12 : comp === 'donut chart' ? 4 : 6);
        return {
          id: `comp-${Date.now()}-${index}`,
          type: comp,
          title: comp.charAt(0).toUpperCase() + comp.slice(1),
          colSpan: comp === 'table' ? 12 : comp === 'donut chart' ? 4 : 6,
          rowSpan: 1,
          data: mockData[comp.replace(' ', '') as keyof typeof mockData] || mockData.bar
        };
      });
      
      setDashboardComponents(prev => [...prev, ...newComponents]);
      
      // Update the dashboard layout for preview
      const dashboardLayout = renderDashboard();
      setGeneratedLayout(dashboardLayout);
      
      // Remove loader and add success message with preview
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
      
      // Start typing animation
      await typeText(successText, aiMessageId);
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
      <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
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
        <div className="grid grid-cols-12 auto-rows-fr gap-6">
          {dashboardComponents.map((component, index) => (
            <div 
              key={component.id}
              className={`${getColSpanClass(component.colSpan)} ${getRowSpanClass(component.rowSpan)}`}
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
            <div className={`relative flex items-end space-x-3 rounded-2xl shadow-lg border p-3 hover:shadow-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Ask me to create a dashboard or add components..."
                className={`w-full px-4 py-3 border-0 bg-transparent resize-none text-sm focus:outline-none focus:ring-0 ${isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'}`}
                rows={1}
              />
              <button
                onClick={handleGenerate}
                disabled={!inputText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                <Sparkles className="w-4 h-4" />
                Send
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