'use client';
import React, { useState } from 'react';
import { 
  Type, Square, Circle, Triangle, Image as ImageIcon, Video, 
  FileText, Mail, Phone, MapPin, Calendar, Clock,
  User, Users, Settings, Search, Filter, Download,
  Upload, Plus, Minus, X, Check, ArrowRight, ArrowLeft,
  ArrowUp, ArrowDown, Menu, MoreHorizontal, Star, Heart,
  ThumbsUp, ThumbsDown, MessageCircle, Share, Bookmark,
  Edit, Trash2, Copy, Move, RotateCw, Lock, Unlock,
  Table as TableIcon, BarChart3, PieChart, LineChart
} from 'lucide-react';

interface WireframeProps {
  title?: string;
  width?: number;
  height?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

// Wireframe Button Component
export function WireframeButton({ title = "Button", width = 120, height = 40, isSelected, onSelect, className }: WireframeProps) {
  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <span className="text-sm text-gray-600 font-medium">{title}</span>
    </div>
  );
}

// Wireframe Input Component
export function WireframeInput({ title = "Input Field", width = 200, height = 40, isSelected, onSelect, className }: WireframeProps) {
  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-white flex items-center px-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <span className="text-sm text-gray-400">{title}</span>
    </div>
  );
}

// Wireframe Text Component
export function WireframeText({ title = "Text Block", width = 200, height = 60, isSelected, onSelect, className }: WireframeProps) {
  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <div className="text-center">
        <Type className="w-6 h-6 text-gray-400 mx-auto mb-1" />
        <span className="text-xs text-gray-500">{title}</span>
      </div>
    </div>
  );
}

// Wireframe Table Component
interface WireframeTableProps extends WireframeProps {
  columns?: string[];
  rows?: number;
  showHeader?: boolean;
}

export function WireframeTable({ 
  title = "Data Table", 
  width = 400, 
  height = 250, 
  isSelected, 
  onSelect, 
  className,
  columns = ['Column 1', 'Column 2', 'Column 3'],
  rows = 3,
  showHeader = true
}: WireframeTableProps) {
  const maxCols = Math.max(2, Math.min(6, columns.length));
  const maxRows = Math.max(1, Math.min(10, rows));

  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        {showHeader && (
          <div className="border-b border-gray-300 p-2 bg-gray-100">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">{title}</span>
            </div>
          </div>
        )}
        
        {/* Table Content */}
        <div className="flex-1 p-3 overflow-hidden">
          <div className="space-y-2">
            {/* Table Headers */}
            <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
              {columns.slice(0, maxCols).map((col, index) => (
                <div key={index} className="h-3 bg-gray-400 rounded text-xs"></div>
              ))}
            </div>
            
            {/* Table Rows */}
            {Array.from({ length: maxRows }).map((_, rowIndex) => (
              <div key={rowIndex} className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
                {Array.from({ length: maxCols }).map((_, colIndex) => (
                  <div key={colIndex} className="h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wireframe Image Component
export function WireframeImage({ title = "Image", width = 200, height = 150, isSelected, onSelect, className }: WireframeProps) {
  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <div className="text-center">
        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <span className="text-xs text-gray-500">{title}</span>
      </div>
    </div>
  );
}

// Wireframe Card Component
export function WireframeCard({ title = "Card", width = 300, height = 200, isSelected, onSelect, className }: WireframeProps) {
  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-white cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center gap-2 mb-3">
          <Square className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

// Wireframe Dropdown Component
export function WireframeDropdown({ title = "Dropdown", width = 180, height = 40, isSelected, onSelect, className }: WireframeProps) {
  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-white flex items-center justify-between px-3 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <span className="text-sm text-gray-400">{title}</span>
      <ArrowDown className="w-4 h-4 text-gray-400" />
    </div>
  );
}

// Wireframe Navigation Component
export function WireframeNavigation({ title = "Navigation", width = 400, height = 60, isSelected, onSelect, className }: WireframeProps) {
  return (
    <div
      className={`border-2 border-dashed border-gray-400 rounded-md bg-gray-100 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-200 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : ''
      } ${className}`}
      style={{ width, height }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <Menu className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
        <div className="w-16 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

// Component type definitions for the sidebar
export const WIREFRAME_COMPONENTS = {
  // Charts
  charts: [
    { id: 'bar-chart', name: 'Bar Chart', icon: '📊', component: 'chart', chartType: 'bar' },
    { id: 'line-chart', name: 'Line Chart', icon: '📈', component: 'chart', chartType: 'line' },
    { id: 'pie-chart', name: 'Pie Chart', icon: '🥧', component: 'chart', chartType: 'donut' },
    { id: 'area-chart', name: 'Area Chart', icon: '📊', component: 'chart', chartType: 'area' },
    { id: 'scatter-chart', name: 'Scatter Plot', icon: '⚪', component: 'chart', chartType: 'scatter' }
  ],
  
  // Tables
  tables: [
    { id: 'data-table', name: 'Data Table', icon: '📋', component: 'table' },
  ],
  
  // Inputs
  inputs: [
    { id: 'button', name: 'Button', icon: '🔘', component: 'button' },
    { id: 'text-field', name: 'Text Field', icon: '📝', component: 'input' },
    { id: 'dropdown', name: 'Dropdown', icon: '📋', component: 'dropdown' },
    { id: 'text-block', name: 'Text Block', icon: '📄', component: 'text' }
  ],
  
  // Layout
  layout: [
    { id: 'card', name: 'Card', icon: '🃏', component: 'card' },
    { id: 'image', name: 'Image', icon: '🖼️', component: 'image' },
    { id: 'navigation', name: 'Navigation', icon: '🧭', component: 'navigation' }
  ]
};
