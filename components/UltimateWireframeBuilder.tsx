'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart3, PieChart, Save, FolderOpen, FileText, 
  Download, Upload, Eye, EyeOff, Grid, Plus, Moon, Sun,
  TrendingUp, Activity, Table, BarChart2, Square, Type, Image,
  AlignLeft, Menu, ChevronDown, Check, MousePointer,
  AlertTriangle, UserCircle, Tag, ToggleLeft, Sliders,
  Minus as DividerIcon, Copy, Trash2, Edit3, Layers,
  ChevronLeft, ChevronRight, X, Sparkles, Code,
  Share2, Circle
} from 'lucide-react';
import { DarkModeBarChart, DarkModeDonutChart, DEFAULT_COLORS } from './DarkModeCharts';
import { RechartsLineChart, RechartsAreaChart } from './RechartsComponents';
import { ShadcnTable } from './ShadcnTable';
import { ShadcnComboChart } from './ShadcnComboChart';
import ShadcnMultiBarChart, { MultiBarChartData } from './ShadcnMultiBarChart';
import { 
  WireframeButton, WireframeInput, WireframeText, WireframeImage,
  WireframeCard, WireframeNavigation, WireframeDropdown, 
  WireframeCheckbox, WireframeProgress, WireframeAlert,
  WireframeAvatar, WireframeBadge, WireframeSwitch,
  WireframeSlider, WireframeTextarea, WireframeSeparator,
  WireframeIconButton
} from './WireframeComponents';
import { WireframeRadioButton } from './WireframeRadioButton';
import EnhancedChartCustomizer from './EnhancedChartCustomizer';
import FixframeAI from './FixframeAI';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ShareModal from './ShareModal';
import CommentSystem from './CommentSystem';

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
  type: 'bar' | 'donut' | 'line' | 'area' | 'table' | 'combo' | 'multibar' | 'button' | 'iconbutton' | 'input' | 'text' | 'image' | 'card' | 'navigation' | 'dropdown' | 'checkbox' | 'progress' | 'alert' | 'avatar' | 'badge' | 'switch' | 'slider' | 'textarea' | 'separator' | 'radio';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: { name: string; value: number; color: string }[] | { name: string; barValue: number; lineValue: number; barColor?: string; lineColor?: string }[] | MultiBarChartData[] | {
    columns: Array<{ id: string; name: string; width: number; type: 'text' | 'number' | 'date' | 'email' | 'url'; sortable: boolean; align: 'left' | 'center' | 'right' }>;
    rows: Array<{ id: string; cells: Record<string, { id: string; content: string; type: 'text' | 'number' | 'date' | 'email' | 'url' }> }>;
    showHeader: boolean;
    showBorder: boolean;
    striped: boolean;
    compact: boolean;
    roundedCorners: boolean;
  } | { text: string; checked: boolean } | { progress: number; text: string } | { options: string[]; selected: string; label: string } | any;
  titleColor: string;
  titleSize: number;
  titleWeight: string;
  comments: Comment[];
  pageId: string; // Add page reference
}

