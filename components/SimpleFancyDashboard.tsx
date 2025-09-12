'use client';
import React, { useState, useRef } from 'react';
import { BarChart3, Plus, Eye, EyeOff, Download, Upload, Grid, Layers, Save, FolderOpen, Trash2, FileText } from 'lucide-react';
import SimpleChart from './widgets/SimpleChart';
import { WIREFRAME_COMPONENTS, WireframeButton, WireframeInput, WireframeText, WireframeTable, WireframeImage, WireframeCard, WireframeDropdown, WireframeNavigation } from './WireframeComponents';
import CustomizationPanel from './CustomizationPanel';

interface DashboardWidget {
  id: string;
  type: string;
  component: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data?: any[];
  config?: any;
  title?: string;
  chartType?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  // Table specific properties
  columns?: string[];
  rows?: number;
  showHeader?: boolean;
}

const CHART_TYPES = [
  { id: 'bar', name: 'Bar Chart', icon: '📊', color: '#3b82f6' },
  { id: 'donut', name: 'Donut Chart', icon: '🍩', color: '#10b981' },
  { id: 'line', name: 'Line Chart', icon: '📈', color: '#f59e0b' },
  { id: 'area', name: 'Area Chart', icon: '📈', color: '#8b5cf6' },
  { id: 'scatter', name: 'Scatter Plot', icon: '⚪', color: '#ef4444' }
];

