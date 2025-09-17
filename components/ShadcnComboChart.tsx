'use client';
import React from 'react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Move, Type, Trash2, BarChart3 } from 'lucide-react';

interface ComboChartData {
  name: string;
  barValue: number;
  lineValue: number;
  barColor?: string;
  lineColor?: string;
}

interface ComboChartProps {
  id: string;
  type: 'combo';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: ComboChartData[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  titleColor: string;
  titleSize: number;
  titleWeight?: string;
  isDarkMode: boolean;
}

export function ShadcnComboChart({
  id, title, data, x, y, width, height, isSelected, onSelect, onUpdate, onDelete, 
  titleColor, titleSize, titleWeight, isDarkMode
}: ComboChartProps) {
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
    Sales: item.barValue,
    Growth: item.lineValue
  }));

  const barColor = data[0]?.barColor || '#3B82F6';
  const lineColor = data[0]?.lineColor || '#10B981';
  
  // Reserve space so legend is always visible even at very small sizes
  const headerAndFooterHeight = 112; // approximate combined height of header and footer
  const legendReservedHeight = 36; // space to ensure legend isn't clipped
  const minChartHeight = 60;
  const chartHeight = Math.max(height - (headerAndFooterHeight + legendReservedHeight), minChartHeight);
  const legendFontSize = height < 140 ? 10 : 12;
  
  return (
    <div
      className={`absolute ${bgClass} rounded-lg shadow-md border-2 transition-all duration-200 ${selectedBorderClass} ${!isSelected ? hoverBorderClass : ''} ${isSelected ? 'shadow-lg' : ''} overflow-hidden flex flex-col`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect(id)}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${headerBorderClass}`}>
        <div className="flex items-center gap-2">
          <BarChart3 className={`w-4 h-4 ${textSecondaryClass}`} />
          <h3 
            className={textClass}
            style={{ 
              color: titleColor,
              fontSize: `${titleSize}px`,
              fontWeight: titleWeight
            }}
          >
            {title}
          </h3>
        </div>
        
        {isSelected && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add edit functionality here
              }}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Type className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-100'} transition-colors`}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
            <div
              className={`p-1 rounded cursor-move ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Move className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#E5E7EB'} 
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: isDarkMode ? '#4B5563' : '#D1D5DB' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                borderRadius: '8px',
                color: isDarkMode ? '#F3F4F6' : '#1F2937'
              }}
            />
            <Bar 
              yAxisId="left"
              dataKey="Sales" 
              fill={barColor} 
              name="Sales Volume"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="Growth" 
              stroke={lineColor} 
              strokeWidth={3}
              name="Growth Rate"
              dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: lineColor, strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="px-4 pb-2 shrink-0">
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2" style={{ fontSize: legendFontSize }}>
            <div className="w-3 h-3 rounded" style={{ backgroundColor: barColor }} />
            <span className={`${textSecondaryClass} min-w-0 break-words`}>Sales Volume</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: legendFontSize }}>
            <div className="w-3 h-0.5" style={{ backgroundColor: lineColor }} />
            <span className={`${textSecondaryClass} min-w-0 break-words`}>Growth Rate</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-3 border-t ${headerBorderClass} flex items-center justify-between`}>
        <div className={`text-xs ${textSecondaryClass}`}>
          Combined Bar & Line Chart
        </div>
        <div className={`text-xs ${textSecondaryClass}`}>
          {data.length} data points
        </div>
      </div>
    </div>
  );
}
