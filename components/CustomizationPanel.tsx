'use client';
import React, { useState } from 'react';
import { 
  Settings, Palette, Type, Move, Trash2, Copy, 
  Upload, Download, Eye, EyeOff, RefreshCw, GripVertical 
} from 'lucide-react';

interface ComponentConfig {
  id: string;
  type: string;
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  fontSize: number;
  data?: any[];
  chartType?: string;
}

interface CustomizationPanelProps {
  selectedComponent: ComponentConfig | null;
  onUpdateComponent: (id: string, updates: Partial<ComponentConfig>) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onUploadData?: (data: any[]) => void;
}

export default function CustomizationPanel({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onUploadData
}: CustomizationPanelProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'data' | 'layout'>('style');

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No Component Selected</h3>
          <p className="text-sm">Select a component to customize its properties</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (key: string, value: any) => {
    onUpdateComponent(selectedComponent.id, { [key]: value });
  };

  const [uploadPreview, setUploadPreview] = useState<any[] | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadPreview(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let parsedData: any[] = [];
        
        if (file.type === 'application/json') {
          const jsonData = JSON.parse(e.target?.result as string);
          parsedData = Array.isArray(jsonData) ? jsonData : [jsonData];
        } else if (file.name.endsWith('.csv')) {
          const csvText = e.target?.result as string;
          const lines = csvText.split('\n').filter(line => line.trim());
          if (lines.length < 2) {
            throw new Error('CSV file must have at least a header and one data row');
          }
          
          const headers = lines[0].split(',').map(h => h.trim());
          parsedData = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, index) => {
              const value = values[index] || '';
              // Try to convert to number if it looks like a number
              obj[header] = isNaN(Number(value)) ? value : Number(value);
            });
            return obj;
          });
        }

        // Validate data format for charts
        if (selectedComponent?.type === 'chart') {
          const isValidChartData = parsedData.every(item => 
            typeof item === 'object' && 
            (item.name !== undefined || item.label !== undefined) && 
            (item.value !== undefined || item.y !== undefined)
          );
          
          if (!isValidChartData) {
            throw new Error('Chart data must have "name" and "value" fields (or "label" and "y")');
          }
          
          // Normalize chart data
          parsedData = parsedData.map(item => ({
            name: item.name || item.label || 'Unknown',
            value: item.value || item.y || 0,
            color: item.color || `#${Math.floor(Math.random()*16777215).toString(16)}`
          }));
        }

        setUploadPreview(parsedData);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'Error parsing file');
      }
    };
    reader.readAsText(file);
  };

  const confirmUpload = () => {
    if (uploadPreview) {
      handleUpdate('data', uploadPreview);
      setUploadPreview(null);
      setUploadError(null);
    }
  };

  const cancelUpload = () => {
    setUploadPreview(null);
    setUploadError(null);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Customize</h3>
          <div className="flex gap-1">
            <button
              onClick={() => onDuplicateComponent(selectedComponent.id)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteComponent(selectedComponent.id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Component Info */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {selectedComponent.title}
          </div>
          <div className="text-xs text-gray-500">
            {selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1)} Component
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            { id: 'style', label: 'Style', icon: Palette },
            { id: 'layout', label: 'Layout', icon: Move },
            { id: 'data', label: 'Data', icon: Upload }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'style' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={selectedComponent.title}
                onChange={(e) => handleUpdate('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedComponent.backgroundColor}
                    onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedComponent.backgroundColor}
                    onChange={(e) => handleUpdate('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedComponent.borderColor}
                    onChange={(e) => handleUpdate('borderColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedComponent.borderColor}
                    onChange={(e) => handleUpdate('borderColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedComponent.textColor}
                    onChange={(e) => handleUpdate('textColor', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedComponent.textColor}
                    onChange={(e) => handleUpdate('textColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <input
                type="range"
                min="12"
                max="24"
                value={selectedComponent.fontSize}
                onChange={(e) => handleUpdate('fontSize', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">
                {selectedComponent.fontSize}px
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6">
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width
                </label>
                <input
                  type="number"
                  value={selectedComponent.width}
                  onChange={(e) => handleUpdate('width', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <input
                  type="number"
                  value={selectedComponent.height}
                  onChange={(e) => handleUpdate('height', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Chart Type Selection for Charts */}
            {selectedComponent.type === 'chart' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Type
                </label>
                <select
                  value={selectedComponent.chartType || 'bar'}
                  onChange={(e) => handleUpdate('chartType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="donut">Donut Chart</option>
                  <option value="area">Area Chart</option>
                  <option value="scatter">Scatter Plot</option>
                </select>
              </div>
            )}

            {/* Table Configuration */}
            {selectedComponent.type === 'data-table' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Columns
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="6"
                      value={(selectedComponent as any).columns?.length || 3}
                      onChange={(e) => {
                        const count = parseInt(e.target.value);
                        const columns = Array.from({ length: count }, (_, i) => `Column ${i + 1}`);
                        handleUpdate('columns', columns);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rows
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={(selectedComponent as any).rows || 3}
                      onChange={(e) => handleUpdate('rows', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(selectedComponent as any).showHeader !== false}
                      onChange={(e) => handleUpdate('showHeader', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Show Header</span>
                  </label>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Data Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Data
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-600 mb-3">
                  Upload CSV or JSON file
                </p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const csvContent = selectedComponent?.type === 'chart' 
                        ? 'name,value\nQ1 2024,75\nQ2 2024,85\nQ3 2024,65\nQ4 2024,95'
                        : 'name,email,status\nJohn Doe,john@example.com,Active\nJane Smith,jane@example.com,Active';
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedComponent?.type === 'chart' ? 'chart' : 'table'}_template.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Download sample CSV template
                  </button>
                </div>
              </div>
              
              {/* Upload Error */}
              {uploadError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">{uploadError}</p>
                </div>
              )}
              
              {/* Upload Preview */}
              {uploadPreview && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-blue-900">Preview Data</h4>
                    <span className="text-xs text-blue-600">{uploadPreview.length} rows</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto bg-white rounded border mb-3">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          {Object.keys(uploadPreview[0] || {}).map(key => (
                            <th key={key} className="text-left p-1 font-medium">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {uploadPreview.slice(0, 3).map((row, index) => (
                          <tr key={index} className="border-b">
                            {Object.values(row).map((value: any, i) => (
                              <td key={i} className="p-1">{String(value)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {uploadPreview.length > 3 && (
                      <div className="text-xs text-gray-500 p-1 text-center">
                        ...and {uploadPreview.length - 3} more rows
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={confirmUpload}
                      className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Apply Data
                    </button>
                    <button
                      onClick={cancelUpload}
                      className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Inline Data Editor for Charts */}
            {selectedComponent.type === 'chart' && selectedComponent.data && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Chart Data
                  </label>
                  <button
                    onClick={() => {
                      const currentData = selectedComponent.data || [];
                      const newData = [...currentData, {
                        name: `Item ${currentData.length + 1}`,
                        value: Math.floor(Math.random() * 100) + 50,
                        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
                      }];
                      handleUpdate('data', newData);
                    }}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                  >
                    + Add Point
                  </button>
                </div>
                
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="w-6"></th>
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Value</th>
                        <th className="text-center p-2 font-medium w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedComponent.data || []).map((item: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-gray-50 group">
                          <td className="p-1 text-center">
                            <button
                              className="text-gray-400 hover:text-gray-600 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                              onMouseDown={(e) => {
                                // Simple drag functionality - move up/down
                                e.preventDefault();
                                const rect = e.currentTarget.getBoundingClientRect();
                                const startY = e.clientY;
                                let newIndex = index;
                                
                                const onMouseMove = (event: MouseEvent) => {
                                  const deltaY = event.clientY - startY;
                                  const dataLength = selectedComponent.data?.length || 0;
                                  if (deltaY > 30 && index < dataLength - 1) {
                                    newIndex = index + 1;
                                  } else if (deltaY < -30 && index > 0) {
                                    newIndex = index - 1;
                                  }
                                };
                                
                                const onMouseUp = () => {
                                  if (newIndex !== index && selectedComponent.data) {
                                    const newData = [...selectedComponent.data];
                                    const [movedItem] = newData.splice(index, 1);
                                    newData.splice(newIndex, 0, movedItem);
                                    handleUpdate('data', newData);
                                  }
                                  document.removeEventListener('mousemove', onMouseMove);
                                  document.removeEventListener('mouseup', onMouseUp);
                                };
                                
                                document.addEventListener('mousemove', onMouseMove);
                                document.addEventListener('mouseup', onMouseUp);
                              }}
                              title="Drag to reorder"
                            >
                              <GripVertical className="w-3 h-3" />
                            </button>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.name || ''}
                              onChange={(e) => {
                                if (selectedComponent.data) {
                                  const newData = [...selectedComponent.data];
                                  newData[index] = { ...newData[index], name: e.target.value };
                                  handleUpdate('data', newData);
                                }
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              className="w-full px-1 py-1 text-xs border border-gray-200 rounded focus:border-blue-400 focus:outline-none"
                              placeholder="Label name"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.value || 0}
                              onChange={(e) => {
                                if (selectedComponent.data) {
                                  const newData = [...selectedComponent.data];
                                  newData[index] = { ...newData[index], value: parseFloat(e.target.value) || 0 };
                                  handleUpdate('data', newData);
                                }
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              className="w-full px-1 py-1 text-xs border border-gray-200 rounded focus:border-blue-400 focus:outline-none"
                              placeholder="0"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => {
                                if (selectedComponent.data) {
                                  const newData = selectedComponent.data.filter((_: any, i: number) => i !== index);
                                  handleUpdate('data', newData);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                              title="Delete data point"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Current Data Preview for Non-Charts */}
            {selectedComponent.type !== 'chart' && selectedComponent.data && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Data
                </label>
                <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <pre className="text-xs text-gray-600">
                    {JSON.stringify(selectedComponent.data.slice(0, 3), null, 2)}
                    {selectedComponent.data.length > 3 && '\n...'}
                  </pre>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {selectedComponent.data.length} rows
                </div>
              </div>
            )}

            {/* Generate Sample Data */}
            <button
              onClick={() => {
                const sampleData = selectedComponent.type === 'chart' ? [
                  { name: 'Q1 2024', value: Math.floor(Math.random() * 100) + 50, color: '#3b82f6' },
                  { name: 'Q2 2024', value: Math.floor(Math.random() * 100) + 50, color: '#10b981' },
                  { name: 'Q3 2024', value: Math.floor(Math.random() * 100) + 50, color: '#f59e0b' },
                  { name: 'Q4 2024', value: Math.floor(Math.random() * 100) + 50, color: '#ef4444' }
                ] : [
                  { name: 'Sample A', value: Math.floor(Math.random() * 100) + 50 },
                  { name: 'Sample B', value: Math.floor(Math.random() * 100) + 50 },
                  { name: 'Sample C', value: Math.floor(Math.random() * 100) + 50 }
                ];
                handleUpdate('data', sampleData);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Sample Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
