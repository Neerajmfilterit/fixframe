'use client';
import React, { useState } from 'react';
import { 
  Palette, Type, BarChart3, PieChart, RefreshCw, Plus, Minus, 
  Move, Maximize2, FileText, Database, Moon, Sun 
} from 'lucide-react';

interface ChartCustomizerProps {
  selectedChart: any;
  onUpdateChart: (id: string, updates: any) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const COLOR_PRESETS = [
  ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  ['#1F2937', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'],
  ['#DC2626', '#EA580C', '#CA8A04', '#65A30D', '#059669'],
  ['#7C3AED', '#C026D3', '#DB2777', '#E11D48', '#F97316'],
  ['#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED'],
  // Dark mode specific presets
  ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'],
  ['#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280'],
];

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32];
const CHART_SIZES = [
  { label: 'Small', width: 300, height: 250 },
  { label: 'Medium', width: 400, height: 300 },
  { label: 'Large', width: 500, height: 400 },
  { label: 'X-Large', width: 600, height: 500 },
];

export default function EnhancedChartCustomizer({ 
  selectedChart, 
  onUpdateChart, 
  isDarkMode, 
  onToggleTheme 
}: ChartCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'size' | 'colors' | 'typography' | 'data'>('size');

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = isDarkMode 
    ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-400' 
    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500';

  if (!selectedChart) {
    return (
      <div className={`w-80 ${bgClass} border-l ${borderClass} p-6 flex flex-col`}>
        {/* Theme Toggle */}
        <div className="mb-6">
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Palette className={`w-12 h-12 mx-auto mb-4 ${textSecondaryClass}`} />
            <h3 className={`text-lg font-medium mb-2 ${textClass}`}>No Chart Selected</h3>
            <p className={`text-sm ${textSecondaryClass}`}>Select a chart to customize its appearance</p>
          </div>
        </div>
      </div>
    );
  }

  const updateChartData = (dataIndex: number, field: 'name' | 'value' | 'color', value: any) => {
    if (!Array.isArray(selectedChart.data)) return;
    const newData = [...selectedChart.data];
    newData[dataIndex] = { ...newData[dataIndex], [field]: value };
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const addDataPoint = () => {
    if (!Array.isArray(selectedChart.data)) return;
    const newData = [...selectedChart.data, {
      name: `Item ${selectedChart.data.length + 1}`,
      value: 50,
      color: COLOR_PRESETS[0][selectedChart.data.length % COLOR_PRESETS[0].length]
    }];
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const removeDataPoint = (index: number) => {
    if (!Array.isArray(selectedChart.data) || selectedChart.data.length <= 1) return;
    const newData = selectedChart.data.filter((_: any, i: number) => i !== index);
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const applyColorPreset = (colors: string[]) => {
    if (!Array.isArray(selectedChart.data)) return;
    const newData = selectedChart.data.map((item: any, index: number) => ({
      ...item,
      color: colors[index % colors.length]
    }));
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const tabs = [
    { id: 'size', label: 'Size', icon: Maximize2 },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Text', icon: Type },
    { id: 'data', label: 'Data', icon: Database },
  ];

  return (
    <div className={`w-80 ${bgClass} border-l ${borderClass} flex flex-col`}>
      {/* Header */}
      <div className={`p-4 border-b ${borderClass}`}>
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          {selectedChart.type === 'bar' ? (
            <BarChart3 className="w-8 h-8 text-blue-500" />
          ) : selectedChart.type === 'donut' ? (
            <PieChart className="w-8 h-8 text-purple-500" />
          ) : selectedChart.type === 'line' ? (
            <BarChart3 className="w-8 h-8 text-green-500" />
          ) : selectedChart.type === 'area' ? (
            <BarChart3 className="w-8 h-8 text-orange-500" />
          ) : (
            <FileText className="w-8 h-8 text-indigo-500" />
          )}
          <div>
            <h3 className={`font-semibold ${textClass}`}>{selectedChart.title}</h3>
            <p className={`text-sm ${textSecondaryClass} capitalize`}>{selectedChart.type} Chart</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`grid grid-cols-4 gap-1 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? isDarkMode 
                      ? 'bg-gray-700 text-blue-400' 
                      : 'bg-white text-blue-600 shadow-sm'
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'size' && (
          <div className="space-y-6">
            {/* Quick Size Presets */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-3`}>
                Quick Sizes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CHART_SIZES.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => onUpdateChart(selectedChart.id, { width: size.width, height: size.height })}
                    className={`p-2 text-xs border rounded-lg transition-colors ${
                      selectedChart.width === size.width && selectedChart.height === size.height
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className={textSecondaryClass}>{size.width}×{size.height}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Size Controls */}
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Width: {selectedChart.width}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="800"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Height: {selectedChart.height}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="600"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Color Presets */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-3`}>
                Color Presets
              </label>
              <div className="space-y-2">
                {COLOR_PRESETS.map((preset, presetIndex) => (
                  <button
                    key={presetIndex}
                    onClick={() => applyColorPreset(preset)}
                    className={`w-full p-2 border rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'border-gray-600 hover:border-gray-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex gap-1">
                      {preset.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex-1 h-6 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Color Controls */}
            {Array.isArray(selectedChart.data) && (
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-3`}>
                  Individual Colors
                </label>
                <div className="space-y-3">
                  {selectedChart.data.map((item: any, index: number) => (
                    <div key={index} className={`p-3 border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${textClass}`}>{item.name}</span>
                        {selectedChart.data.length > 1 && (
                          <button
                            onClick={() => removeDataPoint(index)}
                            className={`p-1 rounded transition-colors ${
                              isDarkMode 
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                                : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                            }`}
                            title="Remove data point"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={item.color}
                          onChange={(e) => updateChartData(index, 'color', e.target.value)}
                          className="w-8 h-8 rounded border-0"
                        />
                        <span className={`text-xs ${textSecondaryClass}`}>{item.color}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addDataPoint}
                  className={`text-sm px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                    isDarkMode 
                      ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            {/* Title Controls */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-3`}>
                Chart Title
              </label>
              <input
                type="text"
                value={selectedChart.title}
                onChange={(e) => onUpdateChart(selectedChart.id, { title: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                placeholder="Chart title"
              />
            </div>

            {/* Title Color */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-3`}>
                Title Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedChart.titleColor}
                  onChange={(e) => onUpdateChart(selectedChart.id, { titleColor: e.target.value })}
                  className="w-12 h-10 rounded border-0"
                />
                <span className={`text-sm ${textSecondaryClass}`}>{selectedChart.titleColor}</span>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-3`}>
                Font Size: {selectedChart.titleSize}px
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateChart(selectedChart.id, { titleSize: size })}
                    className={`px-2 py-1 text-xs border rounded transition-colors ${
                      selectedChart.titleSize === size
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Font Weight */}
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-3`}>
                Font Weight
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'medium', 'bold'].map((weight) => (
                  <button
                    key={weight}
                    onClick={() => onUpdateChart(selectedChart.id, { titleWeight: weight })}
                    className={`px-2 py-1 text-xs border rounded transition-colors capitalize ${
                      selectedChart.titleWeight === weight
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Data Points Editor */}
            {Array.isArray(selectedChart.data) ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`block text-sm font-medium ${textClass}`}>
                    Data Points
                  </label>
                  <button
                    onClick={addDataPoint}
                    className={`text-sm px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                      isDarkMode 
                        ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Add Point
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedChart.data.map((item: any, index: number) => (
                    <div key={index} className={`p-3 border rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-sm font-medium ${textClass}`}>Point {index + 1}</span>
                        {selectedChart.data.length > 1 && (
                          <button
                            onClick={() => removeDataPoint(index)}
                            className={`p-1 rounded transition-colors ${
                              isDarkMode 
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                                : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                            }`}
                            title="Remove data point"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className={`block text-xs ${textSecondaryClass} mb-1`}>Name</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateChartData(index, 'name', e.target.value)}
                            className={`w-full px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-xs ${textSecondaryClass} mb-1`}>Value</label>
                          <input
                            type="number"
                            value={item.value}
                            onChange={(e) => updateChartData(index, 'value', parseFloat(e.target.value) || 0)}
                            className={`w-full px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                          />
                        </div>
                        
                        <div>
                          <label className={`block text-xs ${textSecondaryClass} mb-1`}>Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={item.color}
                              onChange={(e) => updateChartData(index, 'color', e.target.value)}
                              className="w-8 h-8 rounded border-0"
                            />
                            <span className={`text-xs ${textSecondaryClass}`}>{item.color}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className={`pt-4 border-t ${borderClass}`}>
                  <button
                    onClick={() => {
                      if (!Array.isArray(selectedChart.data)) return;
                      const newData = selectedChart.data.map((item: any) => ({
                        ...item,
                        value: Math.floor(Math.random() * 100) + 10
                      }));
                      onUpdateChart(selectedChart.id, { data: newData });
                    }}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate Random Data
                  </button>
                </div>
              </div>
            ) : (
              <div className={`p-6 text-center ${textSecondaryClass}`}>
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className={`text-lg font-medium mb-2 ${textClass}`}>Unsupported Data Type</h3>
                <p>This component has a data structure that cannot be edited in the customizer.</p>
                <p className="mt-2 text-xs">Expected: Array of chart data points</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}