interface Page {
  id: string;
  name: string;
  charts: Chart[];
  isActive: boolean;
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
    type: 'multibar' as const,
    name: 'Multi Bar Chart',
    icon: BarChart3,
    category: 'charts',
    defaultData: [
      { name: 'Q1', series1: 120, series2: 150, series3: 80, series1Color: DEFAULT_COLORS[0], series2Color: DEFAULT_COLORS[1], series3Color: DEFAULT_COLORS[2] },
      { name: 'Q2', series1: 180, series2: 200, series3: 160, series1Color: DEFAULT_COLORS[0], series2Color: DEFAULT_COLORS[1], series3Color: DEFAULT_COLORS[2] },
      { name: 'Q3', series1: 150, series2: 170, series3: 140, series1Color: DEFAULT_COLORS[0], series2Color: DEFAULT_COLORS[1], series3Color: DEFAULT_COLORS[2] },
      { name: 'Q4', series1: 200, series2: 220, series3: 190, series1Color: DEFAULT_COLORS[0], series2Color: DEFAULT_COLORS[1], series3Color: DEFAULT_COLORS[2] }
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
  },
  // Wireframe UI Components
  {
    type: 'button' as const,
    name: 'Button',
    icon: Square,
    category: 'components',
    defaultData: {
      text: 'Click Me',
      type: 'primary'
    }
  },
  // Icon Button Templates (new iconbutton type)
  {
    type: 'iconbutton' as const,
    name: 'Save',
    icon: Save,
    category: 'icons',
    defaultData: { icon: 'Save' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Download',
    icon: Download,
    category: 'icons',
    defaultData: { icon: 'Download' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Upload',
    icon: Upload,
    category: 'icons',
    defaultData: { icon: 'Upload' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Share',
    icon: Share2,
    category: 'icons',
    defaultData: { icon: 'Share' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Edit',
    icon: Edit3,
    category: 'icons',
    defaultData: { icon: 'Edit' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Delete',
    icon: Trash2,
    category: 'icons',
    defaultData: { icon: 'Delete' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Copy',
    icon: Copy,
    category: 'icons',
    defaultData: { icon: 'Copy' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Tag',
    icon: Tag,
    category: 'icons',
    defaultData: { icon: 'Tag' }
  },
  {
    type: 'iconbutton' as const,
    name: 'User',
    icon: UserCircle,
    category: 'icons',
    defaultData: { icon: 'User' }
  },
  {
    type: 'iconbutton' as const,
    name: 'Code',
    icon: Code,
    category: 'icons',
    defaultData: { icon: 'Code' }
  },
  {
    type: 'input' as const,
    name: 'Input Field',
    icon: Type,
    category: 'components',
    defaultData: {
      placeholder: 'Enter text...',
      type: 'text'
    }
  },
  {
    type: 'text' as const,
    name: 'Text Label',
    icon: AlignLeft,
    category: 'components',
    defaultData: {
      content: 'Sample Text',
      size: 'medium',
      align: 'left'
    }
  },
  {
    type: 'image' as const,
    name: 'Image',
    icon: Image,
    category: 'components',
    defaultData: {
      type: 'placeholder',
      text: 'Image'
    }
  },
  {
    type: 'card' as const,
    name: 'Card',
    icon: Square,
    category: 'components',
    defaultData: {
      cardTitle: 'Card Title',
      content: 'Card content goes here...'
    }
  },
  {
    type: 'navigation' as const,
    name: 'Navigation',
    icon: Menu,
    category: 'components',
    defaultData: {
      items: ['Home', 'About', 'Services', 'Contact']
    }
  },
  {
    type: 'dropdown' as const,
    name: 'Dropdown',
    icon: ChevronDown,
    category: 'components',
    defaultData: {
      selected: 'Select option...',
      options: ['Option 1', 'Option 2', 'Option 3']
    }
  },
  {
    type: 'checkbox' as const,
    name: 'Checkbox',
    icon: Check,
    category: 'components',
    defaultData: {
      text: 'Checkbox option',
      checked: false
    }
  },
  {
    type: 'radio' as const,
    name: 'Radio Button',
    icon: Circle,
    category: 'components',
    defaultData: {
      options: ['Option 1', 'Option 2', 'Option 3'],
      selected: 'Option 1',
      label: 'Select an option',
      color: '#3B82F6',
      borderColor: '#D1D5DB',
      layout: 'horizontal',
      size: 'medium',
      spacing: 'medium',
      labelSize: 'medium'
    }
  },
  {
    type: 'progress' as const,
    name: 'Progress Bar',
    icon: BarChart3,
    category: 'components',
    defaultData: {
      progress: 65,
      text: 'Progress'
    }
  },
  {
    type: 'alert' as const,
    name: 'Alert',
    icon: AlertTriangle,
    category: 'components',
    defaultData: {
      alertTitle: 'Alert',
      message: 'This is an alert message',
      type: 'info'
    }
  },
  {
    type: 'avatar' as const,
    name: 'Avatar',
    icon: UserCircle,
    category: 'components',
    defaultData: {
      text: 'JD',
      size: 'medium',
      hasImage: false
    }
  },
  {
    type: 'badge' as const,
    name: 'Badge',
    icon: Tag,
    category: 'components',
    defaultData: {
      text: 'Badge',
      variant: 'default'
    }
  },
  {
    type: 'switch' as const,
    name: 'Switch',
    icon: ToggleLeft,
    category: 'components',
    defaultData: {
      text: 'Switch',
      isOn: false
    }
  },
  {
    type: 'slider' as const,
    name: 'Slider',
    icon: Sliders,
    category: 'components',
    defaultData: {
      value: 50,
      label: 'Slider'
    }
  },
  {
    type: 'textarea' as const,
    name: 'Textarea',
    icon: FileText,
    category: 'components',
    defaultData: {
      placeholder: 'Enter your message...'
    }
  },
  {
    type: 'separator' as const,
    name: 'Separator',
    icon: DividerIcon,
    category: 'components',
    defaultData: {
      orientation: 'horizontal'
    }
  }
];

// Helper functions to filter templates by category
const getChartTemplates = () => CHART_TEMPLATES.filter(template => template.category === 'charts');
const getComponentTemplates = () => CHART_TEMPLATES.filter(template => template.category === 'components');
const getIconTemplates = () => CHART_TEMPLATES.filter(template => template.category === 'icons');

interface UltimateWireframeBuilderProps {
  projectId?: string | null;
  initialProject?: any;
  onThemeChange?: (isDark: boolean) => void;
}

export default function UltimateWireframeBuilder({ 
  projectId, 
  initialProject, 
  onThemeChange 
}: UltimateWireframeBuilderProps = {}) {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projectName, setProjectName] = useState('My Wireframe');
  const [isSaving, setIsSaving] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isPublicAccess, setIsPublicAccess] = useState(false);
  const [draggedChart, setDraggedChart] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedTemplate, setDraggedTemplate] = useState<typeof CHART_TEMPLATES[0] | null>(null);
  const [isDraggingFromSidebar, setIsDraggingFromSidebar] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [showFixframeAI, setShowFixframeAI] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'charts' | 'components' | 'slides'>('charts');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPdfOptions, setShowPdfOptions] = useState(false);
  const [selectedSlides, setSelectedSlides] = useState<string[]>([]);
  // Resize state
  const [resizingChartId, setResizingChartId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<
    null | 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
  >(null);
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; x: number; y: number; width: number; height: number; aspect: number } | null>(null);
  const resizeFrameRef = useRef<number | null>(null);
  const resizeLatestRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  // Drag throttle state
  const dragFrameRef = useRef<number | null>(null);
  const dragLatestRef = useRef<{ id: string; x: number; y: number } | null>(null);

  // Slide system state
  const [pages, setPages] = useState<Page[]>([
    { id: 'page-1', name: 'Slide 1', charts: [], isActive: true }
  ]);
  const [currentPageId, setCurrentPageId] = useState('page-1');


  // Load project data on component mount
  useEffect(() => {
    if (initialProject) {
      // Load from MongoDB project data
      setProjectName(initialProject.name || 'My Wireframe');

      // Check if this is a shared project and set permissions
      if (initialProject.isShared || initialProject.isPublicAccess) {
        setIsPublicAccess(true);
        
        // Set view-only mode based on permission level
        if (initialProject.userPermission === 'view') {
          setIsViewOnly(true);
        } else if (initialProject.userPermission === 'edit') {
          setIsViewOnly(false); // Edit permission allows editing
        }
      }
      
      // Handle both old format (charts) and new format (pages)
      if (initialProject.pages) {
        setPages(initialProject.pages);
        setCurrentPageId(initialProject.currentPageId || initialProject.pages[0]?.id || 'page-1');
      } else if (initialProject.charts) {
        // Convert old format to new format
        const convertedPages = [{
          id: 'page-1',
          name: 'Slide 1',
          charts: initialProject.charts.map((chart: any) => ({ ...chart, pageId: 'page-1', comments: chart.comments || [] })),
          isActive: true
        }];
        setPages(convertedPages);
        setCurrentPageId('page-1');
      }
      
      if (typeof initialProject.isDarkMode === 'boolean') {
        setIsDarkMode(initialProject.isDarkMode);
      }
    } else {
      // Fallback to localStorage
    const currentWireframe = localStorage.getItem('currentWireframe');
    if (currentWireframe) {
      try {
        const wireframeData = JSON.parse(currentWireframe);
          
          // Handle both old format (charts) and new format (pages)
          if (wireframeData.pages) {
            setPages(wireframeData.pages);
            setCurrentPageId(wireframeData.currentPageId || wireframeData.pages[0]?.id || 'page-1');
          } else if (wireframeData.charts) {
            // Convert old format to new format
            const convertedPages = [{
              id: 'page-1',
              name: 'Slide 1',
              charts: wireframeData.charts.map((chart: any) => ({ ...chart, pageId: 'page-1', comments: chart.comments || [] })),
              isActive: true
            }];
            setPages(convertedPages);
            setCurrentPageId('page-1');
          }
          
        if (wireframeData.projectName) {
          setProjectName(wireframeData.projectName);
        }
          // Always default to dark mode, ignore saved preference
          setIsDarkMode(true);
          
          // Update localStorage to ensure dark mode is saved
          const updatedWireframeData = {
            ...wireframeData,
            isDarkMode: true
          };
          localStorage.setItem('currentWireframe', JSON.stringify(updatedWireframeData));
      } catch (error) {
        console.error('Error loading project data:', error);
      }
    }
    }
  }, [initialProject]);

  // Notify parent component when theme changes
  useEffect(() => {
    if (onThemeChange) {
      onThemeChange(isDarkMode);
    }
  }, [isDarkMode, onThemeChange]);

  // Auto-save when pages change (debounced)
  useEffect(() => {
    if (projectId && pages.length > 0) {
      const timeoutId = setTimeout(() => {
        saveWireframe();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [pages, projectName, isDarkMode, projectId]);

  const addChart = (template: typeof CHART_TEMPLATES[0], x?: number, y?: number) => {
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
        case 'multibar':
          return { width: 480, height: 350 };
        case 'table':
          return { width: 600, height: 400 };
        case 'button':
          return { width: 120, height: 80 };
        case 'iconbutton':
          return { width: 140, height: 60 };
        case 'input':
          return { width: 200, height: 80 };
        case 'text':
          return { width: 200, height: 60 };
        case 'image':
          return { width: 200, height: 150 };
        case 'card':
          return { width: 300, height: 200 };
        case 'navigation':
          return { width: 400, height: 80 };
        case 'dropdown':
          return { width: 180, height: 80 };
        case 'checkbox':
          return { width: 150, height: 60 };
        case 'radio':
          return { width: 200, height: 120 };
        case 'progress':
          return { width: 250, height: 80 };
        default:
          return { width: 400, height: 300 };
      }
    };

    const dimensions = getChartDimensions(template.type);
    
    const newChart: Chart = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      title: template.name,
      x: x !== undefined ? x : Math.random() * 300 + 50,
      y: y !== undefined ? y : Math.random() * 200 + 50,
      width: dimensions.width,
      height: dimensions.height,
      data: Array.isArray(template.defaultData) 
        ? [...template.defaultData] 
        : JSON.parse(JSON.stringify(template.defaultData)),
      titleColor: isDarkMode ? '#F3F4F6' : '#1F2937',
      titleSize: 16,
      titleWeight: 'medium',
      comments: [],
      pageId: currentPageId
    };
    
    // Add chart to current page
    setPages(prev => prev.map(page => 
      page.id === currentPageId 
        ? { ...page, charts: [...page.charts, newChart] }
        : page
    ));
    
    setSelectedChart(newChart.id);
  };

  const updateChart = (id: string, updates: Partial<Chart>) => {
    setPages(prev => prev.map(page => ({
      ...page,
      charts: page.charts.map(chart => 
      chart.id === id ? { ...chart, ...updates } : chart
      )
    })));
  };

  const deleteChart = (id: string) => {
    setPages(prev => prev.map(page => ({
      ...page,
      charts: page.charts.filter(chart => chart.id !== id)
    })));
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

    setPages(prev => prev.map(page => ({
      ...page,
      charts: page.charts.map(chart => 
      chart.id === chartId 
          ? { ...chart, comments: [...(chart.comments || []), newComment] }
        : chart
      )
    })));
  };

  const resolveComment = (chartId: string, commentId: string) => {
    setPages(prev => prev.map(page => ({
      ...page,
      charts: page.charts.map(chart => 
      chart.id === chartId 
        ? {
            ...chart, 
            comments: (chart.comments || []).map(comment =>
              comment.id === commentId 
                ? { ...comment, resolved: !comment.resolved }
                : comment
            )
          }
        : chart
      )
    })));
  };

  const deleteComment = (chartId: string, commentId: string) => {
    setPages(prev => prev.map(page => ({
      ...page,
      charts: page.charts.map(chart => 
      chart.id === chartId 
        ? {
            ...chart, 
            comments: (chart.comments || []).filter(comment => comment.id !== commentId)
          }
        : chart
      )
    })));
  };

  const addReply = (chartId: string, commentId: string, content: string, author: string = 'Designer') => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author,
      content,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setPages(prev => prev.map(page => ({
      ...page,
      charts: page.charts.map(chart => 
      chart.id === chartId 
        ? {
            ...chart, 
            comments: (chart.comments || []).map(comment =>
              comment.id === commentId 
                ? { 
                    ...comment, 
                    replies: [...(comment.replies || []), newReply] 
                  }
                : comment
            )
          }
        : chart
      )
    })));
  };

  const handleMouseDown = (e: React.MouseEvent, chartId: string) => {
    if (isViewOnly) return; // Disable dragging in view-only mode
    
    const currentPageCharts = getCurrentPageCharts();
    const chart = currentPageCharts.find(c => c.id === chartId);
    if (!chart) return;

    setSelectedChart(chartId);
    setDraggedChart(chartId);

    // Calculate offset from the chart's current position
    // Use pageX/pageY which already includes scroll
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect && canvasRef.current) {
      setDragOffset({
        x: e.pageX - canvasRect.left - chart.x,
        y: e.pageY - canvasRect.top - chart.y
      });
    }

    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedChart || !canvasRef.current) return;

    const currentPageCharts = getCurrentPageCharts();
    const chart = currentPageCharts.find(c => c.id === draggedChart);
    if (!chart) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    // Use pageX/pageY which already includes scroll
    const x = e.pageX - canvasRect.left - dragOffset.x;
    const y = e.pageY - canvasRect.top - dragOffset.y;

    // Use chart's actual dimensions for boundary constraints
    const maxX = canvasRef.current.scrollWidth - chart.width;
    const maxY = canvasRef.current.scrollHeight - chart.height;
    const nx = Math.max(0, Math.min(x, maxX));
    const ny = Math.max(0, Math.min(y, maxY));
    dragLatestRef.current = { id: draggedChart, x: nx, y: ny };
    if (dragFrameRef.current == null) {
      dragFrameRef.current = requestAnimationFrame(() => {
        const latest = dragLatestRef.current;
        if (latest) {
          updateChart(latest.id, { x: latest.x, y: latest.y });
        }
        dragFrameRef.current = null;
      });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!draggedChart || !canvasRef.current) {
      setDraggedChart(null);
      return;
    }

    // Ensure final position is set with real-time coordinates
    const currentPageCharts = getCurrentPageCharts();
    const chart = currentPageCharts.find(c => c.id === draggedChart);
    if (chart) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      // Use pageX/pageY which already includes scroll
      const x = e.pageX - canvasRect.left - dragOffset.x;
      const y = e.pageY - canvasRect.top - dragOffset.y;

    // Use chart's actual dimensions for boundary constraints
    const maxX = canvasRef.current.scrollWidth - chart.width;
    const maxY = canvasRef.current.scrollHeight - chart.height;

    updateChart(draggedChart, {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
    }

    setDraggedChart(null);
  };

  // Resize handlers
  const startResize = (e: React.MouseEvent, chartId: string, handle: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw') => {
    if (isViewOnly) return;
    e.stopPropagation();
    e.preventDefault();
    const chart = getCurrentPageCharts().find(c => c.id === chartId);
    if (!chart) return;
    setSelectedChart(chartId);
    setResizingChartId(chartId);
    setResizeHandle(handle);
    resizeStartRef.current = {
      mouseX: e.pageX,
      mouseY: e.pageY,
      x: chart.x,
      y: chart.y,
      width: chart.width,
      height: chart.height,
      aspect: chart.width / Math.max(1, chart.height)
    };
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingChartId || !resizeHandle || !resizeStartRef.current) return;
    const start = resizeStartRef.current;
    let newX = start.x;
    let newY = start.y;
    let newW = start.width;
    let newH = start.height;
    const dx = e.pageX - start.mouseX;
    const dy = e.pageY - start.mouseY;

    const minW = 120;
    const minH = 100;

    const applyAspect = (corner: 'ne' | 'nw' | 'se' | 'sw') => {
      // Maintain aspect ratio on diagonal handles
      const signX = corner === 'ne' || corner === 'se' ? 1 : -1;
      const signY = corner === 'se' || corner === 'sw' ? 1 : -1;
      const proj = Math.abs(dx) > Math.abs(dy) ? dx : dy * start.aspect;
      newW = Math.max(minW, start.width + proj * signX);
      newH = Math.max(minH, newW / start.aspect);
      if (corner === 'nw' || corner === 'sw') newX = start.x + (start.width - newW);
      if (corner === 'nw' || corner === 'ne') newY = start.y + (start.height - newH);
    };

    switch (resizeHandle) {
      case 'e':
        newW = Math.max(minW, start.width + dx);
        break;
      case 'w':
        newW = Math.max(minW, start.width - dx);
        newX = start.x + (start.width - newW);
        break;
      case 's':
        newH = Math.max(minH, start.height + dy);
        break;
      case 'n':
        newH = Math.max(minH, start.height - dy);
        newY = start.y + (start.height - newH);
        break;
      case 'ne':
        applyAspect('ne');
        break;
      case 'nw':
        applyAspect('nw');
        break;
      case 'se':
        applyAspect('se');
        break;
      case 'sw':
        applyAspect('sw');
        break;
    }

    if (canvasRef.current) {
      const maxX = Math.max(0, canvasRef.current.scrollWidth - newW);
      const maxY = Math.max(0, canvasRef.current.scrollHeight - newH);
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
    }

    // Schedule resize update with rAF to keep it smooth
    resizeLatestRef.current = { x: newX, y: newY, width: newW, height: newH };
    if (resizeFrameRef.current == null) {
      resizeFrameRef.current = requestAnimationFrame(() => {
        const latest = resizeLatestRef.current;
        if (latest && resizingChartId) {
          updateChart(resizingChartId, latest);
        }
        resizeFrameRef.current = null;
      });
    }
  };

  const stopResize = () => {
    setResizingChartId(null);
    setResizeHandle(null);
    resizeStartRef.current = null;
    if (resizeFrameRef.current) {
      cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = null;
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (resizingChartId) handleResizeMove(e);
      else handleMouseMove(e);
    };
    const onUp = (e: MouseEvent) => {
      if (resizingChartId) stopResize();
      handleMouseUp(e);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [resizingChartId]);

  // Handle drag start from sidebar
  const handleSidebarMouseDown = (e: React.MouseEvent, template: typeof CHART_TEMPLATES[0]) => {
    if (isViewOnly) return; // Disable sidebar dragging in view-only mode
    
    e.preventDefault();
    setDraggedTemplate(template);
    setIsDraggingFromSidebar(true);

    // Store the initial mouse position relative to the template
    // This will be used to maintain the same offset when dropping
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = {
      x: e.pageX - rect.left,
      y: e.pageY - rect.top
    };
    
    // Store in both state and ref for synchronous access
    setDragOffset(offset);
    dragOffsetRef.current = offset;
  };

  // Handle mouse move for sidebar drag
  const handleSidebarMouseMove = (e: MouseEvent) => {
    if (!isDraggingFromSidebar || !draggedTemplate || !canvasRef.current) return;

    // Update visual feedback - could show a preview element following the cursor
    // For now, we'll just track the mouse position for precise drop calculation
  };

  // Handle mouse up for sidebar drag (drop)
  const handleSidebarMouseUp = (e: MouseEvent) => {
    if (!isDraggingFromSidebar || !draggedTemplate || !canvasRef.current) {
      setIsDraggingFromSidebar(false);
      setDraggedTemplate(null);
      return;
    }

    // Get real-time canvas container position
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Calculate drop coordinates relative to canvas container
    // Use pageX/pageY which already includes scroll, and ref-based offset for precise positioning
    const dropX = e.pageX - rect.left - dragOffsetRef.current.x;
    const dropY = e.pageY - rect.top - dragOffsetRef.current.y;

    

    // Get actual template dimensions for boundary checking
    const getTemplateDimensions = (type: string) => {
      switch (type) {
        case 'bar': return { width: 400, height: 300 };
        case 'donut': return { width: 350, height: 400 };
        case 'line': return { width: 450, height: 280 };
        case 'area': return { width: 450, height: 280 };
        case 'combo': return { width: 500, height: 350 };
        case 'multibar': return { width: 480, height: 350 };
        case 'table': return { width: 600, height: 400 };
        case 'button': return { width: 120, height: 80 };
        case 'input': return { width: 200, height: 80 };
        case 'text': return { width: 200, height: 60 };
        case 'image': return { width: 200, height: 150 };
        case 'card': return { width: 300, height: 200 };
        case 'navigation': return { width: 400, height: 80 };
        case 'dropdown': return { width: 180, height: 80 };
        case 'checkbox': return { width: 150, height: 60 };
        case 'radio': return { width: 200, height: 120 };
        case 'progress': return { width: 250, height: 80 };
        default: return { width: 400, height: 300 };
      }
    };

    const templateDimensions = getTemplateDimensions(draggedTemplate.type);

    // Ensure the element stays within canvas bounds
    const maxX = canvasRef.current.scrollWidth - templateDimensions.width;
    const maxY = canvasRef.current.scrollHeight - templateDimensions.height;

    const finalX = Math.max(0, Math.min(dropX, maxX));
    const finalY = Math.max(0, Math.min(dropY, maxY));

    // Add the chart at the exact drop position
    addChart(draggedTemplate, finalX, finalY);

    // Reset drag state
    setIsDraggingFromSidebar(false);
    setDraggedTemplate(null);
  };

  // Add global event listeners for drag and drop
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggedChart) {
      handleMouseMove(e);
      } else if (isDraggingFromSidebar) {
        handleSidebarMouseMove(e);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (draggedChart) {
        handleMouseUp(e);
      } else if (isDraggingFromSidebar) {
        handleSidebarMouseUp(e);
      }
    };

    if (draggedChart || isDraggingFromSidebar) {
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
  }, [draggedChart, isDraggingFromSidebar, dragOffset.x, dragOffset.y]);