export default function SimpleFancyDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showComponentLibrary, setShowComponentLibrary] = useState(true);
  const [showCustomizationPanel, setShowCustomizationPanel] = useState(true);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'charts' | 'tables' | 'inputs' | 'layout'>('charts');
  const [projectName, setProjectName] = useState('Untitled Wireframe');
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addWidget = (componentInfo: any) => {
    const { component, chartType, name, id } = componentInfo;
    const newWidget: DashboardWidget = {
      id: `${id}-${Date.now()}`,
      type: id,
      component: component,
      chartType: chartType,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      width: getDefaultWidth(component),
      height: getDefaultHeight(component),
      title: name,
      data: getDefaultData(component, chartType),
      config: getDefaultConfig(component),
      backgroundColor: '#ffffff',
      borderColor: '#d1d5db',
      textColor: '#374151',
      fontSize: 14,
      // Table specific defaults
      columns: component === 'table' ? ['Column 1', 'Column 2', 'Column 3'] : undefined,
      rows: component === 'table' ? 3 : undefined,
      showHeader: component === 'table' ? true : undefined
    };
    setWidgets(prev => [...prev, newWidget]);
    setSelectedWidget(newWidget.id);
  };

  const getDefaultWidth = (component: string) => {
    switch (component) {
      case 'chart': return 400;
      case 'table': return 400;
      case 'button': return 120;
      case 'input': return 200;
      case 'dropdown': return 180;
      case 'text': return 200;
      case 'card': return 300;
      case 'image': return 200;
      case 'navigation': return 400;
      default: return 200;
    }
  };

  const getDefaultHeight = (component: string) => {
    switch (component) {
      case 'chart': return 300;
      case 'table': return 250;
      case 'button': return 40;
      case 'input': return 40;
      case 'dropdown': return 40;
      case 'text': return 60;
      case 'card': return 200;
      case 'image': return 150;
      case 'navigation': return 60;
      default: return 100;
    }
  };

  const getDefaultData = (component: string, chartType?: string) => {
    if (component === 'chart') {
      switch (chartType) {
        case 'donut':
          return [
            { name: 'Desktop', value: 45, color: '#3b82f6' },
            { name: 'Mobile', value: 30, color: '#10b981' },
            { name: 'Tablet', value: 15, color: '#f59e0b' },
            { name: 'Other', value: 10, color: '#ef4444' }
          ];
        case 'bar':
        case 'line':
        case 'area':
        case 'scatter':
          return [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 200 },
            { name: 'Apr', value: 278 },
            { name: 'May', value: 189 },
            { name: 'Jun', value: 239 }
          ];
        default:
          return [
            { name: 'A', value: 100 },
            { name: 'B', value: 200 },
            { name: 'C', value: 150 },
            { name: 'D', value: 300 }
          ];
      }
    } else if (component === 'table') {
      return [
        { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
      ];
    }
    return [];
  };

  const getDefaultConfig = (component: string) => {
    return {
      showLegend: true,
      showTooltip: true,
      animation: true,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    };
  };

  const updateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const deleteWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
    if (selectedWidget === id) {
      setSelectedWidget(null);
    }
  };

  const duplicateWidget = (id: string) => {
    const widget = widgets.find(w => w.id === id);
    if (widget) {
      const newWidget: DashboardWidget = {
        ...widget,
        id: `${widget.type}-${Date.now()}`,
        x: widget.x + 20,
        y: widget.y + 20
      };
      setWidgets(prev => [...prev, newWidget]);
      setSelectedWidget(newWidget.id);
    }
  };

  // Save/Load functions
  const saveWireframe = () => {
    setIsSaving(true);
    const wireframeData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      projectName,
      widgets: widgets.map(w => ({
        ...w,
        // Remove runtime properties for cleaner save
        isSelected: undefined,
        isDragging: undefined
      })),
      metadata: {
        totalComponents: widgets.length,
        componentTypes: [...new Set(widgets.map(w => w.component))]
      }
    };
    
    // Save to localStorage
    const savedWireframes = JSON.parse(localStorage.getItem('wireframes') || '[]');
    const existingIndex = savedWireframes.findIndex((w: any) => w.projectName === projectName);
    
    if (existingIndex >= 0) {
      savedWireframes[existingIndex] = wireframeData;
    } else {
      savedWireframes.push(wireframeData);
    }
    
    localStorage.setItem('wireframes', JSON.stringify(savedWireframes));
    localStorage.setItem('currentWireframe', JSON.stringify(wireframeData));
    
    setTimeout(() => setIsSaving(false), 1000);
    
    // Show success message
    const originalTitle = document.title;
    document.title = '✅ Saved - Wireframe Builder';
    setTimeout(() => document.title = originalTitle, 2000);
  };

  const loadWireframe = (wireframeData: any) => {
    setProjectName(wireframeData.projectName || 'Loaded Wireframe');
    setWidgets(wireframeData.widgets || []);
    setSelectedWidget(null);
  };

  const getSavedWireframes = () => {
    return JSON.parse(localStorage.getItem('wireframes') || '[]');
  };

  const deleteWireframe = (name: string) => {
    const savedWireframes = getSavedWireframes().filter((w: any) => w.projectName !== name);
    localStorage.setItem('wireframes', JSON.stringify(savedWireframes));
  };

  const newProject = () => {
    const shouldContinue = widgets.length === 0 || window.confirm('Start a new project? Current progress will be lost.');
    if (shouldContinue) {
      setProjectName('New Wireframe');
      setWidgets([]);
      setSelectedWidget(null);
    }
  };

  // Auto-save every 30 seconds
  React.useEffect(() => {
    const autoSave = setInterval(() => {
      if (widgets.length > 0) {
        const wireframeData = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          projectName: projectName + ' (Auto-saved)',
          widgets: widgets.map(w => ({
            ...w,
            isSelected: undefined,
            isDragging: undefined
          })),
          metadata: {
            totalComponents: widgets.length,
            componentTypes: [...new Set(widgets.map(w => w.component))]
          }
        };
        localStorage.setItem('currentWireframe', JSON.stringify(wireframeData));
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSave);
  }, [widgets, projectName]);

  // Load saved wireframe on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('currentWireframe');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.widgets && data.widgets.length > 0) {
          const shouldLoad = window.confirm('Found a saved wireframe. Would you like to load it?');
          if (shouldLoad) {
            loadWireframe(data);
          }
        }
      } catch (error) {
        console.log('Error loading saved wireframe:', error);
      }
    }
  }, []);

  // Export functions
  const exportAsJSON = () => {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      projectName,
      widgets: widgets.map(w => ({
        ...w,
        // Remove runtime properties for cleaner export
        isSelected: undefined,
        isDragging: undefined
      })),
      metadata: {
        totalComponents: widgets.length,
        componentTypes: [...new Set(widgets.map(w => w.component))]
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async () => {
    if (!canvasRef.current) return;
    
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const canvas = await html2canvas(canvasRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`wireframe-${Date.now()}.pdf`);
    } catch (error) {
      alert('Error generating PDF. Please try again.');
    }
  };

  const importLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.widgets && Array.isArray(data.widgets)) {
          setWidgets(data.widgets);
          setSelectedWidget(null);
        } else {
          alert('Invalid file format. Please select a valid wireframe JSON file.');
        }
      } catch (error) {
        alert('Error parsing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleMouseDown = (e: React.MouseEvent, widgetId: string) => {
    if (isPreviewMode) return;
    
    // Check if the user is trying to select text
    const target = e.target as HTMLElement;
    const isTextElement = target.tagName === 'INPUT' || 
                         target.tagName === 'TEXTAREA' || 
                         target.isContentEditable ||
                         target.closest('input') ||
                         target.closest('textarea') ||
                         target.closest('[contenteditable]') ||
                         (window.getSelection()?.toString().length || 0) > 0;
    
    // If user is interacting with text elements, don't prevent default or start dragging
    if (isTextElement) {
      setSelectedWidget(widgetId); // Still select the widget for configuration
      return;
    }
    
    e.preventDefault();
    setDraggedWidget(widgetId);
    setIsDragging(true);
    setSelectedWidget(widgetId);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !draggedWidget || isPreviewMode) return;

    const canvas = document.querySelector('.dashboard-canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    updateWidget(draggedWidget, { x: Math.max(0, x), y: Math.max(0, y) });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedWidget(null);
  };

  const renderWidget = (widget: DashboardWidget) => {
    const isSelected = selectedWidget === widget.id;
    const commonProps = {
      title: widget.title,
      width: widget.width,
      height: widget.height,
      isSelected,
      onSelect: () => setSelectedWidget(widget.id),
    };

    switch (widget.component) {
      case 'chart':
        return (
          <SimpleChart
            id={widget.id}
            title={widget.title}
            type={widget.chartType as any}
            data={widget.data}
            width={widget.width}
            height={widget.height}
            isSelected={isSelected}
            isDragging={draggedWidget === widget.id}
            isPreviewMode={isPreviewMode}
            onSelect={setSelectedWidget}
            onUpdate={updateWidget}
            onDelete={deleteWidget}
            onDuplicate={duplicateWidget}
          />
        );
      case 'button':
        return <WireframeButton {...commonProps} />;
      case 'input':
        return <WireframeInput {...commonProps} />;
      case 'text':
        return <WireframeText {...commonProps} />;
      case 'table':
        return <WireframeTable 
          {...commonProps} 
          columns={widget.columns || ['Column 1', 'Column 2', 'Column 3']}
          rows={widget.rows || 3}
          showHeader={widget.showHeader !== false}
        />;
      case 'image':
        return <WireframeImage {...commonProps} />;
      case 'card':
        return <WireframeCard {...commonProps} />;
      case 'dropdown':
        return <WireframeDropdown {...commonProps} />;
      case 'navigation':
        return <WireframeNavigation {...commonProps} />;
      default:
        return <WireframeCard {...commonProps} title="Unknown Component" />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Component Library Sidebar */}
      {showComponentLibrary && (
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                
              </h2>
            </div>
            
            {/* Category Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { id: 'charts', label: '📊', tooltip: 'Charts' },
                { id: 'tables', label: '📋', tooltip: 'Tables' },
                { id: 'inputs', label: '🔘', tooltip: 'Inputs' },
                { id: 'layout', label: '🎨', tooltip: 'Layout' }
              ].map(({ id, label, tooltip }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id as any)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    activeCategory === id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title={tooltip}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Component Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {WIREFRAME_COMPONENTS[activeCategory]?.map(component => (
                <div
                  key={component.id}
                  className="group relative p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-102 hover:border-blue-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                  onClick={() => addWidget(component)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 mb-2">
                      <span className="text-xl">{component.icon}</span>
                    </div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white leading-tight">
                      {component.name}
                    </h3>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-5 rounded-lg transition-all duration-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {widgets.length} component{widgets.length !== 1 ? 's' : ''} added
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowComponentLibrary(!showComponentLibrary)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle Component Library"
              >
                <Layers className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Wireframe Builder
                </h1>
                <div className="text-gray-400">|</div>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-lg font-medium text-gray-700 dark:text-gray-300 bg-transparent border-none outline-none focus:bg-gray-50 dark:focus:bg-gray-700 px-2 py-1 rounded"
                  placeholder="Project Name"
                />
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{widgets.length} component{widgets.length !== 1 ? 's' : ''}</span>
                {widgets.length > 0 && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Auto-saved
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Project Management */}
              <button
                onClick={newProject}
                className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="New project"
              >
                <FileText className="w-4 h-4" />
                New
              </button>

              {/* Save/Load Options */}
              <button
                onClick={saveWireframe}
                disabled={isSaving}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isSaving 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                title="Save wireframe"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>

              {/* Load Dropdown */}
              <div className="relative group">
                <button className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 bg-purple-100 text-purple-700 hover:bg-purple-200">
                  <FolderOpen className="w-4 h-4" />
                  Load
                </button>
                <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">Saved Wireframes</div>
                    {getSavedWireframes().length === 0 ? (
                      <div className="text-sm text-gray-400 px-2 py-3">No saved wireframes</div>
                    ) : (
                      getSavedWireframes().map((wireframe: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <button
                            onClick={() => loadWireframe(wireframe)}
                            className="flex-1 text-left text-sm text-gray-700 truncate"
                          >
                            {wireframe.projectName}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteWireframe(wireframe.projectName);
                            }}
                            className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <button
                onClick={exportAsJSON}
                className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 bg-green-100 text-green-700 hover:bg-green-200"
                title="Export as JSON for developers"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              
              <button
                onClick={exportAsPDF}
                className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200"
                title="Export as PDF for clients"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              
              {/* Import */}
              <label className="px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={importLayout}
                  className="hidden"
                />
              </label>
              
              {/* Preview Toggle */}
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isPreviewMode 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              
              {/* Customization Panel Toggle */}
              <button
                onClick={() => setShowCustomizationPanel(!showCustomizationPanel)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Toggle Customization Panel"
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Canvas */}
        <div
          ref={canvasRef}
          className="dashboard-canvas flex-1 relative overflow-auto p-6"
          style={{ minHeight: '600px' }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={(e) => {
            // Click on empty space to deselect
            if (e.target === e.currentTarget) {
              setSelectedWidget(null);
            }
          }}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Widgets */}
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                position: 'absolute',
                left: widget.x,
                top: widget.y,
                zIndex: selectedWidget === widget.id ? 10 : 1
              }}
              onMouseDown={(e) => handleMouseDown(e, widget.id)}
              className={`transition-all duration-200 ${
                isPreviewMode ? 'cursor-default' : 'cursor-move'
              } ${
                draggedWidget === widget.id ? 'opacity-50 transform rotate-1 scale-105' : ''
              }`}
            >
              {renderWidget(widget)}
            </div>
          ))}

          {/* Empty State */}
          {widgets.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Start Building Your Wireframe
                </h2>
                <p className="text-gray-500 mb-6 max-w-md">
                  Drag and drop components from the library to create your custom dashboard wireframe.
                </p>
                <button
                  onClick={() => setShowComponentLibrary(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isPreviewMode && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 p-3">
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Instructions:</strong> Drag components from the library, click to select and customize, export as JSON for developers or PDF for clients.
            </div>
          </div>
        )}
      </div>

      {/* Customization Panel */}
      {showCustomizationPanel && (
        <CustomizationPanel
          selectedComponent={selectedWidget ? (() => {
            const widget = widgets.find(w => w.id === selectedWidget);
            return widget ? {
              id: widget.id,
              type: widget.type,
              title: widget.title || 'Untitled Component',
              width: widget.width,
              height: widget.height,
              backgroundColor: widget.backgroundColor || '#ffffff',
              borderColor: widget.borderColor || '#d1d5db',
              textColor: widget.textColor || '#374151',
              fontSize: widget.fontSize || 14,
              data: widget.data,
              chartType: widget.chartType,
              columns: widget.columns,
              rows: widget.rows,
              showHeader: widget.showHeader
            } : null;
          })() : null}
          onUpdateComponent={updateWidget}
          onDeleteComponent={deleteWidget}
          onDuplicateComponent={duplicateWidget}
          onUploadData={(data) => {
            if (selectedWidget) {
              updateWidget(selectedWidget, { data });
            }
          }}
        />
      )}
    </div>
  );
}
