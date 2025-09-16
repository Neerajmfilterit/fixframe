'use client';
import React from 'react';
import { Trash2, BarChart3, Type } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Data interface for multi-bar chart
interface MultiBarChartData {
  name: string;
  series1: number;
  series2: number;
  series3?: number;
  series4?: number;
  series1Color?: string;
  series2Color?: string;
  series3Color?: string;
  series4Color?: string;
}

interface ShadcnMultiBarChartProps {
  id: string;
  title: string;
  data: MultiBarChartData[];
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
  titleColor?: string;
  titleSize?: number;
  titleWeight?: string;
  isDarkMode?: boolean;
}

// Default colors for the different series
const DEFAULT_SERIES_COLORS = {
  series1: '#3B82F6', // Blue
  series2: '#10B981', // Green
  series3: '#F59E0B', // Yellow
  series4: '#EF4444'  // Red
};

export default function ShadcnMultiBarChart({
  id,
  title,
  data,
  x,
  y,
  width,
  height,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
  titleColor = '#1F2937',
  titleSize = 16,
  titleWeight = 'medium',
  isDarkMode = false
}: ShadcnMultiBarChartProps) {

  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const selectedBorderClass = isSelected ? 'border-blue-500' : borderClass;
  const hoverBorderClass = isDarkMode ? 'hover:border-gray-500' : 'hover:border-gray-300';
  const headerBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-700';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-600 text-gray-100' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}>
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.dataKey}: {entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend component
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className={textClass}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`absolute ${bgClass} rounded-lg shadow-md border-2 transition-all duration-150 ${selectedBorderClass} ${!isSelected ? hoverBorderClass : ''} ${isSelected ? 'shadow-lg' : ''} overflow-hidden`}
      style={{ left: x, top: y, width, height, willChange: 'width, height' }}
      onClick={() => onSelect?.(id)}
      onMouseDown={(e) => {
        // If user starts drag on header actions, don't initiate canvas drag
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
          e.stopPropagation();
        }
      }}
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
                onDelete?.(id);
              }}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-100'} transition-colors cursor-pointer`}
              onMouseDown={(e) => {
                // prevent drag handler in parent from capturing this
                e.stopPropagation();
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className="px-4 pb-4" style={{ height: Math.max(height - 120, 200) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 20,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
            />
            <XAxis 
              dataKey="name" 
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
            />
            <YAxis 
              stroke={isDarkMode ? '#9CA3AF' : '#6B7280'}
              fontSize={12}
              tick={{ fill: isDarkMode ? '#9CA3AF' : '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            
            {/* Render bars for each series */}
            <Bar 
              dataKey="series1" 
              name="Series 1"
              fill={data[0]?.series1Color || DEFAULT_SERIES_COLORS.series1}
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="series2" 
              name="Series 2"
              fill={data[0]?.series2Color || DEFAULT_SERIES_COLORS.series2}
              radius={[2, 2, 0, 0]}
            />
            {data.some(item => item.series3 !== undefined) && (
              <Bar 
                dataKey="series3" 
                name="Series 3"
                fill={data[0]?.series3Color || DEFAULT_SERIES_COLORS.series3}
                radius={[2, 2, 0, 0]}
              />
            )}
            {data.some(item => item.series4 !== undefined) && (
              <Bar 
                dataKey="series4" 
                name="Series 4"
                fill={data[0]?.series4Color || DEFAULT_SERIES_COLORS.series4}
                radius={[2, 2, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// Export the data interface for use in other components
export type { MultiBarChartData };
