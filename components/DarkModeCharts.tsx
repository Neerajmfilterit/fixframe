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
  
  // Layout calculations for responsive sizing
  const headerApprox = 56; // tighter header
  const verticalPadding = 14; // tighter padding for more space
  const legendApprox = 50; // reserve more space for legend so it's always visible
  const innerWidth = Math.max(0, width - 32);
  const availableHeight = Math.max(80, height - headerApprox - verticalPadding - legendApprox);
  const count = Math.max(1, data.length);
  const gap = Math.max(8, Math.min(20, Math.floor(innerWidth / (count * 6))));
  const computedBarWidth = Math.max(10, Math.floor((innerWidth - gap * (count - 1)) / count));
  // keep label width equal to bar width to avoid misalignment
  const barWidth = Math.min(computedBarWidth, 80);
  const barMaxHeight = Math.max(60, availableHeight - 18);

  return (
    <div
      className={`absolute ${bgClass} rounded-lg shadow-md border-2 transition-all duration-150 ${selectedBorderClass} ${!isSelected ? hoverBorderClass : ''} ${isSelected ? 'shadow-lg' : ''} overflow-hidden`}
      style={{ left: x, top: y, width, height, willChange: 'width, height' }}
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
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-end justify-center mb-1" style={{ minHeight: `${Math.max(80, availableHeight)}px`, gap, paddingBottom: 0 }}>
          {data.map((item, index) => {
            const barHeight = Math.max((item.value / maxValue) * barMaxHeight, 8);
            return (
              <div key={index} className="flex flex-col items-center justify-end" style={{ width: `${barWidth}px` }}>
                <div className={`text-xs font-medium mb-2 text-center ${textClass}`}>
                  {item.value}
                </div>
                <div
                  className="w-full rounded-t-lg transition-[height,transform,box-shadow] duration-100 hover:scale-[1.03] hover:shadow-md cursor-pointer border border-white/20"
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
        <div className="flex justify-center" style={{ columnGap: gap, rowGap: 0, maxWidth: '100%', flexWrap: 'nowrap', overflow: 'visible', paddingTop: 4, height: 28 }}>
          {data.map((item, index) => (
            <div key={index} className="text-center" style={{ width: `${barWidth}px`, minWidth: `${barWidth}px` }}>
              <div className={`text-xs font-medium truncate ${textSecondaryClass}`}>{item.name}</div>
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
  // Compute size responsively based on container
  const padding = 12; // compact padding around svg
  const headerApprox = 44; // header height estimate
  // Adaptive donut/legend split for very small cards
  const remaining = Math.max(120, height - headerApprox);
  const donutFraction = (width < 240 || height < 260) ? 0.5 : 0.6; // give more space to legends on small sizes
  const donutArea = Math.max(90, Math.floor(remaining * donutFraction));
  const boxSize = Math.max(90, Math.min(width - padding * 2, donutArea - padding * 2));
  // Legend columns adapt by width (aim ~72px per cell)
  const approxCell = 72;
  const legendCols = Math.max(1, Math.min(data.length, Math.floor((width - 2 * padding) / approxCell)) || 1);
  const legendFont = Math.max(9, Math.min(12, Math.floor((width / Math.max(1, legendCols)) / 10)));
  const centerX = Math.floor(boxSize / 2);
  const centerY = Math.floor(boxSize / 2);
  const radius = Math.max(40, Math.floor((boxSize / 2) - 12));
  const totalFontSize = Math.max(12, Math.floor(boxSize * 0.18));
  const labelFontSize = Math.max(10, Math.floor(totalFontSize * 0.4));
  
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
      className={`absolute ${bgClass} rounded-lg shadow-md border-2 transition-all duration-150 ${selectedBorderClass} ${!isSelected ? hoverBorderClass : ''} ${isSelected ? 'shadow-lg' : ''} overflow-hidden`}
      style={{ left: x, top: y, width, height, willChange: 'width, height' }}
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
      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative" style={{ width: boxSize, height: boxSize, willChange: 'width, height' }}>
            <svg width={boxSize} height={boxSize} className="transform -rotate-90" style={{ willChange: 'transform' }}>
              {paths.map((item, index) => (
                <path
                  key={index}
                  d={item.pathData}
                  fill={item.color}
                  stroke={isDarkMode ? "#374151" : "white"}
                  strokeWidth="3"
                  className="hover:opacity-80 transition-all duration-75 cursor-pointer"
                  style={{
                    shapeRendering: 'geometricPrecision'
                  }}
                />
              ))}
              {/* Inner circle for donut effect */}
              <circle
                cx={centerX}
                cy={centerY}
                r={Math.max(24, Math.floor(radius * 0.52))}
                fill={isDarkMode ? "#1F2937" : "white"}
                stroke={isDarkMode ? "#4B5563" : "#f3f4f6"}
                strokeWidth="2"
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center" style={{ willChange: 'contents' }}>
                <div className={`font-bold ${textClass}`} style={{ fontSize: `${totalFontSize}px`, lineHeight: 1 }}>
                  {total}
                </div>
                <div className={`font-medium ${textSecondaryClass}`} style={{ fontSize: `${labelFontSize}px`, lineHeight: 1.1 }}>
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-3 pb-2">
        <div
          className="grid gap-1.5 w-full max-w-full"
          style={{ gridTemplateColumns: `repeat(${legendCols}, 1fr)` }}
        >
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 min-w-0">
              <div className="rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: item.color, width: 8, height: 8 }} />
              <span className={`${textSecondaryClass} min-w-0 max-w-full whitespace-normal break-words leading-tight`} style={{ fontSize: `${legendFont}px` }}>{item.name}</span>
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
