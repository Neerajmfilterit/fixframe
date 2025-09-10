'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, PieChart, Save, FolderOpen, FileText, 
  Download, Upload, Eye, EyeOff, Grid, Plus, Moon, Sun,
  TrendingUp, Activity, Table, BarChart2
} from 'lucide-react';
import { DarkModeBarChart, DarkModeDonutChart, DEFAULT_COLORS } from './DarkModeCharts';
import { RechartsLineChart, RechartsAreaChart } from './RechartsComponents';
import { ShadcnTable } from './ShadcnTable';
import { ShadcnComboChart } from './ShadcnComboChart';
import EnhancedChartCustomizer from './EnhancedChartCustomizer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  replies?: Comment[];
}

interface Chart {
  id: string;
  type: 'bar' | 'donut' | 'line' | 'area' | 'table' | 'combo';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: { name: string; value: number; color: string }[] | { name: string; barValue: number; lineValue: number; barColor?: string; lineColor?: string }[] | {
    columns: Array<{id: string; name: string; width: number; type: 'text' | 'number' | 'date' | 'email' | 'url'; sortable: boolean; align: 'left' | 'center' | 'right'}>;
    rows: Array<{id: string; cells: Record<string, {id: string; content: string; type: 'text' | 'number' | 'date' | 'email' | 'url'}>}>;
    showHeader: boolean;
    showBorder: boolean;
    striped: boolean;
    compact: boolean;
    roundedCorners: boolean;
  };
  titleColor: string;
  titleSize: number;
  titleWeight: string;
  comments: Comment[];
}

const CHART_TEMPLATES = [
  {
    type: 'bar' as const,
    name: 'Bar Chart',
    icon: BarChart3,
    category: 'charts',
    defaultData: [
      { name: 'Q1', value: 85, color: DEFAULT_COLORS[0] },
      { name: 'Q2', value: 92, color: DEFAULT_COLORS[1] },
      { name: 'Q3', value: 78, color: DEFAULT_COLORS[2] },
      { name: 'Q4', value: 96, color: DEFAULT_COLORS[3] }
    ]
  },
  {
    type: 'donut' as const,
    name: 'Donut Chart', 
    icon: PieChart,
    category: 'charts',
    defaultData: [
      { name: 'Desktop', value: 45, color: DEFAULT_COLORS[0] },
      { name: 'Mobile', value: 30, color: DEFAULT_COLORS[1] },
      { name: 'Tablet', value: 15, color: DEFAULT_COLORS[2] },
      { name: 'Other', value: 10, color: DEFAULT_COLORS[3] }
    ]
  },
  {
    type: 'line' as const,
    name: 'Line Chart',
    icon: TrendingUp,
    category: 'charts',
    defaultData: [
      { name: 'Jan', value: 65, color: DEFAULT_COLORS[0] },
      { name: 'Feb', value: 78, color: DEFAULT_COLORS[0] },
      { name: 'Mar', value: 90, color: DEFAULT_COLORS[0] },
      { name: 'Apr', value: 82, color: DEFAULT_COLORS[0] },
      { name: 'May', value: 95, color: DEFAULT_COLORS[0] },
      { name: 'Jun', value: 88, color: DEFAULT_COLORS[0] }
    ]
  },
  {
    type: 'area' as const,
    name: 'Area Chart',
    icon: Activity,
    category: 'charts',
    defaultData: [
      { name: 'Week 1', value: 45, color: DEFAULT_COLORS[1] },
      { name: 'Week 2', value: 52, color: DEFAULT_COLORS[1] },
      { name: 'Week 3', value: 61, color: DEFAULT_COLORS[1] },
      { name: 'Week 4', value: 58, color: DEFAULT_COLORS[1] },
      { name: 'Week 5', value: 67, color: DEFAULT_COLORS[1] },
      { name: 'Week 6', value: 74, color: DEFAULT_COLORS[1] }
    ]
  },
  {
    type: 'combo' as const,
    name: 'Combo Chart',
    icon: BarChart2,
    category: 'charts',
    defaultData: [
      { name: 'Q1', barValue: 120, lineValue: 15, barColor: DEFAULT_COLORS[0], lineColor: DEFAULT_COLORS[2] },
      { name: 'Q2', barValue: 180, lineValue: 22, barColor: DEFAULT_COLORS[0], lineColor: DEFAULT_COLORS[2] },
      { name: 'Q3', barValue: 150, lineValue: 18, barColor: DEFAULT_COLORS[0], lineColor: DEFAULT_COLORS[2] },
      { name: 'Q4', barValue: 200, lineValue: 28, barColor: DEFAULT_COLORS[0], lineColor: DEFAULT_COLORS[2] }
    ]
  },
  {
    type: 'table' as const,
    name: 'Data Table',
    icon: Table,
    category: 'components',
    defaultData: {
      columns: [
        { id: 'col-1', name: 'Name', width: 150, type: 'text' as const, sortable: true, align: 'left' as const },
        { id: 'col-2', name: 'Email', width: 200, type: 'email' as const, sortable: true, align: 'left' as const },
        { id: 'col-3', name: 'Role', width: 120, type: 'text' as const, sortable: true, align: 'left' as const },
        { id: 'col-4', name: 'Status', width: 100, type: 'text' as const, sortable: true, align: 'center' as const }
      ],
      rows: [
        {
          id: 'row-1',
          cells: {
            'col-1': { id: 'cell-1-1', content: 'John Doe', type: 'text' as const },
            'col-2': { id: 'cell-1-2', content: 'john@example.com', type: 'email' as const },
            'col-3': { id: 'cell-1-3', content: 'Admin', type: 'text' as const },
            'col-4': { id: 'cell-1-4', content: 'Active', type: 'text' as const }
          }
        },
        {
          id: 'row-2',
          cells: {
            'col-1': { id: 'cell-2-1', content: 'Jane Smith', type: 'text' as const },
            'col-2': { id: 'cell-2-2', content: 'jane@example.com', type: 'email' as const },
            'col-3': { id: 'cell-2-3', content: 'Editor', type: 'text' as const },
            'col-4': { id: 'cell-2-4', content: 'Active', type: 'text' as const }
          }
        },
        {
          id: 'row-3',
          cells: {
            'col-1': { id: 'cell-3-1', content: 'Bob Johnson', type: 'text' as const },
            'col-2': { id: 'cell-3-2', content: 'bob@example.com', type: 'email' as const },
            'col-3': { id: 'cell-3-3', content: 'Viewer', type: 'text' as const },
            'col-4': { id: 'cell-3-4', content: 'Inactive', type: 'text' as const }
          }
        }
      ],
      showHeader: true,
      showBorder: true,
      striped: true,
      compact: false,
      roundedCorners: true
    }
  }
];

