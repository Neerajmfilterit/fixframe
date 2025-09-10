'use client';
import React from 'react';
import { Move, Palette, Type, Save, Trash2, Copy } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface BaseChartProps {
  id: string;
  title: string;
  data: ChartData[];
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  titleColor: string;
  titleSize: number;
  titleWeight?: string;
  isDarkMode: boolean;
}

interface BarChartProps extends BaseChartProps {
  type: 'bar';
}

interface DonutChartProps extends BaseChartProps {
  type: 'donut';
}

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function DarkModeBarChart({
  id, title, data, x, y, width, height, isSelected, onSelect, onUpdate, onDelete, 
  titleColor, titleSize, titleWeight, isDarkMode
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const selectedBorderClass = isSelected ? 'border-blue-500' : borderClass;
  const hoverBorderClass = isDarkMode ? 'hover:border-gray-500' : 'hover:border-gray-300';
  const headerBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-700';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
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
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1 flex items-end justify-center gap-3 mb-4" style={{ minHeight: '200px' }}>
          {data.map((item, index) => {
            const barHeight = Math.max((item.value / maxValue) * 180, 12);
            return (
              <div key={index} className="flex flex-col items-center justify-end" style={{ width: '60px' }}>
                <div className={`text-xs font-medium mb-2 text-center ${textClass}`}>
                  {item.value}
                </div>
                <div
                  className="w-full rounded-t-lg transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border border-white/20"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: item.color,
                    minHeight: '12px',
                    boxShadow: `0 2px 8px ${item.color}30`
                  }}
                  title={`${item.name}: ${item.value}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-3">
          {data.map((item, index) => (
            <div key={index} className="text-center" style={{ width: '60px' }}>
              <div className={`text-xs font-medium truncate ${textSecondaryClass}`}>
                {item.name}
              </div>
            </div>
          ))}
        </div>
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

export function DarkModeDonutChart({
  id, title, data, x, y, width, height, isSelected, onSelect, onUpdate, onDelete, 
  titleColor, titleSize, titleWeight, isDarkMode
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = 110;
  const centerY = 110;
  const radius = 85;
  
  const bgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-600' : 'border-gray-200';
  const selectedBorderClass = isSelected ? 'border-blue-500' : borderClass;
  const hoverBorderClass = isDarkMode ? 'hover:border-gray-500' : 'hover:border-gray-300';
  const headerBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-700';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
  let currentAngle = 0;
  const paths = data.map((item, index) => {
    const percentage = total > 0 ? item.value / total : 0;
    const angle = percentage * 360;
    
    const startAngle = (currentAngle * Math.PI) / 180;
    const endAngle = ((currentAngle + angle) * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    currentAngle += angle;
    
    return {
      ...item,
      pathData,
      percentage: percentage * 100,
      index
    };
  });

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
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <svg width="220" height="220" className="transform -rotate-90 drop-shadow-lg">
              {paths.map((item, index) => (
                <path
                  key={index}
                  d={item.pathData}
                  fill={item.color}
                  stroke={isDarkMode ? "#374151" : "white"}
                  strokeWidth="3"
                  className="hover:opacity-80 transition-all duration-300 cursor-pointer hover:drop-shadow-xl"
                  style={{
                    filter: `drop-shadow(0 2px 4px ${item.color}40)`
                  }}
                />
              ))}
              {/* Inner circle for donut effect */}
              <circle
                cx={centerX}
                cy={centerY}
                r="45"
                fill={isDarkMode ? "#1F2937" : "white"}
                stroke={isDarkMode ? "#4B5563" : "#f3f4f6"}
                strokeWidth="2"
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${textClass}`}>
                  {total}
                </div>
                <div className={`text-sm font-medium ${textSecondaryClass}`}>
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: item.color }}
              />
              <span className={`truncate ${textSecondaryClass}`}>{item.name}</span>
            </div>
          ))}
        </div>
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

export { DEFAULT_COLORS };
