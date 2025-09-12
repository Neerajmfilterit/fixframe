'use client';
import React, { useState } from 'react';
import { 
  Palette, Type, BarChart3, BarChart2, PieChart, RefreshCw, Plus, Minus, 
  Move, Maximize2, FileText, Database, Moon, Sun, MessageSquare,
  Send, Check, X, Reply, Trash2, Clock, Square, Image, 
  AlignLeft, Menu, ChevronDown, MousePointer, Settings,
  AlertTriangle, UserCircle, Tag, ToggleLeft, Sliders,
  Minus as DividerIcon, Upload, Download
} from 'lucide-react';

interface ChartCustomizerProps {
  selectedChart: any;
  onUpdateChart: (id: string, updates: any) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onAddComment?: (chartId: string, content: string, author?: string) => void;
  onResolveComment?: (chartId: string, commentId: string) => void;
  onDeleteComment?: (chartId: string, commentId: string) => void;
  onAddReply?: (chartId: string, commentId: string, content: string, author?: string) => void;
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

// Wireframe Component Editor Component
function WireframeComponentEditor({ 
  selectedChart, onUpdateChart, isDarkMode, textClass, textSecondaryClass, inputClass 
}: {
  selectedChart: any;
  onUpdateChart: (id: string, updates: any) => void;
  isDarkMode: boolean;
  textClass: string;
  textSecondaryClass: string;
  inputClass: string;
}) {
  return (
    <>
      <h3 className={`font-medium ${textClass} mb-4`}>Component Properties</h3>
      
      {/* Button Component */}
      {selectedChart.type === 'button' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Button Text</label>
            <input
              type="text"
              value={selectedChart.data?.text || 'Button'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, text: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter button text..."
            />
          </div>
          
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Button Style</label>
            <select
              value={selectedChart.data?.type || 'primary'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, type: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="primary">Primary Button</option>
              <option value="secondary">Secondary Button</option>
              <option value="outline">Outline Button</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Button Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.color || '#3B82F6'}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, color: e.target.value }
                })}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.color || '#3B82F6'}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 120 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="60"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 40 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="30"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Button Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Small', width: 80, height: 32 },
                { label: 'Medium', width: 120, height: 40 },
                { label: 'Large', width: 160, height: 48 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    width: size.width, 
                    height: size.height 
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width && selectedChart.height === size.height
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Component */}
      {selectedChart.type === 'input' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Placeholder Text</label>
            <input
              type="text"
              value={selectedChart.data?.placeholder || 'Enter text...'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, placeholder: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter placeholder text..."
            />
          </div>
          
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Input Type</label>
            <select
              value={selectedChart.data?.type || 'text'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, type: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="text">Text Input</option>
              <option value="email">Email Input</option>
              <option value="password">Password Input</option>
              <option value="search">Search Input</option>
              <option value="number">Number Input</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Input Colors</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Border Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.borderColor || '#D1D5DB'}
                    onChange={(e) => onUpdateChart(selectedChart.id, { 
                      data: { ...selectedChart.data, borderColor: e.target.value }
                    })}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.borderColor || '#D1D5DB'}
                  </span>
                </div>
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.backgroundColor || '#FFFFFF'}
                    onChange={(e) => onUpdateChart(selectedChart.id, { 
                      data: { ...selectedChart.data, backgroundColor: e.target.value }
                    })}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.backgroundColor || '#FFFFFF'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 200 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="100"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 40 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="30"
                  max="80"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Input Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Small', width: 150, height: 32 },
                { label: 'Medium', width: 200, height: 40 },
                { label: 'Large', width: 250, height: 48 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    width: size.width, 
                    height: size.height 
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width && selectedChart.height === size.height
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Text Component */}
      {selectedChart.type === 'text' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Text Content</label>
            <textarea
              value={selectedChart.data?.content || 'Sample Text'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, content: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              rows={3}
              placeholder="Enter your text content..."
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Text Size</label>
            <select
              value={selectedChart.data?.size || 'medium'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, size: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="small">Small Text</option>
              <option value="medium">Medium Text</option>
              <option value="large">Large Text</option>
              <option value="xlarge">Extra Large Text</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Text Alignment</label>
            <div className="grid grid-cols-3 gap-2">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    data: { ...selectedChart.data, align }
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors capitalize ${
                    selectedChart.data?.align === align
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.color || '#374151'}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, color: e.target.value }
                })}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.color || '#374151'}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 200 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="100"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 60 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="30"
                  max="200"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Component */}
      {selectedChart.type === 'image' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Upload Image</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      onUpdateChart(selectedChart.id, { 
                        data: { 
                          ...selectedChart.data, 
                          imageUrl: event.target?.result,
                          hasImage: true,
                          fileName: file.name
                        }
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg ${inputClass} cursor-pointer`}
              />
              {selectedChart.data?.hasImage && (
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${textSecondaryClass}`}>
                    📁 {selectedChart.data?.fileName || 'Uploaded Image'}
                  </span>
                  <button
                    onClick={() => onUpdateChart(selectedChart.id, { 
                      data: { 
                        ...selectedChart.data, 
                        imageUrl: null,
                        hasImage: false,
                        fileName: null
                      }
                    })}
                    className={`text-xs text-red-500 hover:text-red-700`}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Placeholder Text</label>
            <input
              type="text"
              value={selectedChart.data?.text || 'Image'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, text: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Text shown when no image"
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Image Fit</label>
            <select
              value={selectedChart.data?.objectFit || 'cover'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, objectFit: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="cover">Cover (Fill & Crop)</option>
              <option value="contain">Contain (Fit Inside)</option>
              <option value="fill">Fill (Stretch)</option>
              <option value="none">None (Original Size)</option>
              <option value="scale-down">Scale Down</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Border Radius</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="50"
                value={selectedChart.data?.borderRadius || 8}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, borderRadius: parseInt(e.target.value) }
                })}
                className="w-full"
              />
              <div className="text-center">
                <span className={`text-sm ${textSecondaryClass}`}>{selectedChart.data?.borderRadius || 8}px</span>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Border</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width (px)</label>
                <input
                  type="number"
                  value={selectedChart.data?.borderWidth || 0}
                  onChange={(e) => onUpdateChart(selectedChart.id, { 
                    data: { ...selectedChart.data, borderWidth: parseInt(e.target.value) || 0 }
                  })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Color</label>
                <input
                  type="color"
                  value={selectedChart.data?.borderColor || '#E5E7EB'}
                  onChange={(e) => onUpdateChart(selectedChart.id, { 
                    data: { ...selectedChart.data, borderColor: e.target.value }
                  })}
                  className="w-full h-8 rounded border-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 200 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 150 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Image Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Small', width: 120, height: 80 },
                { label: 'Medium', width: 200, height: 150 },
                { label: 'Large', width: 300, height: 200 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    width: size.width, 
                    height: size.height 
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width && selectedChart.height === size.height
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Square', ratio: '1:1', width: 200, height: 200 },
                { label: '16:9', ratio: '16:9', width: 280, height: 158 },
                { label: '4:3', ratio: '4:3', width: 240, height: 180 },
                { label: '3:2', ratio: '3:2', width: 240, height: 160 }
              ].map((aspect) => (
                <button
                  key={aspect.label}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    width: aspect.width, 
                    height: aspect.height 
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {aspect.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card Component */}
      {selectedChart.type === 'card' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Card Title</label>
            <input
              type="text"
              value={selectedChart.data?.cardTitle || 'Card Title'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, cardTitle: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Card title"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Card Content</label>
            <textarea
              value={selectedChart.data?.content || 'Card content goes here...'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, content: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              rows={3}
              placeholder="Card content"
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Card Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.backgroundColor || '#FFFFFF'}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, backgroundColor: e.target.value }
                })}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.backgroundColor || '#FFFFFF'}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 250 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="150"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 150 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="80"
                  max="300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Card Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Small', width: 200, height: 120 },
                { label: 'Medium', width: 250, height: 150 },
                { label: 'Large', width: 300, height: 200 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    width: size.width, 
                    height: size.height 
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width && selectedChart.height === size.height
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Component */}
      {selectedChart.type === 'navigation' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Menu Items</label>
            <div className="space-y-2">
              {(selectedChart.data?.items || ['Home', 'About', 'Services', 'Contact']).map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(selectedChart.data?.items || ['Home', 'About', 'Services', 'Contact'])];
                      newItems[index] = e.target.value;
                      onUpdateChart(selectedChart.id, { 
                        data: { ...selectedChart.data, items: newItems }
                      });
                    }}
                    className={`flex-1 px-3 py-2 border rounded-lg ${inputClass}`}
                    placeholder={`Menu ${index + 1}`}
                  />
                  {(selectedChart.data?.items || ['Home', 'About', 'Services', 'Contact']).length > 2 && (
                    <button
                      onClick={() => {
                        const newItems = [...(selectedChart.data?.items || ['Home', 'About', 'Services', 'Contact'])];
                        newItems.splice(index, 1);
                        onUpdateChart(selectedChart.id, { 
                          data: { ...selectedChart.data, items: newItems }
                        });
                      }}
                      className={`px-2 py-2 text-red-500 hover:bg-red-50 rounded`}
                      title="Remove"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {(selectedChart.data?.items || ['Home', 'About', 'Services', 'Contact']).length < 6 && (
                <button
                  onClick={() => {
                    const newItems = [...(selectedChart.data?.items || ['Home', 'About', 'Services', 'Contact']), 'Menu'];
                    onUpdateChart(selectedChart.id, { 
                      data: { ...selectedChart.data, items: newItems }
                    });
                  }}
                  className={`w-full px-3 py-2 border-2 border-dashed rounded-lg text-sm ${
                    isDarkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dropdown Component */}
      {selectedChart.type === 'dropdown' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Placeholder Text</label>
            <input
              type="text"
              value={selectedChart.data?.placeholder || 'Select option...'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, placeholder: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Placeholder text when nothing selected"
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dropdown Options</label>
            <div className="space-y-2">
              {(selectedChart.data?.options || ['Option 1', 'Option 2', 'Option 3']).map((option: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(selectedChart.data?.options || ['Option 1', 'Option 2', 'Option 3'])];
                      newOptions[index] = e.target.value;
                      onUpdateChart(selectedChart.id, { 
                        data: { ...selectedChart.data, options: newOptions }
                      });
                    }}
                    className={`flex-1 px-3 py-2 border rounded-lg ${inputClass}`}
                    placeholder={`Option ${index + 1}`}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        onUpdateChart(selectedChart.id, { 
                          data: { 
                            ...selectedChart.data, 
                            selectedOption: option,
                            hasSelection: true
                          }
                        });
                      }}
                      className={`px-2 py-2 rounded transition-colors ${
                        selectedChart.data?.selectedOption === option
                          ? 'bg-blue-500 text-white'
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Set as selected"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    {(selectedChart.data?.options || ['Option 1', 'Option 2', 'Option 3']).length > 1 && (
                      <button
                        onClick={() => {
                          const newOptions = [...(selectedChart.data?.options || ['Option 1', 'Option 2', 'Option 3'])];
                          newOptions.splice(index, 1);
                          onUpdateChart(selectedChart.id, { 
                            data: { 
                              ...selectedChart.data, 
                              options: newOptions,
                              selectedOption: selectedChart.data?.selectedOption === option ? null : selectedChart.data?.selectedOption
                            }
                          });
                        }}
                        className={`px-2 py-2 text-red-500 hover:bg-red-50 rounded`}
                        title="Remove option"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(selectedChart.data?.options || ['Option 1', 'Option 2', 'Option 3']).length < 10 && (
                <button
                  onClick={() => {
                    const newOptions = [...(selectedChart.data?.options || ['Option 1', 'Option 2', 'Option 3']), `Option ${(selectedChart.data?.options || ['Option 1', 'Option 2', 'Option 3']).length + 1}`];
                    onUpdateChart(selectedChart.id, { 
                      data: { ...selectedChart.data, options: newOptions }
                    });
                  }}
                  className={`w-full px-3 py-2 border-2 border-dashed rounded-lg text-sm ${
                    isDarkMode ? 'border-gray-600 text-gray-400 hover:border-gray-500' : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Option
                </button>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Selected Option</label>
            <div className="space-y-2">
              {selectedChart.data?.hasSelection && selectedChart.data?.selectedOption ? (
                <div className={`px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                  ✓ {selectedChart.data.selectedOption}
                  <button
                    onClick={() => onUpdateChart(selectedChart.id, { 
                      data: { 
                        ...selectedChart.data, 
                        selectedOption: null,
                        hasSelection: false
                      }
                    })}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className={`px-3 py-2 border rounded-lg text-center ${isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                  No option selected (shows placeholder)
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dropdown Style</label>
            <select
              value={selectedChart.data?.style || 'default'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, style: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="default">Default Dropdown</option>
              <option value="filled">Filled Background</option>
              <option value="outlined">Outlined Only</option>
              <option value="underlined">Underlined</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Border Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.borderColor || '#D1D5DB'}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, borderColor: e.target.value }
                })}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.borderColor || '#D1D5DB'}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.backgroundColor || '#FFFFFF'}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, backgroundColor: e.target.value }
                })}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.backgroundColor || '#FFFFFF'}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 200 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="120"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 40 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="32"
                  max="60"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dropdown Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Small', width: 150, height: 32 },
                { label: 'Medium', width: 200, height: 40 },
                { label: 'Large', width: 250, height: 48 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    width: size.width, 
                    height: size.height 
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width && selectedChart.height === size.height
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Checkbox Component */}
      {selectedChart.type === 'checkbox' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Checkbox Label</label>
            <input
              type="text"
              value={selectedChart.data?.text || 'Checkbox option'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, text: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter checkbox label..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedChart.data?.checked || false}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, checked: e.target.checked }
              })}
              className="w-4 h-4"
            />
            <label className={`text-sm ${textSecondaryClass}`}>Checked by default</label>
          </div>
        </div>
      )}

      {/* Progress Component */}
      {selectedChart.type === 'progress' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Progress Label</label>
            <input
              type="text"
              value={selectedChart.data?.text || 'Progress'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, text: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter progress label..."
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Progress Value</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedChart.data?.progress || 65}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, progress: parseInt(e.target.value) || 0 }
                })}
                className="w-full"
              />
              <div className="text-center">
                <span className={`text-sm ${textSecondaryClass}`}>{selectedChart.data?.progress || 65}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Component */}
      {selectedChart.type === 'alert' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Alert Title</label>
            <input
              type="text"
              value={selectedChart.data?.alertTitle || 'Alert'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, alertTitle: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Alert title"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Alert Message</label>
            <textarea
              value={selectedChart.data?.message || 'This is an alert message'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, message: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              rows={3}
              placeholder="Alert message content"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Alert Type</label>
            <select
              value={selectedChart.data?.type || 'info'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, type: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="error">Error (Red)</option>
              <option value="success">Success (Green)</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 300 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="200"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 80 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="60"
                  max="150"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Component */}
      {selectedChart.type === 'avatar' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Upload Avatar Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onUpdateChart(selectedChart.id, { 
                      data: { 
                        ...selectedChart.data, 
                        imageUrl: event.target?.result,
                        hasImage: true,
                        fileName: file.name
                      }
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass} cursor-pointer`}
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Initials (if no image)</label>
            <input
              type="text"
              value={selectedChart.data?.text || 'JD'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, text: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="User initials"
              maxLength={3}
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Avatar Size</label>
            <select
              value={selectedChart.data?.size || 'medium'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, size: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="small">Small (32px)</option>
              <option value="medium">Medium (48px)</option>
              <option value="large">Large (64px)</option>
              <option value="xlarge">Extra Large (80px)</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 80 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="150"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 80 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="150"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge Component */}
      {selectedChart.type === 'badge' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Badge Text</label>
            <input
              type="text"
              value={selectedChart.data?.text || 'Badge'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, text: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Badge text"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Badge Variant</label>
            <select
              value={selectedChart.data?.variant || 'default'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, variant: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="default">Default (Gray)</option>
              <option value="primary">Primary (Blue)</option>
              <option value="success">Success (Green)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="error">Error (Red)</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 80 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="200"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 32 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="24"
                  max="48"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Switch Component */}
      {selectedChart.type === 'switch' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Switch Label</label>
            <input
              type="text"
              value={selectedChart.data?.text || 'Switch'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, text: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Switch label"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedChart.data?.isOn || false}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, isOn: e.target.checked }
              })}
              className="w-4 h-4"
            />
            <label className={`text-sm ${textSecondaryClass}`}>On by default</label>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 120 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="80"
                  max="200"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 40 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="32"
                  max="60"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slider Component */}
      {selectedChart.type === 'slider' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Slider Label</label>
            <input
              type="text"
              value={selectedChart.data?.label || 'Slider'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, label: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Slider label"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Slider Value</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedChart.data?.value || 50}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, value: parseInt(e.target.value) }
                })}
                className="w-full"
              />
              <div className="text-center">
                <span className={`text-sm ${textSecondaryClass}`}>{selectedChart.data?.value || 50}</span>
              </div>
            </div>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 200 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="150"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 60 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Textarea Component */}
      {selectedChart.type === 'textarea' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Placeholder Text</label>
            <input
              type="text"
              value={selectedChart.data?.placeholder || 'Enter your message...'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, placeholder: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Placeholder text"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Textarea Colors</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Border Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.borderColor || '#D1D5DB'}
                    onChange={(e) => onUpdateChart(selectedChart.id, { 
                      data: { ...selectedChart.data, borderColor: e.target.value }
                    })}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.borderColor || '#D1D5DB'}
                  </span>
                </div>
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.backgroundColor || '#FFFFFF'}
                    onChange={(e) => onUpdateChart(selectedChart.id, { 
                      data: { ...selectedChart.data, backgroundColor: e.target.value }
                    })}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.backgroundColor || '#FFFFFF'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 250 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="200"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 100 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="80"
                  max="200"
                />
              </div>
            </div>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Textarea Size</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Small', width: 200, height: 80 },
                { label: 'Medium', width: 250, height: 100 },
                { label: 'Large', width: 300, height: 120 }
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => onUpdateChart(selectedChart.id, { 
                    width: size.width, 
                    height: size.height 
                  })}
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width && selectedChart.height === size.height
                      ? isDarkMode 
                        ? 'border-blue-500 bg-blue-900/20 text-blue-400' 
                        : 'border-blue-500 bg-blue-50 text-blue-700'
                      : isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Separator Component */}
      {selectedChart.type === 'separator' && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Orientation</label>
            <select
              value={selectedChart.data?.orientation || 'horizontal'}
              onChange={(e) => onUpdateChart(selectedChart.id, { 
                data: { ...selectedChart.data, orientation: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Separator Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.color || '#D1D5DB'}
                onChange={(e) => onUpdateChart(selectedChart.id, { 
                  data: { ...selectedChart.data, color: e.target.value }
                })}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.color || '#D1D5DB'}
              </span>
            </div>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Width</label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) => onUpdateChart(selectedChart.id, { width: parseInt(e.target.value) || 200 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>Height</label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) => onUpdateChart(selectedChart.id, { height: parseInt(e.target.value) || 20 })}
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="10"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

// File upload and parsing functions
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

const parseCSV = (csvText: string): ChartDataItem[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('label'));
  const valueIndex = headers.findIndex(h => h.includes('value') || h.includes('amount') || h.includes('count'));
  
  if (nameIndex === -1 || valueIndex === -1) {
    throw new Error('CSV must contain "name" and "value" columns');
  }
  
  const data: ChartDataItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= 2) {
      const name = values[nameIndex]?.trim().replace(/"/g, '');
      const value = parseFloat(values[valueIndex]?.trim().replace(/"/g, ''));
      
      if (name && !isNaN(value)) {
        data.push({
          name,
          value,
          color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
        });
      }
    }
  }
  
  return data;
};

const downloadSampleCSV = () => {
  const csvContent = `name,value
Product A,150
Product B,200
Product C,180
Product D,250
Product E,120`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chart-data-sample.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function EnhancedChartCustomizer({ 
  selectedChart, 
  onUpdateChart, 
  isDarkMode, 
  onToggleTheme,
  onAddComment,
  onResolveComment, 
  onDeleteComment,
  onAddReply
}: ChartCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'size' | 'colors' | 'typography' | 'data' | 'comments'>('size');
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  // Set appropriate default tab based on component type
  React.useEffect(() => {
    if (!selectedChart) return; // Guard against null selectedChart
    
    const isWireframe = ['button', 'input', 'text', 'image', 'card', 'navigation', 'dropdown', 'checkbox', 'progress', 'alert', 'avatar', 'badge', 'switch', 'slider', 'textarea', 'separator'].includes(selectedChart.type);
    if (isWireframe) {
      setActiveTab('data');
    } else if (activeTab === 'data' && !isWireframe) {
      setActiveTab('size');
    }
  }, [selectedChart?.type]);
  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('Reviewer');
  const [replyContent, setReplyContent] = useState<{[key: string]: string}>({});
  const [replyAuthor, setReplyAuthor] = useState<{[key: string]: string}>({});

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const inputClass = isDarkMode 
    ? 'bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500' 
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

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let parsedData: ChartDataItem[] = [];
        
        if (file.name.endsWith('.csv')) {
          parsedData = parseCSV(content);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          // For Excel files, show a message that CSV is preferred for now
          alert('Excel files are not yet supported. Please convert to CSV format or download the sample CSV to see the required format.');
          return;
        }
        
        if (parsedData.length === 0) {
          alert('No valid data found. Please check your file format.');
          return;
        }
        
        // Update chart data based on chart type
        if (['bar', 'donut', 'line', 'area'].includes(selectedChart.type)) {
          onUpdateChart(selectedChart.id, { data: parsedData });
        } else if (selectedChart.type === 'combo') {
          // Convert to combo chart format
          const comboData = parsedData.map(item => ({
            name: item.name,
            barValue: item.value,
            lineValue: item.value * 1.2, // Add some variation for line
            barColor: item.color,
            lineColor: item.color
          }));
          onUpdateChart(selectedChart.id, { data: comboData });
        } else if (selectedChart.type === 'multibar') {
          // Convert to multibar format
          const multibarData = parsedData.map(item => ({
            name: item.name,
            series1: item.value,
            series2: item.value * 0.8,
            series3: item.value * 1.1
          }));
          onUpdateChart(selectedChart.id, { data: multibarData });
        }
        
        alert(`Successfully imported ${parsedData.length} data points!`);
        
      } catch (error) {
        console.error('Error parsing file:', error);
        alert(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
  };

  const exportCurrentData = () => {
    if (!Array.isArray(selectedChart.data) || selectedChart.data.length === 0) {
      alert('No data to export');
      return;
    }

    let csvContent = 'name,value\n';
    
    // Handle different chart data formats
    if (selectedChart.type === 'combo') {
      selectedChart.data.forEach((item: any) => {
        csvContent += `"${item.name}",${item.barValue}\n`;
      });
    } else if (selectedChart.type === 'multibar') {
      csvContent = 'name,series1,series2,series3\n';
      selectedChart.data.forEach((item: any) => {
        csvContent += `"${item.name}",${item.series1},${item.series2},${item.series3}\n`;
      });
    } else {
      // Standard format for bar, donut, line, area charts
      selectedChart.data.forEach((item: any) => {
        csvContent += `"${item.name}",${item.value}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedChart.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Dynamic tabs based on component type
  const isWireframeComponent = selectedChart ? ['button', 'input', 'text', 'image', 'card', 'navigation', 'dropdown', 'checkbox', 'progress', 'alert', 'avatar', 'badge', 'switch', 'slider', 'textarea', 'separator'].includes(selectedChart.type) : false;
  
  const tabs = isWireframeComponent ? [
    { id: 'data', label: 'Properties', icon: Settings },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
  ] : [
    { id: 'size', label: 'Size', icon: Maximize2 },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'typography', label: 'Text', icon: Type },
    { id: 'data', label: 'Data', icon: Database },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
  ];

  return (
    <div className={`w-80 h-screen ${bgClass} border-l ${borderClass} flex flex-col`}>
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
          ) : selectedChart.type === 'combo' ? (
            <BarChart2 className="w-8 h-8 text-indigo-500" />
          ) : selectedChart.type === 'multibar' ? (
            <BarChart3 className="w-8 h-8 text-teal-500" />
          ) : selectedChart.type === 'table' ? (
            <FileText className="w-8 h-8 text-gray-500" />
          ) : selectedChart.type === 'button' ? (
            <Square className="w-8 h-8 text-blue-500" />
          ) : selectedChart.type === 'input' ? (
            <Type className="w-8 h-8 text-green-500" />
          ) : selectedChart.type === 'text' ? (
            <AlignLeft className="w-8 h-8 text-purple-500" />
          ) : selectedChart.type === 'image' ? (
            <Image className="w-8 h-8 text-orange-500" />
          ) : selectedChart.type === 'card' ? (
            <FileText className="w-8 h-8 text-indigo-500" />
          ) : selectedChart.type === 'navigation' ? (
            <Menu className="w-8 h-8 text-teal-500" />
          ) : selectedChart.type === 'dropdown' ? (
            <ChevronDown className="w-8 h-8 text-pink-500" />
          ) : selectedChart.type === 'checkbox' ? (
            <Check className="w-8 h-8 text-green-600" />
          ) : selectedChart.type === 'progress' ? (
            <BarChart3 className="w-8 h-8 text-blue-600" />
          ) : selectedChart.type === 'alert' ? (
            <AlertTriangle className="w-8 h-8 text-red-500" />
          ) : selectedChart.type === 'avatar' ? (
            <UserCircle className="w-8 h-8 text-blue-500" />
          ) : selectedChart.type === 'badge' ? (
            <Tag className="w-8 h-8 text-green-500" />
          ) : selectedChart.type === 'switch' ? (
            <ToggleLeft className="w-8 h-8 text-purple-500" />
          ) : selectedChart.type === 'slider' ? (
            <Sliders className="w-8 h-8 text-indigo-500" />
          ) : selectedChart.type === 'textarea' ? (
            <FileText className="w-8 h-8 text-gray-500" />
          ) : selectedChart.type === 'separator' ? (
            <DividerIcon className="w-8 h-8 text-gray-400" />
          ) : (
            <MousePointer className="w-8 h-8 text-gray-500" />
          )}
          <div>
            <h3 className={`font-semibold ${textClass}`}>{selectedChart.title}</h3>
            <p className={`text-sm ${textSecondaryClass} capitalize`}>
              {isWireframeComponent ? `${selectedChart.type} Component` : `${selectedChart.type} Chart`}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className={`grid ${isWireframeComponent ? 'grid-cols-2' : 'grid-cols-5'} gap-1 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
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
      <div className="flex-1 overflow-hidden">
        <div className={`${activeTab === 'data' || activeTab === 'comments' ? 'h-full overflow-hidden' : 'h-full overflow-y-auto p-4'}`}>
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
          <div className="h-full flex flex-col">
            {/* File Upload Toggle and Section */}
            {!['button', 'input', 'text', 'image', 'card', 'navigation', 'dropdown', 'checkbox', 'progress', 'alert', 'avatar', 'badge', 'switch', 'slider', 'textarea', 'separator'].includes(selectedChart.type) && (
              <div className={`border-b ${borderClass}`}>
                {/* Toggle Button */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-50/30'}`}>
                  <button
                    onClick={() => setShowFileUpload(!showFileUpload)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      isDarkMode 
                        ? 'bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300' 
                        : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5" />
                      <div className="text-left">
                        <h4 className="font-medium">Upload CSV File</h4>
                        <p className={`text-sm ${textSecondaryClass}`}>Import data from CSV file with name and value columns</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${showFileUpload ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Collapsible File Upload Section */}
                {showFileUpload && (
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                    <div className="space-y-3">
                      {/* File Upload Card - Compact */}
                      <div className="max-w-sm mx-auto">
                        <div className={`p-4 border-2 border-dashed rounded-lg transition-all hover:border-blue-400 ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                          <div className="text-center space-y-3">
                            <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                              <Upload className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className={`font-medium ${textClass} mb-1`}>Upload CSV File</h5>
                              <p className={`text-xs ${textSecondaryClass} mb-3`}>
                                Import data with name and value columns
                              </p>
                            </div>
                            <label className="block">
                              <input
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(file);
                                  }
                                }}
                                className="hidden"
                              />
                              <div className={`w-full px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all font-medium text-sm ${
                                isDarkMode 
                                  ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' 
                                  : 'border-blue-500 bg-blue-500 text-white hover:bg-blue-600'
                              }`}>
                                Choose CSV File
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Format Info - Compact */}
                      <div className={`p-3 rounded-lg border-l-4 ${isDarkMode ? 'bg-blue-900/10 border-blue-500 text-blue-300' : 'bg-blue-50 border-blue-400 text-blue-800'}`}>
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <h6 className="font-medium text-sm">Required Format</h6>
                            <p className="text-xs opacity-90">
                              <strong>Columns:</strong> "name" and "value" | <strong>Example:</strong> Product A, 150
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Wireframe Component Editor */}
            {['button', 'input', 'text', 'image', 'card', 'navigation', 'dropdown', 'checkbox', 'progress', 'alert', 'avatar', 'badge', 'switch', 'slider', 'textarea', 'separator'].includes(selectedChart.type) ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Wireframe Component Properties will be rendered here */}
                <WireframeComponentEditor 
                  selectedChart={selectedChart}
                  onUpdateChart={onUpdateChart}
                  isDarkMode={isDarkMode}
                  textClass={textClass}
                  textSecondaryClass={textSecondaryClass}
                  inputClass={inputClass}
                />
              </div>
            ) : Array.isArray(selectedChart.data) ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-3 p-4 pb-0 flex-shrink-0">
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
                
                <div className="flex-1 overflow-y-auto px-4 pb-4">
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
                </div>

                {/* Quick Actions - Fixed at bottom */}
                <div className={`p-4 border-t ${borderClass} flex-shrink-0`}>
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
              <div className={`p-6 text-center ${textSecondaryClass} h-full flex flex-col justify-center`}>
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className={`text-lg font-medium mb-2 ${textClass}`}>Unsupported Data Type</h3>
                <p>This component has a data structure that cannot be edited in the customizer.</p>
                <p className="mt-2 text-xs">Expected: Array of chart data points</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="h-full flex flex-col">
            {/* Comments Header */}
            <div className="p-4 pb-0 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className={`w-5 h-5 ${textClass}`} />
                  <h3 className={`font-medium ${textClass}`}>Comments & Reviews</h3>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  selectedChart.comments?.length > 0 
                    ? selectedChart.comments.some((c: any) => !c.resolved)
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {selectedChart.comments?.length || 0} comments
                </div>
              </div>

              {/* Add New Comment */}
              <div className={`border rounded-lg p-3 mb-4 ${borderClass}`}>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-xs ${textSecondaryClass} mb-1`}>Your Name</label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className={`w-full px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                      placeholder="Reviewer"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs ${textSecondaryClass} mb-1`}>Comment</label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className={`w-full px-2 py-2 text-sm border rounded transition-colors resize-none ${inputClass}`}
                      rows={3}
                      placeholder="Add your feedback or review comment..."
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (newComment.trim() && onAddComment) {
                        onAddComment(selectedChart.id, newComment.trim(), newAuthor.trim() || 'Reviewer');
                        setNewComment('');
                      }
                    }}
                    disabled={!newComment.trim()}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      newComment.trim()
                        ? isDarkMode 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    Add Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {selectedChart.comments && selectedChart.comments.length > 0 ? (
                <div className="space-y-4">
                  {selectedChart.comments.map((comment: any) => (
                    <div key={comment.id} className={`border rounded-lg p-4 ${borderClass} ${
                      comment.resolved ? 'opacity-75' : ''
                    }`}>
                      {/* Comment Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            comment.author === 'Reviewer' 
                              ? 'bg-orange-100 text-orange-600' 
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${textClass}`}>{comment.author}</div>
                            <div className={`text-xs ${textSecondaryClass} flex items-center gap-1`}>
                              <Clock className="w-3 h-3" />
                              {new Date(comment.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {onResolveComment && (
                            <button
                              onClick={() => onResolveComment(selectedChart.id, comment.id)}
                              className={`p-1 rounded transition-colors ${
                                comment.resolved
                                  ? 'text-green-500 hover:text-green-600'
                                  : isDarkMode
                                    ? 'text-gray-400 hover:text-green-400'
                                    : 'text-gray-500 hover:text-green-500'
                              }`}
                              title={comment.resolved ? 'Mark as unresolved' : 'Mark as resolved'}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {onDeleteComment && (
                            <button
                              onClick={() => onDeleteComment(selectedChart.id, comment.id)}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-400 hover:text-red-400' 
                                  : 'text-gray-500 hover:text-red-500'
                              }`}
                              title="Delete comment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className={`text-sm ${textClass} mb-3 pl-10`}>
                        {comment.content}
                      </div>

                      {/* Comment Status */}
                      {comment.resolved && (
                        <div className="flex items-center gap-1 text-xs text-green-600 pl-10">
                          <Check className="w-3 h-3" />
                          Resolved
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="pl-10 mt-3 space-y-2">
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className={`border-l-2 pl-3 py-2 ${
                              reply.author === 'Designer' ? 'border-blue-300' : 'border-gray-300'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  reply.author === 'Designer' 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {reply.author.charAt(0).toUpperCase()}
                                </div>
                                <span className={`text-xs font-medium ${textClass}`}>{reply.author}</span>
                                <span className={`text-xs ${textSecondaryClass}`}>
                                  {new Date(reply.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <div className={`text-sm ${textClass}`}>{reply.content}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {!comment.resolved && onAddReply && (
                        <div className="pl-10 mt-3">
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyAuthor[comment.id] || 'Designer'}
                                onChange={(e) => setReplyAuthor({...replyAuthor, [comment.id]: e.target.value})}
                                className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${inputClass}`}
                                placeholder="Your name"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={replyContent[comment.id] || ''}
                                onChange={(e) => setReplyContent({...replyContent, [comment.id]: e.target.value})}
                                className={`flex-1 px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                                placeholder="Reply to this comment..."
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && replyContent[comment.id]?.trim()) {
                                    onAddReply(selectedChart.id, comment.id, replyContent[comment.id].trim(), replyAuthor[comment.id] || 'Designer');
                                    setReplyContent({...replyContent, [comment.id]: ''});
                                  }
                                }}
                              />
                              <button
                                onClick={() => {
                                  if (replyContent[comment.id]?.trim()) {
                                    onAddReply(selectedChart.id, comment.id, replyContent[comment.id].trim(), replyAuthor[comment.id] || 'Designer');
                                    setReplyContent({...replyContent, [comment.id]: ''});
                                  }
                                }}
                                disabled={!replyContent[comment.id]?.trim()}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                  replyContent[comment.id]?.trim()
                                    ? isDarkMode 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <Reply className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${textSecondaryClass}`}>
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className={`text-lg font-medium mb-2 ${textClass}`}>No Comments Yet</h3>
                  <p className="text-sm">Add the first review comment for this chart.</p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}