// Helper functions to filter templates by category
const getChartTemplates = () => CHART_TEMPLATES.filter(template => template.category === 'charts');
const getComponentTemplates = () => CHART_TEMPLATES.filter(template => template.category === 'components');

export default function UltimateWireframeBuilder() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projectName, setProjectName] = useState('My Wireframe');
  const [isSaving, setIsSaving] = useState(false);
  const [draggedChart, setDraggedChart] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<'charts' | 'components'>('charts');
  const canvasRef = useRef<HTMLDivElement>(null);

  const addChart = (template: typeof CHART_TEMPLATES[0]) => {
    // Get chart dimensions based on type
    const getChartDimensions = (type: string) => {
      switch (type) {
        case 'bar':
          return { width: 400, height: 300 };
        case 'donut':
          return { width: 350, height: 400 };
        case 'line':
          return { width: 450, height: 280 };
        case 'area':
          return { width: 450, height: 280 };
        case 'combo':
          return { width: 500, height: 350 };
        case 'table':
          return { width: 600, height: 400 };
        default:
          return { width: 400, height: 300 };
      }
    };

    const dimensions = getChartDimensions(template.type);
    
    const newChart: Chart = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      title: template.name,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      width: dimensions.width,
      height: dimensions.height,
      data: Array.isArray(template.defaultData) 
        ? [...template.defaultData] 
        : JSON.parse(JSON.stringify(template.defaultData)),
      titleColor: isDarkMode ? '#F3F4F6' : '#1F2937',
      titleSize: 16,
      titleWeight: 'medium',
      comments: []
    };
    setCharts(prev => [...prev, newChart]);
    setSelectedChart(newChart.id);
  };

  const updateChart = (id: string, updates: Partial<Chart>) => {
    setCharts(prev => prev.map(chart => 
      chart.id === id ? { ...chart, ...updates } : chart
    ));
  };

  const deleteChart = (id: string) => {
    setCharts(prev => prev.filter(chart => chart.id !== id));
    if (selectedChart === id) {
      setSelectedChart(null);
    }
  };

  // Comment management functions
  const addComment = (chartId: string, content: string, author: string = 'Reviewer') => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author,
      content,
      timestamp: new Date().toISOString(),
      resolved: false,
      replies: []
    };

    setCharts(prev => prev.map(chart => 
      chart.id === chartId 
        ? { ...chart, comments: [...chart.comments, newComment] }
        : chart
    ));
  };

  const resolveComment = (chartId: string, commentId: string) => {
    setCharts(prev => prev.map(chart => 
      chart.id === chartId 
        ? {
            ...chart, 
            comments: chart.comments.map(comment => 
              comment.id === commentId 
                ? { ...comment, resolved: !comment.resolved }
                : comment
            )
          }
        : chart
    ));
  };

  const deleteComment = (chartId: string, commentId: string) => {
    setCharts(prev => prev.map(chart => 
      chart.id === chartId 
        ? {
            ...chart, 
            comments: chart.comments.filter(comment => comment.id !== commentId)
          }
        : chart
    ));
  };

  const addReply = (chartId: string, commentId: string, content: string, author: string = 'Designer') => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author,
      content,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setCharts(prev => prev.map(chart => 
      chart.id === chartId 
        ? {
            ...chart, 
            comments: chart.comments.map(comment => 
              comment.id === commentId 
                ? { 
                    ...comment, 
                    replies: [...(comment.replies || []), newReply] 
                  }
                : comment
            )
          }
        : chart
    ));
  };

  const handleMouseDown = (e: React.MouseEvent, chartId: string) => {
    if (isPreviewMode) return;

    const chart = charts.find(c => c.id === chartId);
    if (!chart) return;

    setSelectedChart(chartId);
    setDraggedChart(chartId);

    // Calculate offset from the chart's current position
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      setDragOffset({
        x: e.clientX - canvasRect.left - chart.x,
        y: e.clientY - canvasRect.top - chart.y
      });
    }

    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedChart || !canvasRef.current) return;

    const chart = charts.find(c => c.id === draggedChart);
    if (!chart) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;

    // Use chart's actual dimensions for boundary constraints
    const maxX = canvasRef.current.scrollWidth - chart.width;
    const maxY = canvasRef.current.scrollHeight - chart.height;

    updateChart(draggedChart, {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
  };

  const handleMouseUp = () => {
    setDraggedChart(null);
  };

  // Add global event listeners for drag and drop
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (draggedChart) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [draggedChart, dragOffset.x, dragOffset.y]);

  const saveWireframe = () => {
    setIsSaving(true);
    const wireframeData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      projectName,
      isDarkMode,
      charts: charts.map(chart => ({ ...chart }))
    };

    localStorage.setItem('currentWireframe', JSON.stringify(wireframeData));
    
    const savedWireframes = JSON.parse(localStorage.getItem('savedWireframes') || '[]');
    const existingIndex = savedWireframes.findIndex((w: any) => w.projectName === projectName);
    
    if (existingIndex >= 0) {
      savedWireframes[existingIndex] = wireframeData;
    } else {
      savedWireframes.push(wireframeData);
    }
    
    localStorage.setItem('savedWireframes', JSON.stringify(savedWireframes));
    
    setTimeout(() => setIsSaving(false), 1000);
  };

  const exportWireframe = () => {
    const exportData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      projectName,
      isDarkMode,
      charts
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async () => {
    if (!canvasRef.current) return;
    
    try {
      // Show loading state
      setIsSaving(true);
      
      // Temporarily hide the customization panel for clean export
      const customizer = document.querySelector('[data-customizer]') as HTMLElement;
      const originalDisplay = customizer?.style.display;
      if (customizer) customizer.style.display = 'none';
      
      // Create canvas from the chart area
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        width: canvasRef.current.scrollWidth,
        height: canvasRef.current.scrollHeight
      });
      
      // Restore customization panel
      if (customizer) customizer.style.display = originalDisplay || '';
      
      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      
      // Add title page
      pdf.setFontSize(24);
      pdf.setTextColor(isDarkMode ? 255 : 0);
      pdf.text(projectName, 20, 30);
      
      pdf.setFontSize(12);
      pdf.setTextColor(128);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 45);
      pdf.text(`Charts: ${charts.length}`, 20, 55);
      pdf.text(`Theme: ${isDarkMode ? 'Dark' : 'Light'} Mode`, 20, 65);
      
      // Add wireframe content
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save(`${projectName.replace(/\s+/g, '_')}_wireframe.pdf`);
      
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const loadWireframe = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.charts) {
          setCharts(data.charts);
          setProjectName(data.projectName || 'Loaded Wireframe');
          setIsDarkMode(data.isDarkMode || false);
          setSelectedChart(null);
        }
      } catch (error) {
        alert('Invalid wireframe file');
      }
    };
    reader.readAsText(file);
  };

  const newProject = () => {
    if (charts.length > 0) {
      const confirmed = window.confirm('Start new project? Current work will be lost.');
      if (!confirmed) return;
    }
    setCharts([]);
    setSelectedChart(null);
    setProjectName('New Wireframe');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Auto-save
  useEffect(() => {
    if (charts.length > 0) {
      const autoSave = setTimeout(() => {
        const wireframeData = {
          version: '2.0',
          timestamp: new Date().toISOString(),
          projectName: projectName + ' (Auto-saved)',
          isDarkMode,
          charts
        };
        localStorage.setItem('currentWireframe', JSON.stringify(wireframeData));
      }, 5000);

      return () => clearTimeout(autoSave);
    }
  }, [charts, projectName, isDarkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveWireframe();
            break;
          case 'n':
            e.preventDefault();
            newProject();
            break;
          case 'd':
            e.preventDefault();
            toggleTheme();
            break;
          case 'e':
            e.preventDefault();
            if (charts.length > 0) exportAsPDF();
            break;
        }
      }
      if (e.key === 'Escape') {
        setSelectedChart(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedChartData = selectedChart ? charts.find(c => c.id === selectedChart) : null;

  // Theme classes
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const sidebarBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const headerBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputClass = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-gray-100' 
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`h-screen ${bgClass} flex`}>
      {/* Sidebar - Widget Library */}
      <div className={`w-80 ${sidebarBgClass} border-r ${borderClass} flex flex-col`}>
        {/* Header */}
        <div className={`p-6 border-b ${borderClass}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${textClass}`}>Widget Library</h2>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Toggle theme (Ctrl+D)"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Professional Tab Navigation */}
          <div className={`flex rounded-lg p-1 mb-4 relative overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            {/* Animated tab indicator */}
            <div 
              className={`absolute top-1 bottom-1 transition-all duration-300 ease-out rounded-md ${
                isDarkMode ? 'bg-blue-600' : 'bg-white border border-blue-200'
              }`}
              style={{
                width: '50%',
                left: activeTab === 'charts' ? '0%' : '50%',
                transform: 'translateX(4px)',
                right: activeTab === 'charts' ? '50%' : '0%'
              }}
            />
            
            <button
              onClick={() => setActiveTab('charts')}
              className={`relative z-10 flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'charts'
                  ? isDarkMode
                    ? 'text-white'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Charts
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`relative z-10 flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'components'
                  ? isDarkMode
                    ? 'text-white'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4" />
              Components
            </button>
          </div>
          
          <p className={`text-sm ${textSecondaryClass}`}>
            {activeTab === 'charts' 
              ? 'Drag charts to the canvas to visualize your data'
              : 'Drag components to build your interface'
            }
          </p>
        </div>

        {/* Widget Templates */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
          <div className="grid grid-cols-2 gap-3">
            {(activeTab === 'charts' ? getChartTemplates() : getComponentTemplates()).map((template) => {
              const IconComponent = template.icon;
              const colors = {
                bar: 'blue',
                donut: 'purple',
                line: 'green',
                area: 'orange',
                combo: 'cyan',
                table: 'indigo'
              };
              const color = colors[template.type] || 'blue';
              
              return (
                <button
                  key={template.type}
                  onClick={() => addChart(template)}
                  className={`relative p-4 border-2 border-dashed rounded-xl transition-all duration-200 group hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {/* Usage count badge */}
                  {charts.filter(c => c.type === template.type).length > 0 && (
                    <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDarkMode 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {charts.filter(c => c.type === template.type).length}
                    </div>
                  )}
                  
                  <div className="text-center space-y-3">
                    <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isDarkMode
                        ? `bg-${color}-900/20 group-hover:bg-${color}-900/30`
                        : `bg-${color}-100 group-hover:bg-${color}-200`
                    }`}>
                      <IconComponent className={`w-6 h-6 text-${color}-500 group-hover:scale-110 transition-transform`} />
                    </div>
                    <div>
                      <h3 className={`font-medium text-sm ${textClass} group-hover:text-${color}-600 transition-colors`}>{template.name}</h3>
                      <p className={`text-xs ${textSecondaryClass} mt-1`}>
                        {template.type === 'bar' && 'Compare values'}
                        {template.type === 'donut' && 'Show proportions'}
                        {template.type === 'line' && 'Track trends'}
                        {template.type === 'area' && 'Filled trends'}
                        {template.type === 'combo' && 'Bar + Line combo'}
                        {template.type === 'table' && 'Structured data'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Widget Summary */}
          {charts.length > 0 && (
            <div className={`mt-6 p-4 rounded-xl border ${
              isDarkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
            }`}>
              <h4 className={`font-medium mb-2 ${textClass}`}>
                {activeTab === 'charts' ? 'Chart Summary' : 'Component Summary'}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {activeTab === 'charts' ? (
                  // Chart counts
                  ['bar', 'donut', 'line', 'area', 'combo'].map(type => {
                    const count = charts.filter(c => c.type === type).length;
                    return count > 0 ? (
                      <div key={type} className={`flex justify-between ${textSecondaryClass}`}>
                        <span className="capitalize">{type}:</span>
                        <span>{count}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  // Component counts
                  ['table'].map(type => {
                    const count = charts.filter(c => c.type === type).length;
                    return count > 0 ? (
                      <div key={type} className={`flex justify-between ${textSecondaryClass}`}>
                        <span className="capitalize">{type}:</span>
                        <span>{count}</span>
                      </div>
                    ) : null;
                  })
                )}
              </div>
              
              {/* Total count with context */}
              <div className={`mt-3 pt-3 border-t ${
                isDarkMode ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className={`flex justify-between font-medium ${textClass}`}>
                  <span>Total {activeTab}:</span>
                  <span>{activeTab === 'charts' 
                    ? charts.filter(c => ['bar', 'donut', 'line', 'area', 'combo'].includes(c.type)).length
                    : charts.filter(c => c.type === 'table').length
                  }</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t ${borderClass}`}>
          <div className={`text-sm text-center ${textSecondaryClass}`}>
            {activeTab === 'charts' 
              ? `${charts.filter(c => ['bar', 'donut', 'line', 'area', 'combo'].includes(c.type)).length} chart${charts.filter(c => ['bar', 'donut', 'line', 'area', 'combo'].includes(c.type)).length !== 1 ? 's' : ''} added`
              : `${charts.filter(c => c.type === 'table').length} component${charts.filter(c => c.type === 'table').length !== 1 ? 's' : ''} added`
            }
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className={`${headerBgClass} border-b ${borderClass} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={`text-xl font-semibold bg-transparent border-none outline-none focus:bg-opacity-50 px-2 py-1 rounded ${inputClass}`}
              />
             
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={newProject}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                New
              </button>

              <button
                onClick={saveWireframe}
                disabled={isSaving}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isSaving 
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-gray-100 text-gray-400'
                    : isDarkMode
                      ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>

              {/* Export Options */}
              <div className="flex items-center gap-1">
                <button
                  onClick={exportAsPDF}
                  disabled={isSaving || charts.length === 0}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    isSaving || charts.length === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                  title="Export as PDF"
                >
                  <Download className="w-4 h-4" />
                  {isSaving ? 'Exporting...' : 'PDF'}
                </button>
                
                <button
                  onClick={exportWireframe}
                  disabled={charts.length === 0}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    charts.length === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                  title="Export as JSON"
                >
                  <FileText className="w-4 h-4" />
                  JSON
                </button>
              </div>

              <label className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                isDarkMode
                  ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}>
                <Upload className="w-4 h-4" />
                Load
                <input
                  type="file"
                  accept=".json"
                  onChange={loadWireframe}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isPreviewMode 
                    ? isDarkMode
                      ? 'bg-blue-900/20 text-blue-400'
                      : 'bg-blue-100 text-blue-700'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={`flex-1 relative overflow-auto ${bgClass} ${draggedChart ? 'select-none' : ''}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedChart(null);
            }
          }}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, ${isDarkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px),
                linear-gradient(to bottom, ${isDarkMode ? '#374151' : '#e5e7eb'} 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Charts */}
          {charts.map((chart) => {
            const isBeingDragged = draggedChart === chart.id;
            const commonProps = {
              id: chart.id,
              title: chart.title,
              data: chart.data,
              x: chart.x,
              y: chart.y,
              width: chart.width,
              height: chart.height,
              isSelected: selectedChart === chart.id && !isPreviewMode,
              onSelect: setSelectedChart,
              onUpdate: updateChart,
              onDelete: deleteChart,
              titleColor: chart.titleColor,
              titleSize: chart.titleSize,
              titleWeight: chart.titleWeight,
              isDarkMode
            };

            return (
              <div
                key={chart.id}
                onMouseDown={(e) => handleMouseDown(e, chart.id)}
                className={`relative transition-opacity duration-150 ${isBeingDragged ? 'opacity-75 z-50' : 'z-10'}`}
                style={{ 
                  cursor: isPreviewMode ? 'default' : draggedChart === chart.id ? 'grabbing' : 'grab'
                }}
              >
                {/* Comment Indicator */}
                {chart.comments.length > 0 && (
                  <div 
                    className="absolute -top-2 -right-2 z-20"
                    style={{ pointerEvents: 'none' }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      chart.comments.some(c => !c.resolved) 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {chart.comments.length}
                    </div>
                  </div>
                )}
                
                {/* Chart Component */}
                {chart.type === 'bar' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                  <DarkModeBarChart {...commonProps} type="bar" data={chart.data as { name: string; value: number; color: string }[]} />
                ) : chart.type === 'donut' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                  <DarkModeDonutChart {...commonProps} type="donut" data={chart.data as { name: string; value: number; color: string }[]} />
                ) : chart.type === 'line' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                  <RechartsLineChart {...commonProps} type="line" data={chart.data as { name: string; value: number; color: string }[]} />
                ) : chart.type === 'area' && Array.isArray(chart.data) && chart.data.length > 0 && 'value' in chart.data[0] ? (
                  <RechartsAreaChart {...commonProps} type="area" data={chart.data as { name: string; value: number; color: string }[]} />
                ) : chart.type === 'combo' && Array.isArray(chart.data) && chart.data.length > 0 && 'barValue' in chart.data[0] ? (
                  <ShadcnComboChart {...commonProps} type="combo" data={chart.data as { name: string; barValue: number; lineValue: number; barColor?: string; lineColor?: string }[]} />
                ) : chart.type === 'table' && !Array.isArray(chart.data) ? (
                  <ShadcnTable {...commonProps} type="table" data={chart.data} />
                ) : (
                  // Fallback for debugging
                  <div 
                    className="absolute bg-red-100 border-2 border-red-500 p-4 rounded-lg"
                    style={{ left: chart.x, top: chart.y, width: chart.width, height: chart.height }}
                  >
                    <div className="text-red-600 font-bold">Debug: Chart type: {chart.type}</div>
                    <div className="text-red-600">Data type: {Array.isArray(chart.data) ? 'Array' : 'Object'}</div>
                    {Array.isArray(chart.data) && (
                      <div className="text-red-600">Data length: {chart.data.length}</div>
                    )}
                    {Array.isArray(chart.data) && chart.data.length > 0 && (
                      <div className="text-red-600">First item keys: {Object.keys(chart.data[0]).join(', ')}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {charts.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <h2 className={`text-2xl font-semibold mb-2 ${textSecondaryClass}`}>
                  Start Building Your Wireframe
                </h2>
                <p className={`mb-6 max-w-md ${textSecondaryClass}`}>
                  Add charts from the library to create your dashboard wireframe
                </p>
                <button
                  onClick={() => addChart(CHART_TEMPLATES[0])}
                  className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto ${
                    isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Chart
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        {!isPreviewMode && charts.length > 0 && (
          <div className={`border-t p-3 ${
            isDarkMode 
              ? 'bg-blue-900/20 border-blue-700/50' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className={`text-sm ${
              isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              <strong>💡 Tips:</strong> Click charts to customize • Drag to reposition • Ctrl+E for PDF export • Perfect for client presentations
            </div>
          </div>
        )}
      </div>

      {/* Customization Panel */}
      <div data-customizer>
        <EnhancedChartCustomizer
          selectedChart={selectedChartData}
          onUpdateChart={updateChart}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onAddComment={addComment}
          onResolveComment={resolveComment}
          onDeleteComment={deleteComment}
          onAddReply={addReply}
        />
      </div>
    </div>
  );
}
