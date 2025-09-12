'use client';
import React, { useState } from 'react';
import { 
  Settings, Download, RefreshCw, Palette, Move, 
  Trash2, Copy, Eye, EyeOff, MoreHorizontal 
} from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  id: string;
  title?: string;
  type: 'bar' | 'donut' | 'line' | 'area' | 'scatter';
  data?: ChartData[];
  width?: number;
  height?: number;
  isSelected?: boolean;
  isDragging?: boolean;
  isPreviewMode?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  className?: string;
}

const DEFAULT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
];

const DEFAULT_DATA: ChartData[] = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 }
];

export default function SimpleChart({
  id,
  title = "Chart",
  type = 'bar',
  data = DEFAULT_DATA,
  width = 400,
  height = 300,
  isSelected = false,
  isDragging = false,
  isPreviewMode = false,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  className
}: SimpleChartProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [chartData, setChartData] = useState<ChartData[]>(data);
  const [config, setConfig] = useState({
    title,
    showLegend: true,
    showTooltip: true,
    showGrid: true,
    animation: true,
    colors: DEFAULT_COLORS,
    width,
    height,
    innerRadius: 60,
    outerRadius: 100,
    strokeWidth: 2,
    dotSize: 4,
    barRadius: 4
  });

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onUpdate?.(id, { config: newConfig });
  };

  const handleDataChange = (index: number, field: keyof ChartData, value: any) => {
    const newData = [...chartData];
    newData[index] = { ...newData[index], [field]: value };
    setChartData(newData);
    onUpdate?.(id, { data: newData });
  };

  const addDataPoint = () => {
    const newData = [...chartData, {
      name: `Item ${chartData.length + 1}`,
      value: Math.floor(Math.random() * 500) + 100,
      color: DEFAULT_COLORS[chartData.length % DEFAULT_COLORS.length]
    }];
    setChartData(newData);
    onUpdate?.(id, { data: newData });
  };

  const removeDataPoint = (index: number) => {
    const newData = chartData.filter((_, i) => i !== index);
    setChartData(newData);
    onUpdate?.(id, { data: newData });
  };

  const generateRandomData = () => {
    const categories = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const newData = categories.slice(0, Math.floor(Math.random() * 6) + 3).map((name, index) => ({
      name,
      value: Math.floor(Math.random() * 500) + 100,
      color: DEFAULT_COLORS[index % DEFAULT_COLORS.length]
    }));
    setChartData(newData);
    onUpdate?.(id, { data: newData });
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Value'],
      ...chartData.map(item => [item.name, item.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMaxValue = () => Math.max(...chartData.map(d => d.value), 0);
  const maxValue = getMaxValue();

  const renderBarChart = () => {
    return (
      <div className="w-full h-full flex items-end justify-between gap-1 p-4">
        {chartData.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full rounded-t transition-all duration-500 hover:opacity-80"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
                title={`${item.name}: ${item.value}`}
              />
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDonutChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {chartData.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) : 0;
            const angle = percentage * 360;
            const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            
            const x1 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={index}
                d={pathData}
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {total}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Total
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const maxVal = getMaxValue();
    const points = chartData.map((item, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = maxVal > 0 ? 100 - (item.value / maxVal) * 100 : 50;
      return { x, y, item };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="w-full h-full p-4">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {config.showGrid && (
            <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} />
              ))}
              {[0, 20, 40, 60, 80, 100].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="100" />
              ))}
            </g>
          )}
          <path
            d={pathData}
            fill="none"
            stroke={DEFAULT_COLORS[0]}
            strokeWidth="2"
            className="transition-all duration-500"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={DEFAULT_COLORS[0]}
              className="hover:r-3 transition-all"
            />
          ))}
        </svg>
      </div>
    );
  };

  const renderAreaChart = () => {
    const maxVal = getMaxValue();
    const points = chartData.map((item, index) => {
      const x = (index / (chartData.length - 1)) * 100;
      const y = maxVal > 0 ? 100 - (item.value / maxVal) * 100 : 50;
      return { x, y, item };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ` L 100 100 L 0 100 Z`;

    return (
      <div className="w-full h-full p-4">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {config.showGrid && (
            <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} />
              ))}
            </g>
          )}
          <path
            d={pathData}
            fill={DEFAULT_COLORS[0]}
            fillOpacity="0.3"
            stroke={DEFAULT_COLORS[0]}
            strokeWidth="2"
            className="transition-all duration-500"
          />
        </svg>
      </div>
    );
  };

  const renderScatterChart = () => {
    const maxVal = getMaxValue();
    
    return (
      <div className="w-full h-full p-4">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {config.showGrid && (
            <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
              {[0, 25, 50, 75, 100].map(y => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} />
              ))}
              {[0, 20, 40, 60, 80, 100].map(x => (
                <line key={x} x1={x} y1="0" x2={x} y2="100" />
              ))}
            </g>
          )}
          {chartData.map((item, index) => {
            const x = (index / (chartData.length - 1)) * 100;
            const y = maxVal > 0 ? 100 - (item.value / maxVal) * 100 : 50;
            const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
              fill={color}
              className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar': return renderBarChart();
      case 'donut': return renderDonutChart();
      case 'line': return renderLineChart();
      case 'area': return renderAreaChart();
      case 'scatter': return renderScatterChart();
      default: return renderBarChart();
    }
  };

  const getChartIcon = () => {
    switch (type) {
      case 'bar': return '📊';
      case 'donut': return '🍩';
      case 'line': return '📈';
      case 'area': return '📈';
      case 'scatter': return '⚪';
      default: return '📊';
    }
  };

  const cn = (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div
      className={cn(
        "relative group bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm",
        isSelected && "border-blue-500 ring-2 ring-blue-500 ring-opacity-50",
        isDragging && "opacity-50 transform rotate-1",
        className
      )}
      style={{ width: config.width, height: config.height }}
      onClick={(e) => {
        // Check if the user is trying to select text
        const target = e.target as HTMLElement;
        const isTextElement = target.tagName === 'INPUT' || 
                             target.tagName === 'TEXTAREA' || 
                             target.isContentEditable ||
                             target.closest('input') ||
                             target.closest('textarea') ||
                             target.closest('[contenteditable]');
        
        // If user is interacting with text elements, don't trigger selection
        if (!isTextElement) {
          onSelect?.(id);
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getChartIcon()}</span>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {config.title}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-xs text-gray-500">
            {chartData.length} items
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4" style={{ height: config.height - 60 }}>
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="text-2xl mb-2">{getChartIcon()}</div>
              <div className="text-sm">No data available</div>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>

      {/* Overlay Controls */}
      {!isPreviewMode && (
        <>
          {/* Drag Handle */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gray-600 text-white rounded cursor-move flex items-center justify-center">
                <Move className="w-3 h-3" />
              </div>
              <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
                {type.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfigOpen(!isConfigOpen);
                }}
                className="w-6 h-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                title="Configure"
              >
                <Settings className="w-3 h-3 mx-auto" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsColorPickerOpen(!isColorPickerOpen);
                }}
                className="w-6 h-6 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                title="Colors"
              >
                <Palette className="w-3 h-3 mx-auto" />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="w-6 h-6 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  title="More actions"
                >
                  <MoreHorizontal className="w-3 h-3 mx-auto" />
                </button>

                {showActions && (
                  <div className="absolute top-8 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 min-w-32">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate?.(id);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportData();
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Download className="w-3 h-3" />
                      Export Data
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(id);
                        setShowActions(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          {isConfigOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                  Configure {type.toUpperCase()} Chart
                </h4>
                <button
                  onClick={() => setIsConfigOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Settings */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Width: {config.width}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="800"
                      value={config.width}
                      onChange={(e) => handleConfigChange('width', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Height: {config.height}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="600"
                      value={config.height}
                      onChange={(e) => handleConfigChange('height', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Data Management */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Points</h5>
                    <div className="flex gap-1">
                      <button
                        onClick={addDataPoint}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Add
                      </button>
                      <button
                        onClick={generateRandomData}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Random
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {chartData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleDataChange(index, 'name', e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        />
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) => handleDataChange(index, 'value', parseInt(e.target.value) || 0)}
                          onMouseDown={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        />
                        <button
                          onClick={() => removeDataPoint(index)}
                          className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Color Picker Panel */}
          {isColorPickerOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                  Color Scheme
                </h4>
                <button
                  onClick={() => setIsColorPickerOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Preset Colors</div>
                <div className="grid grid-cols-4 gap-2">
                  {DEFAULT_COLORS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const newData = chartData.map((item, i) => ({
                          ...item,
                          color: DEFAULT_COLORS[i % DEFAULT_COLORS.length]
                        }));
                        setChartData(newData);
                        onUpdate?.(id, { data: newData });
                      }}
                      className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full -translate-x-1 -translate-y-1" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full translate-x-1 -translate-y-1" />
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full -translate-x-1 translate-y-1" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full translate-x-1 translate-y-1" />
        </div>
      )}
    </div>
  );
}


