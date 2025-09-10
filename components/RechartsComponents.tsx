'use client';
import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { Move, Type, Trash2 } from 'lucide-react';

interface ChartProps {
  id: string;
  type: 'line' | 'area';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: { name: string; value: number; color: string }[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  titleColor: string;
  titleSize: number;
  titleWeight?: string;
  isDarkMode: boolean;
}

export function RechartsLineChart({
  id, title, data, x, y, width, height, isSelected, onSelect, onUpdate, onDelete, 
  titleColor, titleSize, titleWeight, isDarkMode
}: ChartProps) {
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const selectedBorderClass = isSelected ? 'border-blue-500' : borderClass;
  const hoverBorderClass = isDarkMode ? 'hover:border-gray-500' : 'hover:border-gray-300';
  const headerBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-700';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
  // Convert data format for Recharts
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value
  }));

  const lineColor = data[0]?.color || '#3B82F6';
  
  return (
    <div
      className={`absolute ${bgClass} rounded-lg shadow-md border-2 transition-all duration-200 ${selectedBorderClass} ${!isSelected ? hoverBorderClass : ''} ${isSelected ? 'shadow-lg' : ''}`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect(id)}
    >
      {/* Header */}
      <div className={`p-4 border-b ${headerBorderClass} flex items-center justify-between`}>
        <h3 
          className={`truncate ${titleWeight ? `font-${titleWeight}` : 'font-semibold'}`}
          style={{ color: titleColor, fontSize: `${titleSize}px` }}
        >
          {title}
        </h3>
        {isSelected && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(id, { title: prompt('Chart title:', title) || title });
              }}
              className={`p-1 rounded transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              title="Edit title"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className={`p-1 rounded transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              title="Delete chart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="p-4 flex-1" style={{ height: height - 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#d1d5db' }}
            />
            <YAxis 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#d1d5db' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#4B5563' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#F3F4F6' : '#1F2937'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={lineColor}
              strokeWidth={3}
              dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Drag Handle */}
      {isSelected && (
        <div 
          className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-grab hover:cursor-grabbing shadow-lg hover:bg-blue-600 transition-colors"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Move className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
}

export function RechartsAreaChart({
  id, title, data, x, y, width, height, isSelected, onSelect, onUpdate, onDelete, 
  titleColor, titleSize, titleWeight, isDarkMode
}: ChartProps) {
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const selectedBorderClass = isSelected ? 'border-blue-500' : borderClass;
  const hoverBorderClass = isDarkMode ? 'hover:border-gray-500' : 'hover:border-gray-300';
  const headerBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-700';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
  // Convert data format for Recharts
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value
  }));

  const areaColor = data[0]?.color || '#10B981';
  
  return (
    <div
      className={`absolute ${bgClass} rounded-lg shadow-md border-2 transition-all duration-200 ${selectedBorderClass} ${!isSelected ? hoverBorderClass : ''} ${isSelected ? 'shadow-lg' : ''}`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect(id)}
    >
      {/* Header */}
      <div className={`p-4 border-b ${headerBorderClass} flex items-center justify-between`}>
        <h3 
          className={`truncate ${titleWeight ? `font-${titleWeight}` : 'font-semibold'}`}
          style={{ color: titleColor, fontSize: `${titleSize}px` }}
        >
          {title}
        </h3>
        {isSelected && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(id, { title: prompt('Chart title:', title) || title });
              }}
              className={`p-1 rounded transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-blue-400' 
                  : 'text-gray-500 hover:text-blue-600'
              }`}
              title="Edit title"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className={`p-1 rounded transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              title="Delete chart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div className="p-4 flex-1" style={{ height: height - 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id={`colorGradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColor} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={areaColor} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#d1d5db' }}
            />
            <YAxis 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#d1d5db' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#4B5563' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#F3F4F6' : '#1F2937'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={areaColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#colorGradient-${id})`}
              dot={{ fill: areaColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: areaColor, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Drag Handle */}
      {isSelected && (
        <div 
          className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-grab hover:cursor-grabbing shadow-lg hover:bg-blue-600 transition-colors"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Move className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
}