  // Slide management functions
  const addNewPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage: Page = {
      id: newPageId,
      name: `Slide ${pages.length + 1}`,
      charts: [],
      isActive: false
    };
    
    setPages(prev => prev.map(p => ({ ...p, isActive: false })).concat(newPage));
    setCurrentPageId(newPageId);
  };

  const switchToPage = (pageId: string) => {
    setPages(prev => prev.map(p => ({ ...p, isActive: p.id === pageId })));
    setCurrentPageId(pageId);
    setSelectedChart(null);
  };

  const deletePage = (pageId: string) => {
    if (pages.length <= 1) return; // Don't delete the last page
    
    setPages(prev => {
      const filtered = prev.filter(p => p.id !== pageId);
      // If deleting current page, switch to first available page
      if (pageId === currentPageId && filtered.length > 0) {
        setCurrentPageId(filtered[0].id);
        filtered[0].isActive = true;
      }
      return filtered;
    });
  };

  const duplicatePage = (pageId: string) => {
    const pageToDuplicate = pages.find(p => p.id === pageId);
    if (!pageToDuplicate) return;

    const newPageId = `page-${Date.now()}`;
    const duplicatedCharts = pageToDuplicate.charts.map(chart => ({
      ...chart,
      id: `${chart.id}-copy-${Date.now()}`,
      pageId: newPageId,
      comments: chart.comments || []
    }));

    const newPage: Page = {
      id: newPageId,
      name: `${pageToDuplicate.name} (Copy)`,
      charts: duplicatedCharts,
      isActive: false
    };

    setPages(prev => prev.map(p => ({ ...p, isActive: false })).concat(newPage));
    setCurrentPageId(newPageId);
  };

  const renamePage = (pageId: string, newName: string) => {
    setPages(prev => prev.map(p => 
      p.id === pageId ? { ...p, name: newName } : p
    ));
  };

  const getCurrentPage = () => pages.find(p => p.id === currentPageId);
  const getCurrentPageCharts = () => getCurrentPage()?.charts || [];

  const saveWireframe = async () => {
    setIsSaving(true);
    const start = Date.now();
    
    try {
    const wireframeData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      projectName,
      isDarkMode,
        pages: pages.map(page => ({ ...page })),
        currentPageId
    };

      // Save to localStorage as backup
    localStorage.setItem('currentWireframe', JSON.stringify(wireframeData));
    
    const savedWireframes = JSON.parse(localStorage.getItem('savedWireframes') || '[]');
    const existingIndex = savedWireframes.findIndex((w: any) => w.projectName === projectName);
    
    if (existingIndex >= 0) {
      savedWireframes[existingIndex] = wireframeData;
    } else {
      savedWireframes.push(wireframeData);
    }
    
    localStorage.setItem('savedWireframes', JSON.stringify(savedWireframes));
    
      // Save to MongoDB if projectId is available
      if (projectId) {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: projectName,
            pages: pages,
            currentPageId: currentPageId,
            isDarkMode: isDarkMode
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save to MongoDB');
        }
      }

      // Ensure minimum visible duration for the saving animation
      const elapsed = Date.now() - start;
      const minDuration = 500;
      if (elapsed < minDuration) {
        setTimeout(() => setIsSaving(false), minDuration - elapsed);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error saving wireframe:', error);
      setIsSaving(false);
    }
  };

  const exportWireframe = () => {
    const exportData = {
      version: '2.0',
      timestamp: new Date().toISOString(),
      projectName,
      isDarkMode,
      pages,
      currentPageId
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectAllSlides = () => {
    setSelectedSlides(pages.map(page => page.id));
  };
  
  const toggleSlideSelection = (slideId: string) => {
    setSelectedSlides(prev => 
      prev.includes(slideId) 
        ? prev.filter(id => id !== slideId) 
        : [...prev, slideId]
    );
  };

  const clearSlideSelection = () => {
    setSelectedSlides([]);
  };

  const exportCode = () => {
    const codeData = {
      projectName,
      theme: isDarkMode ? 'dark' : 'light',
      components: charts.length > 0 ? charts.map(chart => ({
        id: chart.id,
        type: chart.type,
        title: chart.title,
        position: { x: chart.x, y: chart.y },
        size: { width: chart.width, height: chart.height },
        data: chart.data,
        styling: {
          titleColor: chart.titleColor,
          titleSize: chart.titleSize,
          titleWeight: chart.titleWeight
        }
      })) : [],
      componentCount: charts.length,
      generatedAt: new Date().toISOString(),
      framework: 'React + TypeScript',
      styling: 'Tailwind CSS',
      note: charts.length === 0 ? 'No components added yet. Add charts or components to see them in the code structure.' : `${charts.length} component${charts.length !== 1 ? 's' : ''} included.`
    };

    const blob = new Blob([JSON.stringify(codeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}_code.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async (exportType: 'all' | 'current' | 'selected' = 'all') => {
    if (!canvasRef.current) return;
    
    try {
      // Show loading state
      setIsSaving(true);
      
      // Temporarily hide the customization panel for clean export
      const customizer = document.querySelector('[data-customizer]') as HTMLElement;
      const originalDisplay = customizer?.style.display;
      if (customizer) customizer.style.display = 'none';
      
      // Small delay to ensure all charts are fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
     
      // Use landscape orientation for better chart display
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape orientation
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 10mm margin
      const maxWidth = pageWidth - (margin * 2);
      const maxHeight = pageHeight - (margin * 2);
     
      // Store original page state
      const originalPageId = currentPageId;
     
      // Determine which pages to export
      let pagesToExport;
      if (exportType === 'current') {
        pagesToExport = [pages.find(p => p.id === currentPageId)].filter(Boolean);
      } else if (exportType === 'selected') {
        pagesToExport = pages.filter(p => selectedSlides.includes(p.id));
      } else {
        pagesToExport = pages;
      }
     
      // Process each slide/page
      for (let i = 0; i < pagesToExport.length; i++) {
        const page = pagesToExport[i];
       
        // Switch to this page
        if (page) {
          setCurrentPageId(page.id);
        }
       
        // Wait for page switch and chart rendering to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
       
        // Force a re-render by triggering a resize event
        window.dispatchEvent(new Event('resize'));
        await new Promise(resolve => setTimeout(resolve, 500));
       
        // Create canvas from the visible chart area for this page
        let canvas;
        try {
          canvas = await html2canvas(canvasRef.current, {
            background: isDarkMode ? '#111827' : '#ffffff',
        useCORS: true,
        allowTaint: true,
            width: canvasRef.current.clientWidth,
            height: canvasRef.current.clientHeight,
            logging: true // Enable logging to debug
          });
        } catch (error) {
          console.error('Canvas capture failed, trying fallback:', error);
          // Fallback: capture the entire viewport
          canvas = await html2canvas(document.body, {
            background: isDarkMode ? '#111827' : '#ffffff',
            useCORS: true,
            allowTaint: true,
            logging: true
          });
        }
       
        // Add page title if not the first page
        if (i > 0) {
          pdf.addPage();
        }
       
        // Add slide title at the top
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        if (page) {
          pdf.text(page.name, margin, margin + 5);
        }
       
        // Add a line separator
        pdf.setLineWidth(0.5);
        pdf.line(margin, margin + 8, pageWidth - margin, margin + 8);
       
        // Calculate dimensions to fit the chart area (below title)
        const titleHeight = 15; // Space for title and line
        const availableHeight = maxHeight - titleHeight;
        const availableWidth = maxWidth;
       
        const scaleX = availableWidth / canvas.width;
        const scaleY = availableHeight / canvas.height;
        const scale = Math.min(scaleX, scaleY);
       
        const imgWidth = canvas.width * scale;
        const imgHeight = canvas.height * scale;
       
        // Center the image on the page (below title)
        const x = (pageWidth - imgWidth) / 2;
        const y = margin + titleHeight + (availableHeight - imgHeight) / 2;
       
        // Debug: Log canvas info
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
        console.log('Canvas data URL length:', canvas.toDataURL('image/png').length);
       
        // Add image to PDF
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgWidth, imgHeight);
      }
     
      // Restore original page
      setCurrentPageId(originalPageId);
     
      // Restore customization panel
      if (customizer) customizer.style.display = originalDisplay || '';
     
      // Save PDF with appropriate filename
      let filename;
      if (exportType === 'current') {
        filename = `${projectName.replace(/\s+/g, '_')}_slide_${getCurrentPage()?.name.replace(/\s+/g, '_') || 'current'}.pdf`;
      } else if (exportType === 'selected') {
        filename = `${projectName.replace(/\s+/g, '_')}_selected_${selectedSlides.length}_slides.pdf`;
      } else {
        filename = `${projectName.replace(/\s+/g, '_')}_presentation.pdf`;
      }
      pdf.save(filename);
      
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
          setCharts(data.charts.map((chart: any) => ({ ...chart, comments: chart.comments || [] })));
          setProjectName(data.projectName || 'Loaded Wireframe');
          setIsDarkMode(true); // Always default to dark mode
          setSelectedChart(null);
        }
      } catch (error) {
        alert('Invalid wireframe file');
      }
    };
    reader.readAsText(file);
  };

  const newProject = () => {
    if (getCurrentPageCharts().length > 0) {
      const confirmed = window.confirm('Start new project? Current work will be lost.');
      if (!confirmed) return;
    }
    setPages([{ id: 'page-1', name: 'Slide 1', charts: [], isActive: true }]);
    setCurrentPageId('page-1');
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
            addNewPage();
            break;
          case 'd':
            e.preventDefault();
            toggleTheme();
            break;
          case 'e':
            e.preventDefault();
            if (pages.some(page => page.charts.length > 0)) setShowPdfOptions(true);
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

  const selectedChartData = selectedChart ? getCurrentPageCharts().find(c => c.id === selectedChart) : null;

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
    <>
      <style jsx>{`
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#111827' : '#f8fafc'};
          border-radius: 8px;
          margin: 4px;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, ${isDarkMode ? '#3b82f6' : '#2563eb'}, ${isDarkMode ? '#1d4ed8' : '#1e40af'});
          border-radius: 8px;
          border: 2px solid ${isDarkMode ? '#111827' : '#f8fafc'};
          transition: all 0.3s ease;
          box-shadow: ${isDarkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, ${isDarkMode ? '#2563eb' : '#1d4ed8'}, ${isDarkMode ? '#1e40af' : '#1e3a8a'});
          transform: scale(1.05);
          box-shadow: ${isDarkMode ? '0 4px 8px rgba(0,0,0,0.4)' : '0 4px 8px rgba(0,0,0,0.15)'};
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, ${isDarkMode ? '#1d4ed8' : '#1e40af'}, ${isDarkMode ? '#1e3a8a' : '#1e3a8a'});
          transform: scale(0.95);
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-corner {
          background: ${isDarkMode ? '#111827' : '#f8fafc'};
        }
      `}</style>
    <div className={`h-screen ${bgClass} flex`}>
      {/* Sidebar - Widget Library */}
        <div className={`w-80 ${sidebarBgClass} border-r ${borderClass} flex flex-col sidebar-scrollbar ${isViewOnly ? 'opacity-60' : ''}`}>
        {/* Header */}
        <div className={`p-4 border-b ${borderClass}`}>
          <div className="mb-16">
            <h2 className={`text-lg font-semibold ${textClass}`}></h2>
          </div>
          
          {/* Professional Tab Navigation */}
            <div className={`flex rounded-lg p-1 mb-4 relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`} style={{ minHeight: '40px' }}>
            {/* Animated tab indicator */}
            <div 
                className={`absolute top-1 bottom-1 transition-all duration-300 ease-out rounded-md ${isDarkMode ? 'bg-blue-600' : 'bg-white border border-blue-200'
              }`}
              style={{
                width: 'calc(33.33% - 2px)',
                left: activeTab === 'charts' ? '4px' : activeTab === 'components' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 0px)'
              }}
            />
            
            <button
              onClick={() => setActiveTab('charts')}
                className={`relative z-10 flex-1 px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'charts'
                  ? isDarkMode
                    ? 'text-white'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Charts
            </button>
            <button
              onClick={() => setActiveTab('components')}
                className={`relative z-10 flex-1 px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'components'
                  ? isDarkMode
                    ? 'text-white'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-3 h-3" />
              Components
            </button>
            
            <button
              onClick={() => setActiveTab('slides')}
                className={`relative z-10 flex-1 px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'slides'
                  ? isDarkMode
                    ? 'text-white'
                    : 'text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              Slides
            </button>
          </div>
        </div>

        {/* Widget Templates */}
        <div className="flex-1 pt-4 px-4 pb-0 overflow-y-auto max-h-[calc(100vh-280px)]">
          {activeTab === 'slides' ? (
            /* Slides Management */
            <div className="space-y-4">
              {/* Add New Slide Button */}
              <button
                onClick={addNewPage}
                  className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${isDarkMode
                    ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Plus className="w-5 h-5" />
                Slides
              </button>

              {/* Current Page Info */}
                <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${textClass}`}>
                      {getCurrentPage()?.name || 'Slide 1'}
                    </div>
                    <div className={`text-xs ${textSecondaryClass}`}>
                      {getCurrentPageCharts().length} {getCurrentPageCharts().length === 1 ? 'element' : 'elements'}
                    </div>
                  </div>
                  <div className={`text-xs ${textSecondaryClass}`}>
                    {pages.length} {pages.length === 1 ? 'slide' : 'slides'}
                  </div>
                </div>
              </div>

              {/* Slides List */}
              <div className="space-y-2">
                {pages.map((page, index) => (
                  <div
                    key={page.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${page.id === currentPageId
                        ? isDarkMode
                          ? 'bg-blue-900/30 border-blue-600 text-blue-400'
                          : 'bg-blue-100 border-blue-300 text-blue-700'
                        : isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => switchToPage(page.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${page.id === currentPageId
                            ? isDarkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : isDarkMode
                              ? 'bg-gray-600 text-gray-300'
                              : 'bg-gray-400 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{page.name}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {page.charts.length} {page.charts.length === 1 ? 'element' : 'elements'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Page Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicatePage(page.id);
                          }}
                            className={`p-1 rounded transition-colors ${isDarkMode
                              ? 'hover:bg-gray-600 text-gray-400 hover:text-gray-300'
                              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                          }`}
                          title="Duplicate slide"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        
                        {pages.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePage(page.id);
                            }}
                              className={`p-1 rounded transition-colors ${isDarkMode
                                ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-400'
                                : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                            }`}
                            title="Delete slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
          <div>
            {/* Charts and Components */}
            <div className="grid grid-cols-2 gap-1">
            {(activeTab === 'charts' ? getChartTemplates() : getComponentTemplates()).map((template) => {
              const IconComponent = template.icon;
              const colors = {
                bar: 'blue',
                donut: 'purple',
                line: 'green',
                area: 'orange',
                combo: 'cyan',
                multibar: 'teal',
                table: 'indigo',
                button: 'slate',
                iconbutton: 'slate',
                input: 'emerald',
                text: 'amber',
                image: 'rose',
                card: 'violet',
                navigation: 'sky',
                dropdown: 'lime',
                checkbox: 'pink',
                    radio: 'emerald',
                progress: 'orange',
                alert: 'red',
                avatar: 'blue',
                badge: 'green',
                switch: 'purple',
                slider: 'indigo',
                textarea: 'gray',
                separator: 'slate'
              };
              const color = colors[template.type] || 'blue';
              
              return (
                <button
                  key={template.type}
                      onMouseDown={(e) => handleSidebarMouseDown(e, template)}
                      className={`relative p-2 border-2 border-dashed rounded-lg transition-colors duration-200 group hover:shadow-lg cursor-grab active:cursor-grabbing ${isDarkMode
                      ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center space-y-3">
                        <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isDarkMode
                        ? `bg-${color}-900/20 group-hover:bg-${color}-900/30`
                        : `bg-${color}-100 group-hover:bg-${color}-200`
                    }`}>
                          <IconComponent className={`w-4 h-4 text-${color}-500 transition-colors`} />
                    </div>
                    <div>
                      <h3 className={`font-medium text-[11px] ${textClass} group-hover:text-${color}-600 transition-colors`}>{template.name}</h3>
                    </div>
                  </div>
                </button>
              );
            })}
            </div>

          {/* Icon Buttons Section */}
          <div className="mt-4">
            <div className={`text-xs font-medium mb-2 uppercase tracking-wide ${textSecondaryClass}`}>Icon Buttons</div>
            <div className="grid grid-cols-2 gap-1">
              {getIconTemplates().map((template) => {
                const IconComponent = template.icon;
                const color = 'slate';
                return (
                  <button
                    key={`icon-${template.name}`}
                    onMouseDown={(e) => handleSidebarMouseDown(e, template)}
                    className={`relative p-2 border-2 border-dashed rounded-lg transition-colors duration-200 group hover:shadow-lg cursor-grab active:cursor-grabbing ${isDarkMode
                      ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-center space-y-3">
                      <div className={`mx-auto w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isDarkMode
                        ? `bg-${color}-900/20 group-hover:bg-${color}-900/30`
                        : `bg-${color}-100 group-hover:bg-${color}-200`
                      }`}>
                        <IconComponent className={`w-4 h-4 text-${color}-500 transition-colors`} />
                      </div>
                      <div>
                        <h3 className={`font-medium text-[11px] ${textClass}`}>{template.name}</h3>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          </div>
          )}
          
          {/* Widget Summary removed */}
        </div>

        {/* Footer removed */}
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
                  disabled={isViewOnly}
                  className={`text-lg font-medium bg-transparent border-none outline-none focus:bg-opacity-50 px-2 py-1 rounded transition-all duration-200 ${inputClass} ${isViewOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {isPublicAccess && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                    {isViewOnly ? '👁️ View Only' : '✏️ Can Edit'}
                  </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* Fixframe AI Button */}
                <button
                  onClick={() => setShowFixframeAI(true)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                  }`}
                  title="Open Fixframe AI Assistant"
                >
                  <Sparkles className="w-3 h-3" />
                  Fixframe AI
                </button>
             

              <button
                onClick={saveWireframe}
                disabled={isSaving || isViewOnly}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isSaving || isViewOnly
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-gray-100 text-gray-400'
                    : isDarkMode
                      ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Save className="w-4 h-4" />
               
                save
              </button>
 
              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                disabled={isViewOnly}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isViewOnly
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-gray-100 text-gray-400'
                    : isDarkMode
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
                title={isViewOnly ? "Cannot share in view-only mode" : "Share project"}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {/* Export Options */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const totalCharts = pages.reduce((sum, page) => sum + page.charts.length, 0);
                    if (totalCharts === 0) {
                      alert('Add at least one chart to export a PDF.');
                      return;
                    }
                    setShowPdfOptions(true);
                  }}
                  disabled={isSaving || !pages.some(page => page.charts.length > 0)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    isSaving || !pages.some(page => page.charts.length > 0)
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
               
               
              </div>

                {/* Export Options */}
                <div className="flex items-center gap-1">
                
                <button
                    onClick={() => {
                      console.log('UltimateWireframeBuilder: Code button clicked, setting showCodeModal to true');
                      setShowCodeModal(true);
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
                      isDarkMode
                        ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    title="Generate Dashboard Code"
                  >
                    <Code className="w-3 h-3" />
                    Code
                </button>
              </div>



            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className={`flex-1 relative overflow-auto ${bgClass} ${draggedChart ? 'select-none' : ''}`}
          style={{
            height: 'calc(100vh - 120px)'
          }}
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

          {/* Empty State Placeholder */}
          {getCurrentPageCharts().length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`text-center p-8 rounded-xl border-2 border-dashed ${isDarkMode
                  ? 'border-gray-600 bg-gray-800/30' 
                  : 'border-gray-300 bg-gray-50/50'
              }`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDarkMode
                    ? 'bg-gray-700 text-gray-400' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Grid className="w-8 h-8" />
                </div>
                  <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Start building your wireframe
                </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Drag charts and components from the sidebar to get started
                </p>
              </div>
            </div>
          )}

          {/* Charts */}
          {getCurrentPageCharts().map((chart) => {
            const isBeingDragged = draggedChart === chart.id;
            const commonProps = {
              id: chart.id,
              title: chart.title,
              data: chart.data,
                x: 0,
                y: 0,
              width: chart.width,
              height: chart.height,
              isSelected: selectedChart === chart.id,
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
                    position: 'absolute',
                    left: chart.x,
                    top: chart.y,
                    width: chart.width,
                    height: chart.height,
                  cursor: draggedChart === chart.id ? 'grabbing' : 'grab'
                }}
              >
                {/* Comment Indicator */}
                  {chart.comments && chart.comments.length > 0 && (
                  <div 
                    className="absolute -top-2 -right-2 z-20"
                    style={{ pointerEvents: 'none' }}
                  >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${chart.comments && chart.comments.some(c => !c.resolved)
                        ? 'bg-orange-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                        {chart.comments ? chart.comments.length : 0}
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
                ) : chart.type === 'multibar' && Array.isArray(chart.data) && chart.data.length > 0 && 'series1' in chart.data[0] ? (
                  <ShadcnMultiBarChart {...commonProps} data={chart.data as MultiBarChartData[]} />
                ) : chart.type === 'table' && !Array.isArray(chart.data) ? (
                  <ShadcnTable {...commonProps} type="table" data={chart.data} />
                ) : chart.type === 'button' ? (
                  <WireframeButton {...commonProps} />
                ) : chart.type === 'iconbutton' ? (
                  <WireframeIconButton {...commonProps} />
                ) : chart.type === 'input' ? (
                  <WireframeInput {...commonProps} />
                ) : chart.type === 'text' ? (
                  <WireframeText {...commonProps} />
                ) : chart.type === 'image' ? (
                  <WireframeImage {...commonProps} />
                ) : chart.type === 'card' ? (
                  <WireframeCard {...commonProps} />
                ) : chart.type === 'navigation' ? (
                  <WireframeNavigation {...commonProps} />
                ) : chart.type === 'dropdown' ? (
                  <WireframeDropdown {...commonProps} />
                ) : chart.type === 'checkbox' ? (
                  <WireframeCheckbox {...commonProps} />
                ) : chart.type === 'radio' ? (
                  <WireframeRadioButton {...commonProps} />
                ) : chart.type === 'progress' ? (
                  <WireframeProgress {...commonProps} />
                ) : chart.type === 'alert' ? (
                  <WireframeAlert {...commonProps} />
                ) : chart.type === 'avatar' ? (
                  <WireframeAvatar {...commonProps} />
                ) : chart.type === 'badge' ? (
                  <WireframeBadge {...commonProps} />
                ) : chart.type === 'switch' ? (
                  <WireframeSwitch {...commonProps} />
                ) : chart.type === 'slider' ? (
                  <WireframeSlider {...commonProps} />
                ) : chart.type === 'textarea' ? (
                  <WireframeTextarea {...commonProps} />
                ) : chart.type === 'separator' ? (
                  <WireframeSeparator {...commonProps} />
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

                  {/* Resize overlay + handles */}
                  {selectedChart === chart.id && !isViewOnly && (
                    <>
                      {/* Border overlay - no pointer events */}
                      <div
                        className="absolute border-2 border-blue-400/60 rounded-md"
                        style={{ left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}
                      />
                      {/* Handles layer - accepts pointer events */}
                      <div
                        className="absolute"
                        style={{ left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 31 }}
                      >
                        {(['nw','ne','se','sw','n','e','s','w'] as const).map(h => {
                          const size = 8;
                          const half = Math.floor(size / 2);
                          return (
                            <div
                              key={h}
                              onMouseDown={(e) => startResize(e, chart.id, h)}
                              className="absolute bg-blue-500 rounded-full shadow"
                              style={{
                                width: size,
                                height: size,
                                cursor: `${h}-resize`,
                                pointerEvents: 'auto',
                                left:
                                  h === 'nw' ? `-${half}px` :
                                  h === 'ne' ? `calc(100% - ${half}px)` :
                                  h === 'se' ? `calc(100% - ${half}px)` :
                                  h === 'sw' ? `-${half}px` :
                                  h === 'e' ? `calc(100% - ${half}px)` :
                                  h === 'w' ? `-${half}px` :
                                  `calc(50% - ${half}px)`,
                                top:
                                  h === 'nw' ? `-${half}px` :
                                  h === 'ne' ? `-${half}px` :
                                  h === 'se' ? `calc(100% - ${half}px)` :
                                  h === 'sw' ? `calc(100% - ${half}px)` :
                                  h === 'n' ? `-${half}px` :
                                  h === 's' ? `calc(100% - ${half}px)` :
                                  `calc(50% - ${half}px)`,
                                boxShadow: '0 0 0 2px white'
                              }}
                            />
                          )
                        })}
                      </div>
                    </>
                  )}
              </div>
            );
          })}

        </div>
        
        {/* Instructions */}
        {charts.length > 0 && (
            <div className={`border-t p-3 ${isDarkMode
              ? 'bg-blue-900/20 border-blue-700/50' 
              : 'bg-blue-50 border-blue-200'
          }`}>
              <div className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              <strong>💡 Tips:</strong> Click charts to customize • Drag to reposition • Ctrl+E for PDF export • Perfect for client presentations
            </div>
          </div>
        )}
      </div>

      {/* Customization Panel */}
        <div data-customizer className="scrollbar-hide">
        <EnhancedChartCustomizer
          selectedChart={selectedChartData}
          onUpdateChart={updateChart}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onAddComment={addComment}
          onResolveComment={resolveComment}
          onDeleteComment={deleteComment}
          onAddReply={addReply}
            onShowFixframeAI={() => setShowFixframeAI(true)}
            charts={charts}
            projectName={projectName}
            showCodeModal={showCodeModal}
            onShowCodeModal={setShowCodeModal}
        />
      </div>
        {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        projectName={projectName}
        isDarkMode={isDarkMode}
        projectId={projectId || undefined}
      />
 
      {/* PDF Options Modal */}
      {showPdfOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Export PDF
              </h3>
              <button
                onClick={() => {
                  setShowPdfOptions(false);
                  setSelectedSlides([]);
                }}
                className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5 text-white" />
              </button>
    </div>
           
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Choose what you want to export:
            </p>
           
            <div className="space-y-3">
             
              {/* Custom Selection Option */}
              <div className={`p-4 rounded-lg border-2 ${
                isDarkMode
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-purple-500 bg-purple-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                  }`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-left">
                    <div className={`font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                      Select Specific Slides
                    </div>
                    <div className={`text-sm opacity-75 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                      Choose which slides to include
                    </div>
                  </div>
                </div>
 
                {/* Selection Controls */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={selectAllSlides}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Select All
                  </button>
                  <button
                    onClick={clearSlideSelection}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Clear All
                  </button>
                </div>
 
                {/* Slides List */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pages.map((page, index) => (
                    <label
                      key={page.id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                        isDarkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSlides.includes(page.id)}
                        onChange={() => toggleSlideSelection(page.id)}
                        className={`w-4 h-4 rounded ${
                          isDarkMode
                            ? 'text-purple-600 bg-gray-700 border-gray-600'
                            : 'text-purple-600 bg-white border-gray-300'
                        }`}
                      />
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {page.name}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {page.charts.length} element{page.charts.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
 
                {/* Export Selected Button */}
                <button
                  onClick={() => {
                    if (selectedSlides.length === 0) {
                      alert('Please select at least one slide to export.');
                      return;
                    }
                    setShowPdfOptions(false);
                    exportAsPDF('selected');
                  }}
                  disabled={isSaving || selectedSlides.length === 0}
                  className={`w-full mt-3 p-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  } ${isSaving || selectedSlides.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Download className="w-4 h-4" />
                  Export Selected ({selectedSlides.length} slide{selectedSlides.length !== 1 ? 's' : ''})
                </button>
              </div>
            </div>
           
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPdfOptions(false);
                  setSelectedSlides([]);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      
      {/* Fixframe AI Modal */}
      <FixframeAI 
        show={showFixframeAI} 
        onClose={() => setShowFixframeAI(false)} 
      />

      {/* Comment System */}
      {projectId && (
        <CommentSystem
          projectId={projectId}
          isDarkMode={isDarkMode}
          isViewOnly={isViewOnly}
          isPublicAccess={isPublicAccess}
          permission={typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('permission') || undefined : undefined}
          currentPageId={currentPageId}
          selectedChart={selectedChart}
        />
      )}
    </>
  );
}
