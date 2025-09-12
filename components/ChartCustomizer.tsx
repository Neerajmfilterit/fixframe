'use client';
import React, { useState } from 'react';
import { Palette, Type, BarChart3, PieChart, RefreshCw, Plus, Minus } from 'lucide-react';

interface ChartCustomizerProps {
  selectedChart: any;
  onUpdateChart: (id: string, updates: any) => void;
  isDarkMode: boolean;
}

const COLOR_PRESETS = [
  ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  ['#1F2937', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB'],
  ['#DC2626', '#EA580C', '#CA8A04', '#65A30D', '#059669'],
  ['#7C3AED', '#C026D3', '#DB2777', '#E11D48', '#F97316'],
  ['#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED'],
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24];

export default function ChartCustomizer({ selectedChart, onUpdateChart, isDarkMode }: ChartCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'size' | 'colors' | 'typography' | 'data'>('size');

  if (!selectedChart) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Chart Selected</h3>
          <p className="text-sm">Select a chart to customize its appearance</p>
        </div>
      </div>
    );
  }

  const updateChartData = (dataIndex: number, field: 'name' | 'value' | 'color', value: any) => {
    const newData = [...selectedChart.data];
    newData[dataIndex] = { ...newData[dataIndex], [field]: value };
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const addDataPoint = () => {
    const newData = [...selectedChart.data, {
      name: `Item ${selectedChart.data.length + 1}`,
      value: 50,
      color: COLOR_PRESETS[0][selectedChart.data.length % COLOR_PRESETS[0].length]
    }];
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const removeDataPoint = (index: number) => {
    if (selectedChart.data.length > 1) {
      const newData = selectedChart.data.filter((_: any, i: number) => i !== index);
      onUpdateChart(selectedChart.id, { data: newData });
    }
  };

  const applyColorPreset = (colors: string[]) => {
    const newData = selectedChart.data.map((item: any, index: number) => ({
      ...item,
      color: colors[index % colors.length]
    }));
    onUpdateChart(selectedChart.id, { data: newData });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          {selectedChart.type === 'bar' ? (
            <BarChart3 className="w-6 h-6 text-blue-600" />
          ) : (
            <PieChart className="w-6 h-6 text-blue-600" />
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{selectedChart.title}</h3>
            <p className="text-sm text-gray-500 capitalize">{selectedChart.type} Chart</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'colors'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            Colors
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'typography'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Type className="w-4 h-4" />
            Typography
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Color Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Presets
              </label>
              <div className="space-y-2">
                {COLOR_PRESETS.map((preset, presetIndex) => (
                  <button
                    key={presetIndex}
                    onClick={() => applyColorPreset(preset)}
                    className="w-full flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex gap-1">
                      {preset.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Preset {presetIndex + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Data Points */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Data Points
                </label>
                <button
                  onClick={addDataPoint}
                  className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedChart.data.map((item: any, index: number) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Point {index + 1}</span>
                      {selectedChart.data.length > 1 && (
                        <button
                          onClick={() => removeDataPoint(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateChartData(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Value</label>
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) => updateChartData(index, 'value', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={item.color}
                            onChange={(e) => updateChartData(index, 'color', e.target.value)}
                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={item.color}
                            onChange={(e) => updateChartData(index, 'color', e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Title
              </label>
              <input
                type="text"
                value={selectedChart.title}
                onChange={(e) => onUpdateChart(selectedChart.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Title Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedChart.titleColor || '#1F2937'}
                  onChange={(e) => onUpdateChart(selectedChart.id, { titleColor: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedChart.titleColor || '#1F2937'}
                  onChange={(e) => onUpdateChart(selectedChart.id, { titleColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Title Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FONT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => onUpdateChart(selectedChart.id, { titleSize: size })}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      (selectedChart.titleSize || 16) === size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Random Data Generator */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  const newData = selectedChart.data.map((item: any, index: number) => ({
                    ...item,
                    value: Math.floor(Math.random() * 100) + 10
                  }));
                  onUpdateChart(selectedChart.id, { data: newData });
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Generate Random Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
