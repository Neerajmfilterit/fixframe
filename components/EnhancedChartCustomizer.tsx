"use client";
import React, { useState } from "react";
import {
  Palette,
  Type,
  BarChart3,
  PieChart,
  RefreshCw,
  Plus,
  Minus,
  Move,
  Maximize2,
  FileText,
  Database,
  Moon,
  Sun,
  MessageSquare,
  Send,
  Check,
  X,
  Reply,
  Trash2,
  Clock,
  Square,
  Image,
  AlignLeft,
  Menu,
  ChevronDown,
  MousePointer,
  Settings,
  AlertTriangle,
  UserCircle,
  Tag,
  ToggleLeft,
  Sliders,
  Minus as DividerIcon,
  Upload,
  Download,
  Globe,
  Zap,
  Eye,
  EyeOff,
  Code,
  Copy,
  Download as DownloadIcon,
  Sparkles,
  Lightbulb,
  FileCode,
  Circle,
} from "lucide-react";
import JSZip from "jszip";
// Simple AlertDialog fallback since shadcn/ui might not be available
const AlertDialog = ({ open, onOpenChange, children }: any) => {
  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {children}
      </div>
    </div>
  );
};

const AlertDialogContent = ({ children }: any) => (
  <div className="w-full">{children}</div>
);
const AlertDialogHeader = ({ children }: any) => (
  <div className="mb-4">{children}</div>
);
const AlertDialogTitle = ({ children }: any) => (
  <h2 className="text-lg font-semibold mb-2 text-gray-900">{children}</h2>
);
const AlertDialogDescription = ({ children }: any) => (
  <p className="text-gray-600 mb-4 text-sm">{children}</p>
);
const AlertDialogFooter = ({ children }: any) => (
  <div className="flex justify-end gap-2 mt-4">{children}</div>
);
const AlertDialogCancel = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
  >
    {children}
  </button>
);
const AlertDialogAction = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
  >
    {children}
  </button>
);

interface ChartCustomizerProps {
  selectedChart: any;
  onUpdateChart: (id: string, updates: any) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onAddComment?: (chartId: string, content: string, author?: string) => void;
  onResolveComment?: (chartId: string, commentId: string) => void;
  onDeleteComment?: (chartId: string, commentId: string) => void;
  onAddReply?: (
    chartId: string,
    commentId: string,
    content: string,
    author?: string
  ) => void;
  onShowFixframeAI?: () => void;
  charts?: any[]; // All charts in the dashboard
  projectName?: string; // Project name for export
  showCodeModal?: boolean; // Code modal visibility from parent
  onShowCodeModal?: (show: boolean) => void; // Code modal state setter
}

const COLOR_PRESETS = [
  ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
  ["#1F2937", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"],
  ["#DC2626", "#EA580C", "#CA8A04", "#65A30D", "#059669"],
  ["#7C3AED", "#C026D3", "#DB2777", "#E11D48", "#F97316"],
  ["#0891B2", "#0284C7", "#2563EB", "#4F46E5", "#7C3AED"],
  // Dark mode specific presets
  ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"],
  ["#F3F4F6", "#E5E7EB", "#D1D5DB", "#9CA3AF", "#6B7280"],
];

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32];
const CHART_SIZES = [
  { label: "Small", width: 300, height: 250 },
  { label: "Medium", width: 400, height: 300 },
  { label: "Large", width: 500, height: 400 },
  { label: "X-Large", width: 600, height: 500 },
];

// Wireframe Component Editor Component
function WireframeComponentEditor({
  selectedChart,
  onUpdateChart,
  isDarkMode,
  textClass,
  textSecondaryClass,
  inputClass,
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
      {/* Icon Button Component */}
      {selectedChart.type === "iconbutton" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Icon
            </label>
            <select
              value={selectedChart.data?.icon || "Save"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, icon: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              {[
                "Save",
                "Download",
                "Upload",
                "Share",
                "Edit",
                "Delete",
                "Copy",
                "Tag",
                "User",
                "Code",
                "Folder",
                "File",
                "Eye",
                "EyeOff",
                "Grid",
                "Plus",
                "Moon",
                "Sun",
              ].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Icon Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={
                  selectedChart.data?.color ||
                  (isDarkMode ? "#E5E7EB" : "#111827")
                }
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: { ...selectedChart.data, color: e.target.value },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.color ||
                  (isDarkMode ? "#E5E7EB" : "#111827")}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.bgColor || "#00000000"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: { ...selectedChart.data, bgColor: e.target.value },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.bgColor || "transparent"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm ${textSecondaryClass} mb-2`}>
                Border Color
              </label>
              <input
                type="color"
                value={selectedChart.data?.borderColor || "#000000"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      borderColor: e.target.value,
                    },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
            </div>
            <div>
              <label className={`block text-sm ${textSecondaryClass} mb-2`}>
                Border Width
              </label>
              <input
                type="number"
                value={selectedChart.data?.borderWidth ?? 0}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      borderWidth: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                min="0"
                max="12"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Border Radius
            </label>
            <input
              type="number"
              value={selectedChart.data?.borderRadius ?? 0}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: {
                    ...selectedChart.data,
                    borderRadius: parseInt(e.target.value) || 0,
                  },
                })
              }
              className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
              min="0"
              max="48"
            />
          </div>
        </div>
      )}

      {/* Button Component */}
      {selectedChart.type === "button" && (
        <div className="space-y-4 ">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Button Text
            </label>
            <input
              type="text"
              value={selectedChart.data?.text || "Button"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, text: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter button text..."
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Button Style
            </label>
            <select
              value={selectedChart.data?.type || "primary"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, type: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="primary">Primary Button</option>
              <option value="secondary">Secondary Button</option>
              <option value="outline">Outline Button</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Button Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.color || "#3B82F6"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: { ...selectedChart.data, color: e.target.value },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.color || "#3B82F6"}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 120,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="60"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 40,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="30"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Button Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Small", width: 80, height: 32 },
                { label: "Medium", width: 120, height: 40 },
                { label: "Large", width: 160, height: 48 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: size.width,
                      height: size.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width &&
                    selectedChart.height === size.height
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
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
      {selectedChart.type === "input" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Placeholder Text
            </label>
            <input
              type="text"
              value={selectedChart.data?.placeholder || "Enter text..."}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, placeholder: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter placeholder text..."
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Input Type
            </label>
            <select
              value={selectedChart.data?.type || "text"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, type: e.target.value },
                })
              }
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
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Input Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Border Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.borderColor || "#D1D5DB"}
                    onChange={(e) =>
                      onUpdateChart(selectedChart.id, {
                        data: {
                          ...selectedChart.data,
                          borderColor: e.target.value,
                        },
                      })
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.borderColor || "#D1D5DB"}
                  </span>
                </div>
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.backgroundColor || "#FFFFFF"}
                    onChange={(e) =>
                      onUpdateChart(selectedChart.id, {
                        data: {
                          ...selectedChart.data,
                          backgroundColor: e.target.value,
                        },
                      })
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.backgroundColor || "#FFFFFF"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 200,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="100"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 40,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="30"
                  max="80"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Input Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Small", width: 150, height: 32 },
                { label: "Medium", width: 200, height: 40 },
                { label: "Large", width: 250, height: 48 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: size.width,
                      height: size.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width &&
                    selectedChart.height === size.height
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
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
      {selectedChart.type === "text" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Text Content
            </label>
            <textarea
              value={selectedChart.data?.content || "Sample Text"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, content: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              rows={3}
              placeholder="Enter your text content..."
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Text Size
            </label>
            <select
              value={selectedChart.data?.size || "medium"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, size: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="small">Small Text</option>
              <option value="medium">Medium Text</option>
              <option value="large">Large Text</option>
              <option value="xlarge">Extra Large Text</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Text Alignment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["left", "center", "right"].map((align) => (
                <button
                  key={align}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      data: { ...selectedChart.data, align },
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors capitalize ${
                    selectedChart.data?.align === align
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.color || "#374151"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: { ...selectedChart.data, color: e.target.value },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.color || "#374151"}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 200,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="100"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 60,
                    })
                  }
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
      {selectedChart.type === "image" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Upload Image
            </label>
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
                          fileName: file.name,
                        },
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
                    📁 {selectedChart.data?.fileName || "Uploaded Image"}
                  </span>
                  <button
                    onClick={() =>
                      onUpdateChart(selectedChart.id, {
                        data: {
                          ...selectedChart.data,
                          imageUrl: null,
                          hasImage: false,
                          fileName: null,
                        },
                      })
                    }
                    className={`text-xs text-red-500 hover:text-red-700`}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Placeholder Text
            </label>
            <input
              type="text"
              value={selectedChart.data?.text || "Image"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, text: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Text shown when no image"
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Image Fit
            </label>
            <select
              value={selectedChart.data?.objectFit || "cover"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, objectFit: e.target.value },
                })
              }
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
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Border Radius
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="50"
                value={selectedChart.data?.borderRadius || 8}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      borderRadius: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
              <div className="text-center">
                <span className={`text-sm ${textSecondaryClass}`}>
                  {selectedChart.data?.borderRadius || 8}px
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Border
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width (px)
                </label>
                <input
                  type="number"
                  value={selectedChart.data?.borderWidth || 0}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      data: {
                        ...selectedChart.data,
                        borderWidth: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Color
                </label>
                <input
                  type="color"
                  value={selectedChart.data?.borderColor || "#E5E7EB"}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      data: {
                        ...selectedChart.data,
                        borderColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-8 rounded border-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 200,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 150,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Image Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Small", width: 120, height: 80 },
                { label: "Medium", width: 200, height: 150 },
                { label: "Large", width: 300, height: 200 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: size.width,
                      height: size.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width &&
                    selectedChart.height === size.height
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Square", ratio: "1:1", width: 200, height: 200 },
                { label: "16:9", ratio: "16:9", width: 280, height: 158 },
                { label: "4:3", ratio: "4:3", width: 240, height: 180 },
                { label: "3:2", ratio: "3:2", width: 240, height: 160 },
              ].map((aspect) => (
                <button
                  key={aspect.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: aspect.width,
                      height: aspect.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
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
      {selectedChart.type === "card" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Card Title
            </label>
            <input
              type="text"
              value={selectedChart.data?.cardTitle || "Card Title"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, cardTitle: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Card title"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Card Content
            </label>
            <textarea
              value={selectedChart.data?.content || "Card content goes here..."}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, content: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              rows={3}
              placeholder="Card content"
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Card Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.backgroundColor || "#FFFFFF"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      backgroundColor: e.target.value,
                    },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.backgroundColor || "#FFFFFF"}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 250,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="150"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 150,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="80"
                  max="300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Card Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Small", width: 200, height: 120 },
                { label: "Medium", width: 250, height: 150 },
                { label: "Large", width: 300, height: 200 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: size.width,
                      height: size.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width &&
                    selectedChart.height === size.height
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
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
      {selectedChart.type === "navigation" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Menu Items
            </label>
            <div className="space-y-2">
              {(
                selectedChart.data?.items || [
                  "Home",
                  "About",
                  "Services",
                  "Contact",
                ]
              ).map((item: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [
                        ...(selectedChart.data?.items || [
                          "Home",
                          "About",
                          "Services",
                          "Contact",
                        ]),
                      ];
                      newItems[index] = e.target.value;
                      onUpdateChart(selectedChart.id, {
                        data: { ...selectedChart.data, items: newItems },
                      });
                    }}
                    className={`flex-1 px-3 py-2 border rounded-lg ${inputClass}`}
                    placeholder={`Menu ${index + 1}`}
                  />
                  {(
                    selectedChart.data?.items || [
                      "Home",
                      "About",
                      "Services",
                      "Contact",
                    ]
                  ).length > 2 && (
                    <button
                      onClick={() => {
                        const newItems = [
                          ...(selectedChart.data?.items || [
                            "Home",
                            "About",
                            "Services",
                            "Contact",
                          ]),
                        ];
                        newItems.splice(index, 1);
                        onUpdateChart(selectedChart.id, {
                          data: { ...selectedChart.data, items: newItems },
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
              {(
                selectedChart.data?.items || [
                  "Home",
                  "About",
                  "Services",
                  "Contact",
                ]
              ).length < 6 && (
                <button
                  onClick={() => {
                    const newItems = [
                      ...(selectedChart.data?.items || [
                        "Home",
                        "About",
                        "Services",
                        "Contact",
                      ]),
                      "Menu",
                    ];
                    onUpdateChart(selectedChart.id, {
                      data: { ...selectedChart.data, items: newItems },
                    });
                  }}
                  className={`w-full px-3 py-2 border-2 border-dashed rounded-lg text-sm ${
                    isDarkMode
                      ? "border-gray-600 text-gray-400 hover:border-gray-500"
                      : "border-gray-300 text-gray-500 hover:border-gray-400"
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
      {selectedChart.type === "dropdown" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Placeholder Text
            </label>
            <input
              type="text"
              value={selectedChart.data?.placeholder || "Select option..."}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, placeholder: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Placeholder text when nothing selected"
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dropdown Options
            </label>
            <div className="space-y-2">
              {(
                selectedChart.data?.options || [
                  "Option 1",
                  "Option 2",
                  "Option 3",
                ]
              ).map((option: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [
                        ...(selectedChart.data?.options || [
                          "Option 1",
                          "Option 2",
                          "Option 3",
                        ]),
                      ];
                      newOptions[index] = e.target.value;
                      onUpdateChart(selectedChart.id, {
                        data: { ...selectedChart.data, options: newOptions },
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
                            hasSelection: true,
                          },
                        });
                      }}
                      className={`px-2 py-2 rounded transition-colors ${
                        selectedChart.data?.selectedOption === option
                          ? "bg-blue-500 text-white"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title="Set as selected"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    {(
                      selectedChart.data?.options || [
                        "Option 1",
                        "Option 2",
                        "Option 3",
                      ]
                    ).length > 1 && (
                      <button
                        onClick={() => {
                          const newOptions = [
                            ...(selectedChart.data?.options || [
                              "Option 1",
                              "Option 2",
                              "Option 3",
                            ]),
                          ];
                          newOptions.splice(index, 1);
                          onUpdateChart(selectedChart.id, {
                            data: {
                              ...selectedChart.data,
                              options: newOptions,
                              selectedOption:
                                selectedChart.data?.selectedOption === option
                                  ? null
                                  : selectedChart.data?.selectedOption,
                            },
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
              {(
                selectedChart.data?.options || [
                  "Option 1",
                  "Option 2",
                  "Option 3",
                ]
              ).length < 10 && (
                <button
                  onClick={() => {
                    const newOptions = [
                      ...(selectedChart.data?.options || [
                        "Option 1",
                        "Option 2",
                        "Option 3",
                      ]),
                      `Option ${
                        (
                          selectedChart.data?.options || [
                            "Option 1",
                            "Option 2",
                            "Option 3",
                          ]
                        ).length + 1
                      }`,
                    ];
                    onUpdateChart(selectedChart.id, {
                      data: { ...selectedChart.data, options: newOptions },
                    });
                  }}
                  className={`w-full px-3 py-2 border-2 border-dashed rounded-lg text-sm ${
                    isDarkMode
                      ? "border-gray-600 text-gray-400 hover:border-gray-500"
                      : "border-gray-300 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Add Option
                </button>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Selected Option
            </label>
            <div className="space-y-2">
              {selectedChart.data?.hasSelection &&
              selectedChart.data?.selectedOption ? (
                <div
                  className={`px-3 py-2 border rounded-lg ${
                    isDarkMode
                      ? "bg-blue-900/20 border-blue-700 text-blue-300"
                      : "bg-blue-50 border-blue-200 text-blue-700"
                  }`}
                >
                  ✓ {selectedChart.data.selectedOption}
                  <button
                    onClick={() =>
                      onUpdateChart(selectedChart.id, {
                        data: {
                          ...selectedChart.data,
                          selectedOption: null,
                          hasSelection: false,
                        },
                      })
                    }
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div
                  className={`px-3 py-2 border rounded-lg text-center ${
                    isDarkMode
                      ? "border-gray-600 text-gray-400"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  No option selected (shows placeholder)
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dropdown Style
            </label>
            <select
              value={selectedChart.data?.style || "default"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, style: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="default">Default Dropdown</option>
              <option value="filled">Filled Background</option>
              <option value="outlined">Outlined Only</option>
              <option value="underlined">Underlined</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Border Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.borderColor || "#D1D5DB"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      borderColor: e.target.value,
                    },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.borderColor || "#D1D5DB"}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.backgroundColor || "#FFFFFF"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      backgroundColor: e.target.value,
                    },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.backgroundColor || "#FFFFFF"}
              </span>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 200,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="120"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 40,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="32"
                  max="60"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dropdown Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Small", width: 150, height: 32 },
                { label: "Medium", width: 200, height: 40 },
                { label: "Large", width: 250, height: 48 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: size.width,
                      height: size.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width &&
                    selectedChart.height === size.height
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
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
      {selectedChart.type === "checkbox" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Checkbox Label
            </label>
            <input
              type="text"
              value={selectedChart.data?.text || "Checkbox option"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, text: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter checkbox label..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedChart.data?.checked || false}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, checked: e.target.checked },
                })
              }
              className="w-4 h-4"
            />
            <label className={`text-sm ${textSecondaryClass}`}>
              Checked by default
            </label>
          </div>
        </div>
      )}

      {/* Radio Button Component */}
      {selectedChart.type === "radio" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Group Label
            </label>
            <input
              type="text"
              value={selectedChart.data?.label || "Select an option:"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, label: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter group label..."
            />
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Options
            </label>
            <div className="space-y-2">
              {(
                selectedChart.data?.options || [
                  "Option 1",
                  "Option 2",
                  "Option 3",
                ]
              ).map((option: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [
                        ...(selectedChart.data?.options || [
                          "Option 1",
                          "Option 2",
                          "Option 3",
                        ]),
                      ];
                      newOptions[index] = e.target.value;
                      onUpdateChart(selectedChart.id, {
                        data: { ...selectedChart.data, options: newOptions },
                      });
                    }}
                    className={`flex-1 px-3 py-2 border rounded-lg ${inputClass}`}
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    onClick={() => {
                      const newOptions = [
                        ...(selectedChart.data?.options || [
                          "Option 1",
                          "Option 2",
                          "Option 3",
                        ]),
                      ];
                      newOptions.splice(index, 1);
                      onUpdateChart(selectedChart.id, {
                        data: { ...selectedChart.data, options: newOptions },
                      });
                    }}
                    className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                    disabled={
                      (
                        selectedChart.data?.options || [
                          "Option 1",
                          "Option 2",
                          "Option 3",
                        ]
                      ).length <= 2
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const newOptions = [
                  ...(selectedChart.data?.options || [
                    "Option 1",
                    "Option 2",
                    "Option 3",
                  ]),
                  `Option ${
                    (
                      selectedChart.data?.options || [
                        "Option 1",
                        "Option 2",
                        "Option 3",
                      ]
                    ).length + 1
                  }`,
                ];
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, options: newOptions },
                });
              }}
              className="mt-2 px-3 py-1 text-sm text-blue-500 hover:bg-blue-50 rounded"
            >
              + Add Option
            </button>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Default Selection
            </label>
            <select
              value={
                selectedChart.data?.selected ||
                (selectedChart.data?.options || [
                  "Option 1",
                  "Option 2",
                  "Option 3",
                ])[0]
              }
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, selected: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              {(
                selectedChart.data?.options || [
                  "Option 1",
                  "Option 2",
                  "Option 3",
                ]
              ).map((option: string, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Layout Style
            </label>
            <select
              value={selectedChart.data?.layout || "horizontal"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, layout: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="horizontal">Horizontal Layout</option>
              <option value="vertical">Vertical Layout</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Radio Button Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Selected Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.color || "#3B82F6"}
                    onChange={(e) =>
                      onUpdateChart(selectedChart.id, {
                        data: { ...selectedChart.data, color: e.target.value },
                      })
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.color || "#3B82F6"}
                  </span>
                </div>
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Border Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.borderColor || "#D1D5DB"}
                    onChange={(e) =>
                      onUpdateChart(selectedChart.id, {
                        data: {
                          ...selectedChart.data,
                          borderColor: e.target.value,
                        },
                      })
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.borderColor || "#D1D5DB"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 200,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="150"
                  max="600"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 120,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="80"
                  max="300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Radio Button Size
            </label>
            <select
              value={selectedChart.data?.size || "medium"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, size: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Spacing
            </label>
            <select
              value={selectedChart.data?.spacing || "medium"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, spacing: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="tight">Tight</option>
              <option value="medium">Medium</option>
              <option value="loose">Loose</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Label Size
            </label>
            <select
              value={selectedChart.data?.labelSize || "medium"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, labelSize: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Size Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Small", width: 150, height: 80 },
                { label: "Medium", width: 200, height: 120 },
                { label: "Large", width: 300, height: 180 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: size.width,
                      height: size.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width &&
                    selectedChart.height === size.height
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress Component */}
      {selectedChart.type === "progress" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Progress Label
            </label>
            <input
              type="text"
              value={selectedChart.data?.text || "Progress"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, text: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Enter progress label..."
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Progress Value
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedChart.data?.progress || 65}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      progress: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full"
              />
              <div className="text-center">
                <span className={`text-sm ${textSecondaryClass}`}>
                  {selectedChart.data?.progress || 65}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Component */}
      {selectedChart.type === "alert" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Alert Title
            </label>
            <input
              type="text"
              value={selectedChart.data?.alertTitle || "Alert"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, alertTitle: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Alert title"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Alert Message
            </label>
            <textarea
              value={selectedChart.data?.message || "This is an alert message"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, message: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              rows={3}
              placeholder="Alert message content"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Alert Type
            </label>
            <select
              value={selectedChart.data?.type || "info"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, type: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="info">Info (Blue)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="error">Error (Red)</option>
              <option value="success">Success (Green)</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 300,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="200"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 80,
                    })
                  }
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
      {selectedChart.type === "avatar" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Upload Avatar Image
            </label>
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
                        fileName: file.name,
                      },
                    });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg ${inputClass} cursor-pointer`}
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Initials (if no image)
            </label>
            <input
              type="text"
              value={selectedChart.data?.text || "JD"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, text: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="User initials"
              maxLength={3}
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Avatar Size
            </label>
            <select
              value={selectedChart.data?.size || "medium"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, size: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="small">Small (32px)</option>
              <option value="medium">Medium (48px)</option>
              <option value="large">Large (64px)</option>
              <option value="xlarge">Extra Large (80px)</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 80,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="150"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 80,
                    })
                  }
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
      {selectedChart.type === "badge" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Badge Text
            </label>
            <input
              type="text"
              value={selectedChart.data?.text || "Badge"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, text: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Badge text"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Badge Variant
            </label>
            <select
              value={selectedChart.data?.variant || "default"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, variant: e.target.value },
                })
              }
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
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 80,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="200"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 32,
                    })
                  }
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
      {selectedChart.type === "switch" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Switch Label
            </label>
            <input
              type="text"
              value={selectedChart.data?.text || "Switch"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, text: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Switch label"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedChart.data?.isOn || false}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, isOn: e.target.checked },
                })
              }
              className="w-4 h-4"
            />
            <label className={`text-sm ${textSecondaryClass}`}>
              On by default
            </label>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 120,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="80"
                  max="200"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 40,
                    })
                  }
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
      {selectedChart.type === "slider" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Slider Label
            </label>
            <input
              type="text"
              value={selectedChart.data?.label || "Slider"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, label: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Slider label"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Slider Value
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedChart.data?.value || 50}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: {
                      ...selectedChart.data,
                      value: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full"
              />
              <div className="text-center">
                <span className={`text-sm ${textSecondaryClass}`}>
                  {selectedChart.data?.value || 50}
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 200,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="150"
                  max="400"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 60,
                    })
                  }
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
      {selectedChart.type === "textarea" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Placeholder Text
            </label>
            <input
              type="text"
              value={selectedChart.data?.placeholder || "Enter your message..."}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, placeholder: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
              placeholder="Placeholder text"
            />
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Textarea Colors
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Border Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.borderColor || "#D1D5DB"}
                    onChange={(e) =>
                      onUpdateChart(selectedChart.id, {
                        data: {
                          ...selectedChart.data,
                          borderColor: e.target.value,
                        },
                      })
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.borderColor || "#D1D5DB"}
                  </span>
                </div>
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedChart.data?.backgroundColor || "#FFFFFF"}
                    onChange={(e) =>
                      onUpdateChart(selectedChart.id, {
                        data: {
                          ...selectedChart.data,
                          backgroundColor: e.target.value,
                        },
                      })
                    }
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <span className={`text-xs ${textSecondaryClass}`}>
                    {selectedChart.data?.backgroundColor || "#FFFFFF"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 250,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="200"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 100,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="80"
                  max="200"
                />
              </div>
            </div>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Textarea Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Small", width: 200, height: 80 },
                { label: "Medium", width: 250, height: 100 },
                { label: "Large", width: 300, height: 120 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() =>
                    onUpdateChart(selectedChart.id, {
                      width: size.width,
                      height: size.height,
                    })
                  }
                  className={`px-2 py-1 text-xs border rounded transition-colors ${
                    selectedChart.width === size.width &&
                    selectedChart.height === size.height
                      ? isDarkMode
                        ? "border-blue-500 bg-blue-900/20 text-blue-400"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : isDarkMode
                      ? "border-gray-600 text-gray-300 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
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
      {selectedChart.type === "separator" && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Orientation
            </label>
            <select
              value={selectedChart.data?.orientation || "horizontal"}
              onChange={(e) =>
                onUpdateChart(selectedChart.id, {
                  data: { ...selectedChart.data, orientation: e.target.value },
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${inputClass}`}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Separator Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={selectedChart.data?.color || "#D1D5DB"}
                onChange={(e) =>
                  onUpdateChart(selectedChart.id, {
                    data: { ...selectedChart.data, color: e.target.value },
                  })
                }
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className={`text-sm ${textSecondaryClass}`}>
                {selectedChart.data?.color || "#D1D5DB"}
              </span>
            </div>
          </div>
          <div>
            <label className={`block text-sm ${textSecondaryClass} mb-2`}>
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Width
                </label>
                <input
                  type="number"
                  value={selectedChart.width}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      width: parseInt(e.target.value) || 200,
                    })
                  }
                  className={`w-full px-2 py-1 text-sm border rounded ${inputClass}`}
                  min="50"
                  max="500"
                />
              </div>
              <div>
                <label className={`block text-xs ${textSecondaryClass} mb-1`}>
                  Height
                </label>
                <input
                  type="number"
                  value={selectedChart.height}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, {
                      height: parseInt(e.target.value) || 20,
                    })
                  }
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
  const lines = csvText.split("\n").filter((line) => line.trim());
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  const nameIndex = headers.findIndex(
    (h) => h.includes("name") || h.includes("label")
  );
  const valueIndex = headers.findIndex(
    (h) => h.includes("value") || h.includes("amount") || h.includes("count")
  );

  if (nameIndex === -1 || valueIndex === -1) {
    throw new Error('CSV must contain "name" and "value" columns');
  }

  const data: ChartDataItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length >= 2) {
      const name = values[nameIndex]?.trim().replace(/"/g, "");
      const value = parseFloat(values[valueIndex]?.trim().replace(/"/g, ""));

      if (name && !isNaN(value)) {
        data.push({
          name,
          value,
          color: `#${Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")}`,
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

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chart-data-sample.csv";
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
  onAddReply,
  onShowFixframeAI,
  charts = [],
  projectName = "My Dashboard",
  showCodeModal: parentShowCodeModal = false,
  onShowCodeModal: parentOnShowCodeModal,
}: ChartCustomizerProps) {
  const [activeTab, setActiveTab] = useState<
    "size" | "colors" | "typography" | "data" | "comments"
  >("size");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showApiConnection, setShowApiConnection] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedZipBlob, setGeneratedZipBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpening, setIsModalOpening] = useState(false);

  // Create React Project Structure
  const createReactProject = () => {
    const cleanProjectName = projectName.replace(/\s+/g, "-").toLowerCase();

    return {
      "package.json": JSON.stringify(
        {
          name: cleanProjectName,
          version: "1.0.0",
          description: "Generated dashboard project from Fixframe",
          private: true,
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            "react-scripts": "5.0.1",
            recharts: "^2.8.0",
            typescript: "^4.9.5",
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
          },
          scripts: {
            start: "react-scripts start",
            build: "react-scripts build",
            test: "react-scripts test",
            eject: "react-scripts eject",
          },
          eslintConfig: {
            extends: ["react-app", "react-app/jest"],
          },
          browserslist: {
            production: [">0.2%", "not dead", "not op_mini all"],
            development: [
              "last 1 chrome version",
              "last 1 firefox version",
              "last 1 safari version",
            ],
          },
        },
        null,
        2
      ),

      "tsconfig.json": JSON.stringify(
        {
          compilerOptions: {
            target: "es5",
            lib: ["dom", "dom.iterable", "es6"],
            allowJs: true,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noFallthroughCasesInSwitch: true,
            module: "esnext",
            moduleResolution: "node",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
          },
          include: ["src"],
        },
        null,
        2
      ),

      "public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Generated dashboard project from Fixframe" />
    <title>${cleanProjectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`,

      "public/manifest.json": JSON.stringify(
        {
          short_name: cleanProjectName,
          name: `${cleanProjectName} Dashboard`,
          icons: [
            {
              src: "favicon.ico",
              sizes: "64x64 32x32 24x24 16x16",
              type: "image/x-icon",
            },
          ],
          start_url: ".",
          display: "standalone",
          theme_color: "#000000",
          background_color: "#ffffff",
        },
        null,
        2
      ),

      "src/index.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

      "src/App.tsx": `import React from 'react';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header title="${cleanProjectName}" />
      <Dashboard />
    </div>
  );
}

export default App;`,

      "src/components/Dashboard.tsx":
        "// Dashboard component will be generated here",

      "src/components/Header.tsx": `import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="dashboard-header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button className="btn-primary">Export</button>
        <button className="btn-secondary">Settings</button>
      </div>
    </header>
  );
};

export default Header;`,

      "src/components/Chart.tsx": `import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: any[];
  title: string;
}

const Chart: React.FC<ChartProps> = ({ data, title }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;`,

      "src/pages/Home.tsx": `import React from 'react';
import Dashboard from '../components/Dashboard';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Dashboard />
    </div>
  );
};

export default Home;`,

      "src/styles/globals.css": `/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

.App {
  min-height: 100vh;
}

/* Dashboard Styles */
.dashboard-header {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

/* Chart Styles */
.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    justify-content: center;
  }
}`,

      "README.md": `# ${cleanProjectName}

This is a generated dashboard project created with Fixframe.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

\`\`\`
${cleanProjectName}/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Chart.tsx
│   │   └── Header.tsx
│   ├── pages/
│   │   └── Home.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## Features

- TypeScript support
- Responsive dashboard layout
- Interactive charts and components
- Modern React architecture
- Clean, maintainable code structure

## Available Scripts

- \`npm start\` - Runs the app in development mode
- \`npm build\` - Builds the app for production
- \`npm test\` - Launches the test runner
- \`npm eject\` - Ejects from Create React App (one-way operation)`,
    };
  };

  // Generate ZIP file
  const generateZipFile = React.useCallback(async () => {
    try {
      console.log("Generating ZIP file...");
      console.log("Project name:", projectName);

      const projectFiles = createReactProject();
      console.log("Project files created:", Object.keys(projectFiles));

      const zip = new JSZip();

      // Create dashboard folder
      const dashboardFolder = zip.folder("dashboard");
      if (!dashboardFolder) {
        throw new Error("Failed to create dashboard folder in ZIP");
      }

      // Add files to dashboard folder
      Object.entries(projectFiles).forEach(([path, content]) => {
        dashboardFolder.file(path, content);
      });

      console.log("Files added to ZIP, generating blob...");

      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ type: "blob" });
      console.log("ZIP blob generated:", zipBlob);

      setGeneratedZipBlob(zipBlob);

      return zipBlob;
    } catch (error) {
      console.error("Error generating ZIP:", error);
      throw error;
    }
  }, [projectName]);

  // Sync parent modal state with local state
  React.useEffect(() => {
    console.log(
      "EnhancedChartCustomizer: parentShowCodeModal changed:",
      parentShowCodeModal
    );
    if (parentShowCodeModal) {
      console.log("EnhancedChartCustomizer: Setting showCodeModal to true");
      setIsModalOpening(true);
      setShowCodeModal(true);
      // Clear modal opening state after a short delay
      setTimeout(() => setIsModalOpening(false), 100);
    }
  }, [parentShowCodeModal]);

  // Generate ZIP file when modal opens
  React.useEffect(() => {
    if ((showCodeModal || parentShowCodeModal) && !generatedZipBlob) {
      setIsLoading(true);
      generateZipFile()
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error("Error generating ZIP:", error);
          setIsLoading(false);
        });
    }
  }, [showCodeModal, parentShowCodeModal, generateZipFile, generatedZipBlob]);

  // Enhanced Code Exporter State
  const [selectedFramework, setSelectedFramework] = useState<
    "react-recharts" | "react-chartjs" | "vue" | "angular" | "python"
  >("react-recharts");
  const [selectedStyling, setSelectedStyling] = useState<
    "tailwind" | "css" | "bootstrap"
  >("tailwind");
  const [includeDarkMode, setIncludeDarkMode] = useState(true);
  const [exportStructure, setExportStructure] = useState<"single" | "multiple">(
    "single"
  );
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);

  // New customization options
  const [responsiveLayout, setResponsiveLayout] = useState(true);
  const [splitIntoComponents, setSplitIntoComponents] = useState(false);
  const [includeSampleData, setIncludeSampleData] = useState(true);
  const [addComments, setAddComments] = useState(true);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  // API Connection State
  const [apiUrl, setApiUrl] = useState("");
  const [httpMethod, setHttpMethod] = useState<
    "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  >("GET");
  const [apiPayload, setApiPayload] = useState("");
  const [apiAuth, setApiAuth] = useState("");
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showResponsePreview, setShowResponsePreview] = useState(false);

  // Database Connection State
  const [showDatabaseConnection, setShowDatabaseConnection] = useState(false);
  const [dbType, setDbType] = useState<
    "MySQL" | "PostgreSQL" | "MongoDB" | "SQL Server" | "Oracle"
  >("MySQL");
  const [dbHost, setDbHost] = useState("");
  const [dbPort, setDbPort] = useState("");
  const [dbName, setDbName] = useState("");
  const [dbUsername, setDbUsername] = useState("");
  const [dbPassword, setDbPassword] = useState("");
  const [dbSslMode, setDbSslMode] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [dbConnectionStatus, setDbConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [dbConnectionMessage, setDbConnectionMessage] = useState("");

  // Set appropriate default tab based on component type
  React.useEffect(() => {
    if (!selectedChart) return; // Guard against null selectedChart

    const isWireframe = [
      "button",
      "iconbutton",
      "input",
      "text",
      "image",
      "card",
      "navigation",
      "dropdown",
      "checkbox",
      "radio",
      "progress",
      "alert",
      "avatar",
      "badge",
      "switch",
      "slider",
      "textarea",
      "separator",
    ].includes(selectedChart.type);
    if (isWireframe) {
      setActiveTab("data");
    } else if (activeTab === "data" && !isWireframe) {
      setActiveTab("size");
    }
  }, [selectedChart?.type]);
  const [newComment, setNewComment] = useState("");
  const [newAuthor, setNewAuthor] = useState("Reviewer");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [replyAuthor, setReplyAuthor] = useState<{ [key: string]: string }>({});

  const bgClass = isDarkMode ? "bg-gray-900" : "bg-white";
  const borderClass = isDarkMode ? "border-gray-700" : "border-gray-200";
  const textClass = isDarkMode ? "text-gray-100" : "text-gray-900";
  const textSecondaryClass = isDarkMode ? "text-gray-400" : "text-gray-500";
  const inputClass = isDarkMode
    ? "bg-gray-800 border-gray-600 text-gray-100 focus:border-blue-500"
    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500";

  if (!selectedChart) {
    return (
      <div
        className={`w-80 ${bgClass} border-l ${borderClass} p-6 flex flex-col`}
      >
        {/* Theme Toggle */}
        <div className="mb-6">
          <button
            onClick={onToggleTheme}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Palette
              className={`w-12 h-12 mx-auto mb-4 ${textSecondaryClass}`}
            />
            <h3 className={`text-lg font-medium mb-2 ${textClass}`}>
              No Chart Selected
            </h3>
            <p className={`text-sm ${textSecondaryClass}`}>
              Select a chart to customize its appearance
            </p>
          </div>
        </div>
      </div>
    );
  }

  const updateChartData = (
    dataIndex: number,
    field: "name" | "value" | "color",
    value: any
  ) => {
    if (!Array.isArray(selectedChart.data)) return;
    const newData = [...selectedChart.data];
    newData[dataIndex] = { ...newData[dataIndex], [field]: value };
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const addDataPoint = () => {
    if (!Array.isArray(selectedChart.data)) return;
    const newData = [
      ...selectedChart.data,
      {
        name: `Item ${selectedChart.data.length + 1}`,
        value: 50,
        color:
          COLOR_PRESETS[0][selectedChart.data.length % COLOR_PRESETS[0].length],
      },
    ];
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const removeDataPoint = (index: number) => {
    if (!Array.isArray(selectedChart.data) || selectedChart.data.length <= 1)
      return;
    const newData = selectedChart.data.filter(
      (_: any, i: number) => i !== index
    );
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const applyColorPreset = (colors: string[]) => {
    if (!Array.isArray(selectedChart.data)) return;
    const newData = selectedChart.data.map((item: any, index: number) => ({
      ...item,
      color: colors[index % colors.length],
    }));
    onUpdateChart(selectedChart.id, { data: newData });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let parsedData: ChartDataItem[] = [];

        if (file.name.endsWith(".csv")) {
          parsedData = parseCSV(content);
        } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          // For Excel files, show a message that CSV is preferred for now
          alert(
            "Excel files are not yet supported. Please convert to CSV format or download the sample CSV to see the required format."
          );
          return;
        }

        if (parsedData.length === 0) {
          alert("No valid data found. Please check your file format.");
          return;
        }

        // Update chart data based on chart type
        if (["bar", "donut", "line", "area"].includes(selectedChart.type)) {
          onUpdateChart(selectedChart.id, { data: parsedData });
        } else if (selectedChart.type === "combo") {
          // Convert to combo chart format
          const comboData = parsedData.map((item) => ({
            name: item.name,
            barValue: item.value,
            lineValue: item.value * 1.2, // Add some variation for line
            barColor: item.color,
            lineColor: item.color,
          }));
          onUpdateChart(selectedChart.id, { data: comboData });
        } else if (selectedChart.type === "multibar") {
          // Convert to multibar format
          const multibarData = parsedData.map((item) => ({
            name: item.name,
            series1: item.value,
            series2: item.value * 0.8,
            series3: item.value * 1.1,
          }));
          onUpdateChart(selectedChart.id, { data: multibarData });
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        alert(
          `Error parsing file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };

    reader.onerror = () => {
      alert("Error reading file. Please try again.");
    };

    reader.readAsText(file);
  };

  // Database Connection Functions
  const handleDbTypeChange = (
    newType: "MySQL" | "PostgreSQL" | "MongoDB" | "SQL Server" | "Oracle"
  ) => {
    setDbType(newType);

    // Set default ports based on database type
    const defaultPorts = {
      MySQL: "3306",
      PostgreSQL: "5432",
      MongoDB: "27017",
      "SQL Server": "1433",
      Oracle: "1521",
    };

    setDbPort(defaultPorts[newType]);
  };

  const handleTestConnection = async () => {
    if (
      !dbHost.trim() ||
      !dbPort.trim() ||
      !dbName.trim() ||
      !dbUsername.trim()
    ) {
      setDbConnectionStatus("error");
      setDbConnectionMessage("Please fill in all required fields");
      return;
    }

    setIsTestingConnection(true);
    setDbConnectionStatus("idle");
    setDbConnectionMessage("");

    try {
      // Simulate connection test (in real implementation, this would make an API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, simulate success
      setDbConnectionStatus("success");
      setDbConnectionMessage(`Successfully connected to ${dbType} database`);
    } catch (error) {
      setDbConnectionStatus("error");
      setDbConnectionMessage(
        "Failed to connect to database. Please check your credentials."
      );
    } finally {
      setIsTestingConnection(false);
    }
  };

  // API Connection Functions
  const handleApiFetch = async () => {
    if (!apiUrl.trim()) {
      setApiError("Please enter a valid API URL");
      return;
    }

    setIsLoadingApi(true);
    setApiError(null);
    setApiResponse(null);

    try {
      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authorization header if provided
      if (apiAuth.trim()) {
        headers["Authorization"] = apiAuth.trim();
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: httpMethod,
        headers,
      };

      // Add body for POST/PUT/PATCH requests
      if (["POST", "PUT", "PATCH"].includes(httpMethod) && apiPayload.trim()) {
        try {
          JSON.parse(apiPayload); // Validate JSON
          requestOptions.body = apiPayload;
        } catch (error) {
          setApiError("Invalid JSON payload. Please check your syntax.");
          setIsLoadingApi(false);
          return;
        }
      }

      // Make the API request
      const response = await fetch(apiUrl, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setApiResponse(data);
      setShowResponsePreview(true);

      // Try to parse the response for chart data
      const parsedData = parseApiResponse(data);
      if (parsedData.length > 0) {
        // Update chart data based on chart type
        if (["bar", "donut", "line", "area"].includes(selectedChart.type)) {
          onUpdateChart(selectedChart.id, { data: parsedData });
        } else if (selectedChart.type === "combo") {
          const comboData = parsedData.map((item) => ({
            name: item.name,
            barValue: item.value,
            lineValue: item.value * 1.2,
            barColor: item.color,
            lineColor: item.color,
          }));
          onUpdateChart(selectedChart.id, { data: comboData });
        } else if (selectedChart.type === "multibar") {
          const multibarData = parsedData.map((item) => ({
            name: item.name,
            series1: item.value,
            series2: item.value * 0.8,
            series3: item.value * 1.1,
          }));
          onUpdateChart(selectedChart.id, { data: multibarData });
        }
      }
    } catch (error) {
      console.error("API fetch error:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : "Couldn't fetch data. Please check URL or payload."
      );
    } finally {
      setIsLoadingApi(false);
    }
  };

  const parseApiResponse = (data: any): ChartDataItem[] => {
    try {
      // Handle different response formats
      if (Array.isArray(data)) {
        // Direct array of objects
        return data.map((item, index) => ({
          name: item.name || item.label || item.title || `Item ${index + 1}`,
          value:
            typeof item.value === "number"
              ? item.value
              : typeof item.count === "number"
              ? item.count
              : typeof item.amount === "number"
              ? item.amount
              : Math.random() * 100, // Fallback
          color: item.color || `hsl(${index * 60}, 70%, 50%)`,
        }));
      } else if (data.data && Array.isArray(data.data)) {
        // Wrapped in data property
        return parseApiResponse(data.data);
      } else if (data.results && Array.isArray(data.results)) {
        // Wrapped in results property
        return parseApiResponse(data.results);
      } else if (data.items && Array.isArray(data.items)) {
        // Wrapped in items property
        return parseApiResponse(data.items);
      } else {
        // Single object - convert to array
        return [
          {
            name: data.name || data.label || data.title || "Data Point",
            value:
              typeof data.value === "number"
                ? data.value
                : typeof data.count === "number"
                ? data.count
                : typeof data.amount === "number"
                ? data.amount
                : Math.random() * 100,
            color: data.color || "hsl(0, 70%, 50%)",
          },
        ];
      }
    } catch (error) {
      console.error("Error parsing API response:", error);
      return [];
    }
  };

  // Enhanced Dashboard Code Generation Functions
  const generateDashboardCode = () => {
    if (charts.length === 0) {
      return "// No components found. Add charts/components to generate code.";
    }

    switch (selectedFramework) {
      case "react-recharts":
        return generateReactRechartsCode();
      case "react-chartjs":
        return generateReactChartJSCode();
      case "vue":
        return generateVueCode();
      case "angular":
        return generateAngularCode();
      case "python":
        return generatePythonCode();
      default:
        return generateReactRechartsCode();
    }
  };

  const generateChartCode = (chart: any) => {
    if (!chart) return "";

    const chartType = chart.type;
    const chartTitle = chart.title || "My Chart";
    const chartData = chart.data || [];

    // Generate sample data if no data exists
    const sampleData =
      chartData.length > 0
        ? chartData
        : [
            { name: "Jan", value: 400 },
            { name: "Feb", value: 300 },
            { name: "Mar", value: 200 },
            { name: "Apr", value: 278 },
            { name: "May", value: 189 },
          ];

    const dataString = JSON.stringify(sampleData, null, 2);

    switch (chartType) {
      case "bar":
        return `import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const fetchData = async () => {
  const res = await axios.get("https://api.example.com/data");
  return res.data.map(d => ({ name: d.name, value: d.value }));
};

const ${chartTitle.replace(/\s+/g, "")} = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

// Sample data
const sampleData = ${dataString};

export default ${chartTitle.replace(/\s+/g, "")};`;

      case "line":
        return `import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const fetchData = async () => {
  const res = await axios.get("https://api.example.com/data");
  return res.data.map(d => ({ name: d.name, value: d.value }));
};

const ${chartTitle.replace(/\s+/g, "")} = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

// Sample data
const sampleData = ${dataString};

export default ${chartTitle.replace(/\s+/g, "")};`;

      case "area":
        return `import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const fetchData = async () => {
  const res = await axios.get("https://api.example.com/data");
  return res.data.map(d => ({ name: d.name, value: d.value }));
};

const ${chartTitle.replace(/\s+/g, "")} = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
    </AreaChart>
  </ResponsiveContainer>
);

// Sample data
const sampleData = ${dataString};

export default ${chartTitle.replace(/\s+/g, "")};`;

      case "donut":
        return `import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import axios from "axios";

const fetchData = async () => {
  const res = await axios.get("https://api.example.com/data");
  return res.data.map(d => ({ name: d.name, value: d.value }));
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ${chartTitle.replace(/\s+/g, "")} = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

// Sample data
const sampleData = ${dataString};

export default ${chartTitle.replace(/\s+/g, "")};`;

      case "combo":
        return `import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const fetchData = async () => {
  const res = await axios.get("https://api.example.com/data");
  return res.data.map(d => ({ name: d.name, value: d.value, secondary: d.secondary || d.value * 1.2 }));
};

const ${chartTitle.replace(/\s+/g, "")} = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
      <Line type="monotone" dataKey="secondary" stroke="#ff7300" strokeWidth={2} />
    </ComposedChart>
  </ResponsiveContainer>
);

// Sample data
const sampleData = ${dataString};

export default ${chartTitle.replace(/\s+/g, "")};`;

      case "multi-bar":
        return `import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";

const fetchData = async () => {
  const res = await axios.get("https://api.example.com/data");
  return res.data.map(d => ({ 
    name: d.name, 
    series1: d.series1 || d.value, 
    series2: d.series2 || d.value * 0.8 
  }));
};

const ${chartTitle.replace(/\s+/g, "")} = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="series1" fill="#8884d8" name="Series 1" />
      <Bar dataKey="series2" fill="#82ca9d" name="Series 2" />
    </BarChart>
  </ResponsiveContainer>
);

// Sample data
const sampleData = ${dataString};

export default ${chartTitle.replace(/\s+/g, "")};`;

      default:
        return `// Chart type "${chartType}" not supported yet
// Please select a supported chart type: bar, line, area, donut, combo, multi-bar

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ${chartTitle.replace(/\s+/g, "")} = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
);

export default ${chartTitle.replace(/\s+/g, "")};`;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Framework-specific code generators
  const generateReactRechartsCode = () => {
    const imports = `import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, ComposedChart, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';`;

    const chartComponents = charts
      .map((chart, index) => {
        const componentName = `${
          chart.title?.replace(/\s+/g, "") || `Chart${index + 1}`
        }`;
        const data =
          chart.data?.length > 0
            ? chart.data
            : [
                { name: "Jan", value: 400 },
                { name: "Feb", value: 300 },
                { name: "Mar", value: 200 },
              ];

        switch (chart.type) {
          case "bar":
            return `const ${componentName} = ({ data }) => (
  <div className="chart-container">
    <h3 className="chart-title">${chart.title || "Bar Chart"}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);`;

          case "line":
            return `const ${componentName} = ({ data }) => (
  <div className="chart-container">
    <h3 className="chart-title">${chart.title || "Line Chart"}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);`;

          case "donut":
            return `const ${componentName} = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="chart-container">
      <h3 className="chart-title">${chart.title || "Donut Chart"}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};`;

          default:
            return `const ${componentName} = ({ data }) => (
  <div className="chart-container">
    <h3 className="chart-title">${chart.title || "Chart"}</h3>
    <div className="placeholder-chart">
      <p>Chart type "${chart.type}" not implemented yet</p>
    </div>
  </div>
);`;
        }
      })
      .join("\n\n");

    const dataDefinitions = charts
      .map((chart, index) => {
        const dataName = `${
          chart.title?.replace(/\s+/g, "") || `chart${index + 1}`
        }Data`;
        const data =
          chart.data?.length > 0
            ? chart.data
            : [
                { name: "Jan", value: 400 },
                { name: "Feb", value: 300 },
                { name: "Mar", value: 200 },
              ];
        return `const ${dataName} = ${JSON.stringify(data, null, 2)};`;
      })
      .join("\n");

    const dashboardComponent = `const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(${includeDarkMode});
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={\`dashboard \${isDarkMode ? 'dark' : 'light'}\`}>
      <header className="dashboard-header">
        <h1>${projectName}</h1>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {isDarkMode ? '☀️' : '🌙'} Toggle Theme
        </button>
      </header>
      
      <main className="dashboard-grid">
        ${charts
          .map((chart, index) => {
            const componentName = `${
              chart.title?.replace(/\s+/g, "") || `Chart${index + 1}`
            }`;
            const dataName = `${
              chart.title?.replace(/\s+/g, "") || `chart${index + 1}`
            }Data`;
            return `<${componentName} data={${dataName}} />`;
          })
          .join("\n        ")}
      </main>
    </div>
  );
};

export default Dashboard;`;

    const cssStyles = `/* Dashboard Styles */
.dashboard {
  min-height: 100vh;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dashboard.dark {
  background-color: #1a1a1a;
  color: #e5e5e5;
}

.dashboard.light {
  background-color: #ffffff;
  color: #333333;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;
}

.dashboard.dark .dashboard-header {
  border-bottom-color: #374151;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.dashboard.dark .chart-container {
  background: #374151;
  border-color: #4b5563;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #111827;
}

.dashboard.dark .chart-title {
  color: #f9fafb;
}

.theme-toggle {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: #2563eb;
}`;

    return `${imports}

${chartComponents}

${dataDefinitions}

${dashboardComponent}

${cssStyles}`;
  };

  const generateReactChartJSCode = () => {
    return `import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(${includeDarkMode});

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={\`dashboard \${isDarkMode ? 'dark' : 'light'}\`}>
      <header className="dashboard-header">
        <h1>${projectName}</h1>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {isDarkMode ? '☀️' : '🌙'} Toggle Theme
        </button>
      </header>
      
      <main className="dashboard-grid">
        ${charts
          .map((chart, index) => {
            const data =
              chart.data?.length > 0
                ? chart.data
                : [
                    { name: "Jan", value: 400 },
                    { name: "Feb", value: 300 },
                    { name: "Mar", value: 200 },
                  ];

            const chartData = {
              labels: data.map((d: any) => d.name),
              datasets: [
                {
                  label: chart.title || "Data",
                  data: data.map((d: any) => d.value),
                  backgroundColor: "#8884d8",
                  borderColor: "#8884d8",
                },
              ],
            };

            const options = {
              responsive: true,
              plugins: {
                legend: {
                  position: "top" as const,
                },
                title: {
                  display: true,
                  text: chart.title || "Chart",
                },
              },
            };

            switch (chart.type) {
              case "bar":
                return `<Bar options={options} data={chartData${index}} />`;
              case "line":
                return `<Line options={options} data={chartData${index}} />`;
              case "donut":
                return `<Doughnut options={options} data={chartData${index}} />`;
              default:
                return `<Bar options={options} data={chartData${index}} />`;
            }
          })
          .join("\n        ")}
      </main>
    </div>
  );
};

export default Dashboard;`;
  };

  const generateVueCode = () => {
    return `<!-- Dashboard.vue -->
<template>
  <div :class="['dashboard', { dark: isDarkMode }]">
    <header class="dashboard-header">
      <h1>${projectName}</h1>
      <button @click="toggleDarkMode" class="theme-toggle">
        {{ isDarkMode ? '☀️' : '🌙' }} Toggle Theme
      </button>
    </header>
    
    <main class="dashboard-grid">
      ${charts
        .map((chart, index) => {
          const componentName = `${
            chart.title?.replace(/\s+/g, "") || `Chart${index + 1}`
          }`;
          return `<${componentName} :data="${componentName.toLowerCase()}Data" />`;
        })
        .join("\n      ")}
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Dashboard',
  setup() {
    const isDarkMode = ref(${includeDarkMode});
    
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
    };

    return {
      isDarkMode,
      toggleDarkMode
    };
  }
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dashboard.dark {
  background-color: #1a1a1a;
  color: #e5e5e5;
}

.dashboard.light {
  background-color: #ffffff;
  color: #333333;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;
}

.dashboard.dark .dashboard-header {
  border-bottom-color: #374151;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.theme-toggle {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: #2563eb;
}
</style>`;
  };

  const generateAngularCode = () => {
    return `// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isDarkMode = ${includeDarkMode};
  
  ngOnInit() {
    this.initializeCharts();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  private initializeCharts() {
    ${charts
      .map((chart, index) => {
        const data =
          chart.data?.length > 0
            ? chart.data
            : [
                { name: "Jan", value: 400 },
                { name: "Feb", value: 300 },
                { name: "Mar", value: 200 },
              ];

        return `// ${chart.title || `Chart ${index + 1}`}
    const chart${index + 1}Data = {
      labels: ${JSON.stringify(data.map((d: any) => d.name))},
      datasets: [{
        label: '${chart.title || "Data"}',
        data: ${JSON.stringify(data.map((d: any) => d.value))},
        backgroundColor: '#8884d8',
        borderColor: '#8884d8',
      }]
    };`;
      })
      .join("\n    ")}
  }
}

<!-- dashboard.component.html -->
<div [class]="'dashboard ' + (isDarkMode ? 'dark' : 'light')">
  <header class="dashboard-header">
    <h1>${projectName}</h1>
    <button (click)="toggleDarkMode()" class="theme-toggle">
      {{ isDarkMode ? '☀️' : '🌙' }} Toggle Theme
    </button>
  </header>
  
  <main class="dashboard-grid">
    ${charts
      .map((chart, index) => {
        return `<div class="chart-container">
      <h3>${chart.title || `Chart ${index + 1}`}</h3>
      <canvas id="chart${index + 1}"></canvas>
    </div>`;
      })
      .join("\n    ")}
  </main>
</div>

/* dashboard.component.css */
.dashboard {
  min-height: 100vh;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dashboard.dark {
  background-color: #1a1a1a;
  color: #e5e5e5;
}

.dashboard.light {
  background-color: #ffffff;
  color: #333333;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;
}

.dashboard.dark .dashboard-header {
  border-bottom-color: #374151;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.dashboard.dark .chart-container {
  background: #374151;
  border-color: #4b5563;
}

.theme-toggle {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: #2563eb;
}`;
  };

  const generatePythonCode = () => {
    return `# dashboard.py
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import dash
from dash import dcc, html, Input, Output
import pandas as pd

# Initialize Dash app
app = dash.Dash(__name__)

# Sample data
${charts
  .map((chart, index) => {
    const data =
      chart.data?.length > 0
        ? chart.data
        : [
            { name: "Jan", value: 400 },
            { name: "Feb", value: 300 },
            { name: "Mar", value: 200 },
          ];

    return `chart${index + 1}_data = pd.DataFrame(${JSON.stringify(
      data,
      null,
      2
    )})`;
  })
  .join("\n")}

# Create charts
${charts
  .map((chart, index) => {
    const dataName = `chart${index + 1}_data`;

    switch (chart.type) {
      case "bar":
        return `fig${
          index + 1
        } = px.bar(${dataName}, x='name', y='value', title='${
          chart.title || `Chart ${index + 1}`
        }')`;
      case "line":
        return `fig${
          index + 1
        } = px.line(${dataName}, x='name', y='value', title='${
          chart.title || `Chart ${index + 1}`
        }')`;
      case "area":
        return `fig${
          index + 1
        } = px.area(${dataName}, x='name', y='value', title='${
          chart.title || `Chart ${index + 1}`
        }')`;
      case "donut":
        return `fig${
          index + 1
        } = px.pie(${dataName}, values='value', names='name', title='${
          chart.title || `Chart ${index + 1}`
        }', hole=0.4)`;
      default:
        return `fig${
          index + 1
        } = px.bar(${dataName}, x='name', y='value', title='${
          chart.title || `Chart ${index + 1}`
        }')`;
    }
  })
  .join("\n")}

# Dashboard layout
app.layout = html.Div([
    html.H1('${projectName}', style={'textAlign': 'center', 'marginBottom': '2rem'}),
    
    html.Div([
        ${charts
          .map((chart, index) => {
            return `html.Div([
            dcc.Graph(figure=fig${index + 1})
        ], style={'width': '48%', 'display': 'inline-block', 'margin': '1%'})`;
          })
          .join(",\n        ")}
    ], style={'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'space-around'})
])

if __name__ == '__main__':
    app.run_server(debug=True, host='0.0.0.0', port=8050)

# Requirements: pip install dash plotly pandas
# Run: python dashboard.py
# Access: http://localhost:8050`;
  };

  // AI Suggestions Generator
  const generateAISuggestions = () => {
    const suggestions = [];

    if (charts.length === 0) {
      suggestions.push("Add some charts to get started with your dashboard!");
    } else {
      if (charts.length > 3) {
        suggestions.push(
          "Consider adding responsive breakpoints for better mobile experience"
        );
      }
      if (charts.some((chart) => !chart.data || chart.data.length === 0)) {
        suggestions.push("Connect real data sources to replace sample data");
      }
      if (selectedFramework === "react-recharts") {
        suggestions.push(
          "Add state management (Redux/Zustand) for complex data handling"
        );
      }
      if (includeDarkMode) {
        suggestions.push("Consider adding theme persistence with localStorage");
      }
      suggestions.push("Add loading states and error handling for better UX");
      suggestions.push(
        "Implement data refresh functionality with real-time updates"
      );
    }

    return suggestions;
  };

  // File Export Functions
  const exportAsFile = () => {
    const code = generateDashboardCode();
    const extension = selectedFramework === "python" ? "py" : "js";
    const filename = `${projectName.replace(
      /\s+/g,
      "_"
    )}_dashboard.${extension}`;

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ZIP Export Function
  const exportAsZip = () => {
    setShowDownloadDialog(true);
  };

  // Handle ZIP Download
  const handleZipDownload = async () => {
    setShowDownloadDialog(false);

    try {
      console.log("Starting ZIP download...");
      console.log("Current generatedZipBlob:", generatedZipBlob);

      let zipBlob = generatedZipBlob;

      // Generate ZIP if not already generated
      if (!zipBlob) {
        console.log("ZIP not generated yet, generating now...");
        zipBlob = await generateZipFile();
        console.log("ZIP generated successfully:", zipBlob);
      }

      if (!zipBlob) {
        throw new Error("Failed to generate ZIP file");
      }

      // Download ZIP file
      console.log("Creating download link...");
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log("Download completed successfully");
    } catch (error) {
      console.error("Error downloading ZIP:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Error creating project files: ${errorMessage}. Please try again.`);
    }
  };

  const exportCurrentData = () => {
    if (
      !selectedChart ||
      !Array.isArray(selectedChart.data) ||
      selectedChart.data.length === 0
    ) {
      alert("No data to export");
      return;
    }

    let csvContent = "name,value\n";

    // Handle different chart data formats
    if (selectedChart.type === "combo") {
      selectedChart.data.forEach((item: any) => {
        csvContent += `"${item.name}",${item.barValue}\n`;
      });
    } else if (selectedChart.type === "multibar") {
      csvContent = "name,series1,series2,series3\n";
      selectedChart.data.forEach((item: any) => {
        csvContent += `"${item.name}",${item.series1},${item.series2},${item.series3}\n`;
      });
    } else {
      // Standard format for bar, donut, line, area charts
      selectedChart.data.forEach((item: any) => {
        csvContent += `"${item.name}",${item.value}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      selectedChart?.title?.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "chart"
    }_data.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Dynamic tabs based on component type
  const isWireframeComponent = selectedChart
    ? [
        "button",
        "iconbutton",
        "input",
        "text",
        "image",
        "card",
        "navigation",
        "dropdown",
        "checkbox",
        "radio",
        "progress",
        "alert",
        "avatar",
        "badge",
        "switch",
        "slider",
        "textarea",
        "separator",
      ].includes(selectedChart.type)
    : false;

  const tabs = isWireframeComponent
    ? [
        { id: "data", label: "Properties", icon: Settings },
        { id: "comments", label: "Comments", icon: MessageSquare },
      ]
    : [
        { id: "size", label: "Size", icon: Maximize2 },
        { id: "colors", label: "Colors", icon: Palette },
        { id: "typography", label: "Text", icon: Type },
        { id: "data", label: "Data", icon: Database },
        { id: "comments", label: "Comments", icon: MessageSquare },
      ];

  return (
    <div
      className={`w-80 h-screen ${bgClass} border-l ${borderClass} flex flex-col`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${borderClass} flex-shrink-0`}>
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {selectedChart ? (
          <div className="flex items-center gap-3 mb-4">
            {selectedChart.type === "bar" ? (
              <BarChart3 className="w-8 h-8 text-blue-500" />
            ) : selectedChart.type === "donut" ? (
              <PieChart className="w-8 h-8 text-purple-500" />
            ) : selectedChart.type === "line" ? (
              <BarChart3 className="w-8 h-8 text-green-500" />
            ) : selectedChart.type === "area" ? (
              <BarChart3 className="w-8 h-8 text-orange-500" />
            ) : selectedChart.type === "combo" ? (
              <BarChart3 className="w-8 h-8 text-indigo-500" />
            ) : selectedChart.type === "multibar" ? (
              <BarChart3 className="w-8 h-8 text-teal-500" />
            ) : selectedChart.type === "table" ? (
              <FileText className="w-8 h-8 text-gray-500" />
            ) : selectedChart.type === "button" ? (
              <Square className="w-8 h-8 text-blue-500" />
            ) : selectedChart.type === "input" ? (
              <Type className="w-8 h-8 text-green-500" />
            ) : selectedChart.type === "text" ? (
              <AlignLeft className="w-8 h-8 text-purple-500" />
            ) : selectedChart.type === "image" ? (
              <Image className="w-8 h-8 text-orange-500" />
            ) : selectedChart.type === "card" ? (
              <FileText className="w-8 h-8 text-indigo-500" />
            ) : selectedChart.type === "navigation" ? (
              <Menu className="w-8 h-8 text-teal-500" />
            ) : selectedChart.type === "dropdown" ? (
              <ChevronDown className="w-8 h-8 text-pink-500" />
            ) : selectedChart.type === "checkbox" ? (
              <Check className="w-8 h-8 text-green-600" />
            ) : selectedChart.type === "radio" ? (
              <Circle className="w-8 h-8 text-emerald-600" />
            ) : selectedChart.type === "progress" ? (
              <BarChart3 className="w-8 h-8 text-blue-600" />
            ) : selectedChart.type === "alert" ? (
              <AlertTriangle className="w-8 h-8 text-red-500" />
            ) : selectedChart.type === "avatar" ? (
              <UserCircle className="w-8 h-8 text-blue-500" />
            ) : selectedChart.type === "badge" ? (
              <Tag className="w-8 h-8 text-green-500" />
            ) : selectedChart.type === "switch" ? (
              <ToggleLeft className="w-8 h-8 text-purple-500" />
            ) : selectedChart.type === "slider" ? (
              <Sliders className="w-8 h-8 text-indigo-500" />
            ) : selectedChart.type === "textarea" ? (
              <FileText className="w-8 h-8 text-gray-500" />
            ) : selectedChart.type === "separator" ? (
              <DividerIcon className="w-8 h-8 text-gray-400" />
            ) : (
              <MousePointer className="w-8 h-8 text-gray-500" />
            )}
            <div>
              <h3 className={`font-semibold ${textClass}`}>
                {selectedChart.title}
              </h3>
              <p className={`text-sm ${textSecondaryClass} capitalize`}>
                {isWireframeComponent
                  ? `${selectedChart.type} Component`
                  : `${selectedChart.type} Chart`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className={`font-semibold ${textClass}`}>Code Export</h3>
              <p className={`text-sm ${textSecondaryClass}`}>
                Generate code for all components
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        {selectedChart && (
          <div
            className={`grid ${
              isWireframeComponent ? "grid-cols-2" : "grid-cols-5"
            } gap-1 p-1 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? "bg-gray-700 text-blue-400"
                        : "bg-white text-blue-600 shadow-sm"
                      : isDarkMode
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div
          className={`${
            activeTab === "comments" ? "h-full overflow-hidden" : "h-full p-4"
          }`}
        >
          {!selectedChart ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Code className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className={`text-lg font-semibold ${textClass} mb-2`}>
                No Component Selected
              </h3>
              <p className={`text-sm ${textSecondaryClass} mb-6`}>
                Click on a component in the canvas to customize it, or use the
                Code button to export all components.
              </p>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode
                    ? "bg-blue-900/20 border border-blue-700/50"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  <strong>💡 Tip:</strong> The Code button in the toolbar will
                  generate code for all components on the canvas.
                </p>
              </div>
            </div>
          ) : (
            activeTab === "size" && (
              <div className="space-y-6">
                {/* Quick Size Presets */}
                <div>
                  <label
                    className={`block text-sm font-medium ${textClass} mb-3`}
                  >
                    Quick Sizes
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CHART_SIZES.map((size) => (
                      <button
                        key={size.label}
                        onClick={() =>
                          onUpdateChart(selectedChart.id, {
                            width: size.width,
                            height: size.height,
                          })
                        }
                        className={`p-2 text-xs border rounded-lg transition-colors ${
                          selectedChart.width === size.width &&
                          selectedChart.height === size.height
                            ? isDarkMode
                              ? "border-blue-500 bg-blue-900/20 text-blue-400"
                              : "border-blue-500 bg-blue-50 text-blue-700"
                            : isDarkMode
                            ? "border-gray-600 text-gray-300 hover:border-gray-500"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        <div className="font-medium">{size.label}</div>
                        <div className={textSecondaryClass}>
                          {size.width}×{size.height}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Size Controls */}
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${textClass} mb-2`}
                    >
                      Width: {selectedChart.width}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="800"
                      value={selectedChart.width}
                      onChange={(e) =>
                        onUpdateChart(selectedChart.id, {
                          width: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${textClass} mb-2`}
                    >
                      Height: {selectedChart.height}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="600"
                      value={selectedChart.height}
                      onChange={(e) =>
                        onUpdateChart(selectedChart.id, {
                          height: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )
          )}

          {activeTab === "colors" && (
            <div className="space-y-6">
              {/* Color Presets */}
              <div>
                <label
                  className={`block text-sm font-medium ${textClass} mb-3`}
                >
                  Color Presets
                </label>
                <div className="space-y-2">
                  {COLOR_PRESETS.map((preset, presetIndex) => (
                    <button
                      key={presetIndex}
                      onClick={() => applyColorPreset(preset)}
                      className={`w-full p-2 border rounded-lg transition-colors ${
                        isDarkMode
                          ? "border-gray-600 hover:border-gray-500"
                          : "border-gray-300 hover:border-gray-400"
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
                  <label
                    className={`block text-sm font-medium ${textClass} mb-3`}
                  >
                    Individual Colors
                  </label>
                  <div className="space-y-3">
                    {selectedChart.data.map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${
                          isDarkMode ? "border-gray-600" : "border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-medium ${textClass}`}>
                            {item.name}
                          </span>
                          {selectedChart.data.length > 1 && (
                            <button
                              onClick={() => removeDataPoint(index)}
                              className={`p-1 rounded transition-colors ${
                                isDarkMode
                                  ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                  : "text-red-500 hover:text-red-700 hover:bg-red-50"
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
                            onChange={(e) =>
                              updateChartData(index, "color", e.target.value)
                            }
                            className="w-8 h-8 rounded border-0"
                          />
                          <span className={`text-xs ${textSecondaryClass}`}>
                            {item.color}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={addDataPoint}
                    className={`text-sm px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                      isDarkMode
                        ? "bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-6">
              {/* Title Controls */}
              <div>
                <label
                  className={`block text-sm font-medium ${textClass} mb-3`}
                >
                  Chart Title
                </label>
                <input
                  type="text"
                  value={selectedChart.title}
                  onChange={(e) =>
                    onUpdateChart(selectedChart.id, { title: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                  placeholder="Chart title"
                />
              </div>

              {/* Title Color */}
              <div>
                <label
                  className={`block text-sm font-medium ${textClass} mb-3`}
                >
                  Title Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedChart.titleColor}
                    onChange={(e) =>
                      onUpdateChart(selectedChart.id, {
                        titleColor: e.target.value,
                      })
                    }
                    className="w-12 h-10 rounded border-0"
                  />
                  <span className={`text-sm ${textSecondaryClass}`}>
                    {selectedChart.titleColor}
                  </span>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label
                  className={`block text-sm font-medium ${textClass} mb-3`}
                >
                  Font Size: {selectedChart.titleSize}px
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        onUpdateChart(selectedChart.id, { titleSize: size })
                      }
                      className={`px-2 py-1 text-xs border rounded transition-colors ${
                        selectedChart.titleSize === size
                          ? isDarkMode
                            ? "border-blue-500 bg-blue-900/20 text-blue-400"
                            : "border-blue-500 bg-blue-50 text-blue-700"
                          : isDarkMode
                          ? "border-gray-600 text-gray-300 hover:border-gray-500"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Weight */}
              <div>
                <label
                  className={`block text-sm font-medium ${textClass} mb-3`}
                >
                  Font Weight
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["light", "medium", "bold"].map((weight) => (
                    <button
                      key={weight}
                      onClick={() =>
                        onUpdateChart(selectedChart.id, { titleWeight: weight })
                      }
                      className={`px-2 py-1 text-xs border rounded transition-colors capitalize ${
                        selectedChart.titleWeight === weight
                          ? isDarkMode
                            ? "border-blue-500 bg-blue-900/20 text-blue-400"
                            : "border-blue-500 bg-blue-50 text-blue-700"
                          : isDarkMode
                          ? "border-gray-600 text-gray-300 hover:border-gray-500"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="flex flex-col">
              {/* File Upload Toggle and Section */}
              {![
                "button",
                "iconbutton",
                "input",
                "text",
                "image",
                "card",
                "navigation",
                "dropdown",
                "checkbox",
                "radio",
                "progress",
                "alert",
                "avatar",
                "badge",
                "switch",
                "slider",
                "textarea",
                "separator",
              ].includes(selectedChart.type) && (
                <div className={`border-b ${borderClass}`}>
                  {/* Toggle Button */}
                  <div
                    className={`p-4 ${
                      isDarkMode ? "bg-gray-800/30" : "bg-gray-50/30"
                    }`}
                  >
                    <button
                      onClick={() => setShowFileUpload(!showFileUpload)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300"
                          : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5" />
                        <div className="text-left">
                          <h4 className="font-medium">Upload CSV File</h4>
                          <p className={`text-sm ${textSecondaryClass}`}>
                            Import data from CSV file with name and value
                            columns
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          showFileUpload ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Collapsible File Upload Section */}
                  {showFileUpload && (
                    <div
                      className={`p-4 ${
                        isDarkMode ? "bg-gray-800/50" : "bg-gray-50/50"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* File Upload Card - Compact */}
                        <div className="max-w-sm mx-auto">
                          <div
                            className={`p-4 border-2 border-dashed rounded-lg transition-all hover:border-blue-400 ${
                              isDarkMode
                                ? "border-gray-600 bg-gray-800"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            <div className="text-center space-y-3">
                              <div
                                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center ${
                                  isDarkMode
                                    ? "bg-blue-900/30 text-blue-400"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                <Upload className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className={`font-medium ${textClass} mb-1`}>
                                  Upload CSV File
                                </h5>
                                <p
                                  className={`text-xs ${textSecondaryClass} mb-3`}
                                >
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
                                <div
                                  className={`w-full px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all font-medium text-sm ${
                                    isDarkMode
                                      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                                      : "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                                  }`}
                                >
                                  Choose CSV File
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Format Info - Compact */}
                        <div
                          className={`p-3 rounded-lg border-l-4 ${
                            isDarkMode
                              ? "bg-blue-900/10 border-blue-500 text-blue-300"
                              : "bg-blue-50 border-blue-400 text-blue-800"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <h6 className="font-medium text-sm">
                                Required Format
                              </h6>
                              <p className="text-xs opacity-90">
                                <strong>Columns:</strong> "name" and "value" |{" "}
                                <strong>Example:</strong> Product A, 150
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* API Connection Toggle and Section (hidden for icons) */}
              {![
                "button",
                "input",
                "text",
                "image",
                "card",
                "navigation",
                "dropdown",
                "checkbox",
                "radio",
                "progress",
                "alert",
                "avatar",
                "badge",
                "switch",
                "slider",
                "textarea",
                "separator",
                "iconbutton",
              ].includes(selectedChart.type) && (
                <div className={`border-b ${borderClass}`}>
                  {/* Toggle Button */}
                  <div
                    className={`p-4 ${
                      isDarkMode ? "bg-gray-800/30" : "bg-gray-50/30"
                    }`}
                  >
                    <button
                      onClick={() => setShowApiConnection(!showApiConnection)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300"
                          : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5" />
                        <div className="text-left">
                          <h4 className="font-medium">Connect API</h4>
                          <p className={`text-sm ${textSecondaryClass}`}>
                            Fetch data from REST API endpoints
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          showApiConnection ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Collapsible API Connection Section */}
                  {showApiConnection && (
                    <div
                      className={`p-4 ${
                        isDarkMode ? "bg-gray-800/50" : "bg-gray-50/50"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* API URL Input */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${textClass} mb-2`}
                          >
                            API URL
                          </label>
                          <input
                            type="url"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                            placeholder="https://api.example.com/data"
                          />
                        </div>

                        {/* HTTP Method Dropdown */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${textClass} mb-2`}
                          >
                            HTTP Method
                          </label>
                          <select
                            value={httpMethod}
                            onChange={(e) =>
                              setHttpMethod(
                                e.target.value as
                                  | "GET"
                                  | "POST"
                                  | "PUT"
                                  | "PATCH"
                                  | "DELETE"
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>

                        {/* Authorization */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${textClass} mb-2`}
                          >
                            Authorization (Optional)
                          </label>
                          <input
                            type="text"
                            value={apiAuth}
                            onChange={(e) => setApiAuth(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                            placeholder="Bearer your-token-here or Basic username:password"
                          />
                          <p className={`text-xs ${textSecondaryClass} mt-1`}>
                            Enter your authorization token (e.g., Bearer token,
                            Basic auth, API key)
                          </p>
                        </div>

                        {/* JSON Payload (for POST/PUT/PATCH) */}
                        {["POST", "PUT", "PATCH"].includes(httpMethod) && (
                          <div>
                            <label
                              className={`block text-sm font-medium ${textClass} mb-2`}
                            >
                              JSON Payload
                            </label>
                            <textarea
                              value={apiPayload}
                              onChange={(e) => setApiPayload(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                              placeholder='{"key": "value", "name": "example", "value": 123}'
                              rows={6}
                            />
                            <p className={`text-xs ${textSecondaryClass} mt-1`}>
                              Enter JSON data to send with your {httpMethod}{" "}
                              request
                            </p>
                          </div>
                        )}

                        {/* Test/Fetch Button */}
                        <div className="space-y-2">
                          {apiAuth.trim() && (
                            <div
                              className={`p-2 rounded-lg border-l-4 ${
                                isDarkMode
                                  ? "bg-green-900/10 border-green-500 text-green-300"
                                  : "bg-green-50 border-green-400 text-green-800"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Check className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  Authorization will be included in request
                                </span>
                              </div>
                            </div>
                          )}
                          <button
                            onClick={handleApiFetch}
                            disabled={isLoadingApi || !apiUrl.trim()}
                            className={`w-full px-4 py-3 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                              isLoadingApi || !apiUrl.trim()
                                ? isDarkMode
                                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : isDarkMode
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            {isLoadingApi ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>✨ Fetching...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                                <span>Test / Fetch</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Error Message */}
                        {apiError && (
                          <div
                            className={`p-3 rounded-lg border-l-4 ${
                              isDarkMode
                                ? "bg-red-900/10 border-red-500 text-red-300"
                                : "bg-red-50 border-red-400 text-red-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <h6 className="font-medium text-sm">Error</h6>
                                <p className="text-xs opacity-90">{apiError}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Response Preview */}
                        {apiResponse && showResponsePreview && (
                          <div
                            className={`p-3 rounded-lg border-l-4 ${
                              isDarkMode
                                ? "bg-green-900/10 border-green-500 text-green-300"
                                : "bg-green-50 border-green-400 text-green-800"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                  <h6 className="font-medium text-sm">
                                    Response Preview
                                  </h6>
                                  <p className="text-xs opacity-90">
                                    Data fetched successfully!
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  setShowResponsePreview(!showResponsePreview)
                                }
                                className={`p-1 rounded transition-colors ${
                                  isDarkMode
                                    ? "text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    : "text-green-600 hover:text-green-800 hover:bg-green-100"
                                }`}
                              >
                                {showResponsePreview ? (
                                  <EyeOff className="w-3 h-3" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            {showResponsePreview && (
                              <div
                                className={`mt-3 p-2 rounded text-xs font-mono overflow-auto max-h-32 ${
                                  isDarkMode ? "bg-gray-800" : "bg-white"
                                }`}
                              >
                                <pre>
                                  {JSON.stringify(apiResponse, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}

                        {/* API Info */}
                        <div
                          className={`p-3 rounded-lg border-l-4 ${
                            isDarkMode
                              ? "bg-blue-900/10 border-blue-500 text-blue-300"
                              : "bg-blue-50 border-blue-400 text-blue-800"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <h6 className="font-medium text-sm">
                                API Integration
                              </h6>
                              <p className="text-xs opacity-90">
                                <strong>Methods:</strong> GET, POST, PUT, PATCH,
                                DELETE | <strong>Auth:</strong> Bearer, Basic,
                                API Key | <strong>Payload:</strong> JSON for
                                POST/PUT/PATCH | <strong>Auto-mapping:</strong>{" "}
                                name, label, title → name | value, count, amount
                                → value
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Database Connection Toggle and Section (hidden for icons) */}
              {![
                "button",
                "input",
                "text",
                "image",
                "card",
                "navigation",
                "dropdown",
                "checkbox",
                "radio",
                "progress",
                "alert",
                "avatar",
                "badge",
                "switch",
                "slider",
                "textarea",
                "separator",
                "iconbutton",
              ].includes(selectedChart.type) && (
                <div className={`border-b ${borderClass}`}>
                  {/* Toggle Button */}
                  <div
                    className={`p-4 ${
                      isDarkMode ? "bg-gray-800/30" : "bg-gray-50/30"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setShowDatabaseConnection(!showDatabaseConnection)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                        isDarkMode
                          ? "bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300"
                          : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5" />
                        <div className="text-left">
                          <h4 className="font-medium">Database Connection</h4>
                          <p className={`text-sm ${textSecondaryClass}`}>
                            Connect to your database for real-time data
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          showDatabaseConnection ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Collapsible Database Connection Section */}
                  {showDatabaseConnection && (
                    <div
                      className={`p-4 ${
                        isDarkMode ? "bg-gray-800/50" : "bg-gray-50/50"
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Database Type Dropdown */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${textClass} mb-2`}
                          >
                            Database Type
                          </label>
                          <select
                            value={dbType}
                            onChange={(e) =>
                              handleDbTypeChange(
                                e.target.value as
                                  | "MySQL"
                                  | "PostgreSQL"
                                  | "MongoDB"
                                  | "SQL Server"
                                  | "Oracle"
                              )
                            }
                            className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                          >
                            <option value="MySQL">MySQL</option>
                            <option value="PostgreSQL">PostgreSQL</option>
                            <option value="MongoDB">MongoDB</option>
                            <option value="SQL Server">SQL Server</option>
                            <option value="Oracle">Oracle</option>
                          </select>
                        </div>

                        {/* Host and Port Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              className={`block text-sm font-medium ${textClass} mb-2`}
                            >
                              Host
                            </label>
                            <input
                              type="text"
                              value={dbHost}
                              onChange={(e) => setDbHost(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                              placeholder="localhost"
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium ${textClass} mb-2`}
                            >
                              Port
                            </label>
                            <input
                              type="number"
                              value={dbPort}
                              onChange={(e) => setDbPort(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                              placeholder="3306"
                            />
                          </div>
                        </div>

                        {/* Database Name */}
                        <div>
                          <label
                            className={`block text-sm font-medium ${textClass} mb-2`}
                          >
                            Database Name
                          </label>
                          <input
                            type="text"
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                            placeholder="my_database"
                          />
                        </div>

                        {/* Username and Password Row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              className={`block text-sm font-medium ${textClass} mb-2`}
                            >
                              Username
                            </label>
                            <input
                              type="text"
                              value={dbUsername}
                              onChange={(e) => setDbUsername(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                              placeholder="username"
                            />
                          </div>
                          <div>
                            <label
                              className={`block text-sm font-medium ${textClass} mb-2`}
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              value={dbPassword}
                              onChange={(e) => setDbPassword(e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg transition-colors ${inputClass}`}
                              placeholder="••••••••"
                            />
                          </div>
                        </div>

                        {/* SSL Mode Toggle */}
                        <div className="flex items-center justify-between">
                          <div>
                            <label
                              className={`block text-sm font-medium ${textClass}`}
                            >
                              SSL Mode
                            </label>
                            <p className={`text-xs ${textSecondaryClass}`}>
                              Enable SSL encryption for secure connection
                            </p>
                          </div>
                          <button
                            onClick={() => setDbSslMode(!dbSslMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              dbSslMode
                                ? isDarkMode
                                  ? "bg-blue-600"
                                  : "bg-blue-500"
                                : isDarkMode
                                ? "bg-gray-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                dbSslMode ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* Test Connection Button */}
                        <div className="space-y-2">
                          <button
                            onClick={handleTestConnection}
                            disabled={
                              isTestingConnection ||
                              !dbHost.trim() ||
                              !dbPort.trim() ||
                              !dbName.trim() ||
                              !dbUsername.trim()
                            }
                            className={`w-full px-4 py-3 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                              isTestingConnection ||
                              !dbHost.trim() ||
                              !dbPort.trim() ||
                              !dbName.trim() ||
                              !dbUsername.trim()
                                ? isDarkMode
                                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : isDarkMode
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {isTestingConnection ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Testing Connection...</span>
                              </>
                            ) : (
                              <>
                                <Database className="w-4 h-4" />
                                <span>Test Connection</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Connection Status Messages */}
                        {dbConnectionStatus === "success" && (
                          <div
                            className={`p-3 rounded-lg border-l-4 ${
                              isDarkMode
                                ? "bg-green-900/10 border-green-500 text-green-300"
                                : "bg-green-50 border-green-400 text-green-800"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4" />
                              <div>
                                <h6 className="font-medium text-sm">
                                  Connection Successful
                                </h6>
                                <p className="text-xs opacity-90">
                                  {dbConnectionMessage}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {dbConnectionStatus === "error" && (
                          <div
                            className={`p-3 rounded-lg border-l-4 ${
                              isDarkMode
                                ? "bg-red-900/10 border-red-500 text-red-300"
                                : "bg-red-50 border-red-400 text-red-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <h6 className="font-medium text-sm">
                                  Connection Failed
                                </h6>
                                <p className="text-xs opacity-90">
                                  {dbConnectionMessage}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Database Info */}
                        <div
                          className={`p-3 rounded-lg border-l-4 ${
                            isDarkMode
                              ? "bg-blue-900/10 border-blue-500 text-blue-300"
                              : "bg-blue-50 border-blue-400 text-blue-800"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <Database className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <h6 className="font-medium text-sm">
                                Database Integration
                              </h6>
                              <p className="text-xs opacity-90">
                                <strong>Supported:</strong> MySQL, PostgreSQL,
                                MongoDB, SQL Server, Oracle |{" "}
                                <strong>Features:</strong> Real-time data sync,
                                SSL encryption, Connection pooling |{" "}
                                <strong>Auto-mapping:</strong> Column names →
                                chart data properties
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
              {[
                "button",
                "iconbutton",
                "input",
                "text",
                "image",
                "card",
                "navigation",
                "dropdown",
                "checkbox",
                "radio",
                "progress",
                "alert",
                "avatar",
                "badge",
                "switch",
                "slider",
                "textarea",
                "separator",
              ].includes(selectedChart.type) ? (
                <div className="p-4 space-y-4">
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
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-3 p-4 pb-0 flex-shrink-0">
                    <label className={`block text-sm font-medium ${textClass}`}>
                      Data Points
                    </label>
                    <button
                      onClick={addDataPoint}
                      className={`text-sm px-3 py-1 rounded transition-colors flex items-center gap-1 ${
                        isDarkMode
                          ? "bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Point
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="space-y-3">
                      {selectedChart.data.map((item: any, index: number) => (
                        <div
                          key={index}
                          className={`p-3 border rounded-lg ${
                            isDarkMode ? "border-gray-600" : "border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`text-sm font-medium ${textClass}`}
                            >
                              Point {index + 1}
                            </span>
                            {selectedChart.data.length > 1 && (
                              <button
                                onClick={() => removeDataPoint(index)}
                                className={`p-1 rounded transition-colors ${
                                  isDarkMode
                                    ? "text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    : "text-red-500 hover:text-red-700 hover:bg-red-50"
                                }`}
                                title="Remove data point"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label
                                className={`block text-xs ${textSecondaryClass} mb-1`}
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) =>
                                  updateChartData(index, "name", e.target.value)
                                }
                                className={`w-full px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                              />
                            </div>

                            <div>
                              <label
                                className={`block text-xs ${textSecondaryClass} mb-1`}
                              >
                                Value
                              </label>
                              <input
                                type="number"
                                value={item.value}
                                onChange={(e) =>
                                  updateChartData(
                                    index,
                                    "value",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className={`w-full px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                              />
                            </div>

                            <div>
                              <label
                                className={`block text-xs ${textSecondaryClass} mb-1`}
                              >
                                Color
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={item.color}
                                  onChange={(e) =>
                                    updateChartData(
                                      index,
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className="w-8 h-8 rounded border-0"
                                />
                                <span
                                  className={`text-xs ${textSecondaryClass}`}
                                >
                                  {item.color}
                                </span>
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
                          value: Math.floor(Math.random() * 100) + 10,
                        }));
                        onUpdateChart(selectedChart.id, { data: newData });
                      }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Generate Random Data
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-6 text-center ${textSecondaryClass} h-full flex flex-col justify-center`}
                >
                  <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className={`text-lg font-medium mb-2 ${textClass}`}>
                    Unsupported Data Type
                  </h3>
                  <p>
                    This component has a data structure that cannot be edited in
                    the customizer.
                  </p>
                  <p className="mt-2 text-xs">
                    Expected: Array of chart data points
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="h-full flex flex-col">
              {/* Comments Header */}
              <div className="p-4 pb-0 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className={`w-5 h-5 ${textClass}`} />
                    <h3 className={`font-medium ${textClass}`}>
                      Comments & Reviews
                    </h3>
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedChart.comments?.length > 0
                        ? selectedChart.comments.some((c: any) => !c.resolved)
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {selectedChart.comments?.length || 0} comments
                  </div>
                </div>

                {/* Add New Comment */}
                <div className={`border rounded-lg p-3 mb-4 ${borderClass}`}>
                  <div className="space-y-3">
                    <div>
                      <label
                        className={`block text-xs ${textSecondaryClass} mb-1`}
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className={`w-full px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                        placeholder="Reviewer"
                      />
                    </div>
                    <div>
                      <label
                        className={`block text-xs ${textSecondaryClass} mb-1`}
                      >
                        Comment
                      </label>
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
                          onAddComment(
                            selectedChart.id,
                            newComment.trim(),
                            newAuthor.trim() || "Reviewer"
                          );
                          setNewComment("");
                        }
                      }}
                      disabled={!newComment.trim()}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        newComment.trim()
                          ? isDarkMode
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
                      <div
                        key={comment.id}
                        className={`border rounded-lg p-4 ${borderClass} ${
                          comment.resolved ? "opacity-75" : ""
                        }`}
                      >
                        {/* Comment Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                comment.author === "Reviewer"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {comment.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div
                                className={`font-medium text-sm ${textClass}`}
                              >
                                {comment.author}
                              </div>
                              <div
                                className={`text-xs ${textSecondaryClass} flex items-center gap-1`}
                              >
                                <Clock className="w-3 h-3" />
                                {new Date(comment.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {onResolveComment && (
                              <button
                                onClick={() =>
                                  onResolveComment(selectedChart.id, comment.id)
                                }
                                className={`p-1 rounded transition-colors ${
                                  comment.resolved
                                    ? "text-green-500 hover:text-green-600"
                                    : isDarkMode
                                    ? "text-gray-400 hover:text-green-400"
                                    : "text-gray-500 hover:text-green-500"
                                }`}
                                title={
                                  comment.resolved
                                    ? "Mark as unresolved"
                                    : "Mark as resolved"
                                }
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {onDeleteComment && (
                              <button
                                onClick={() =>
                                  onDeleteComment(selectedChart.id, comment.id)
                                }
                                className={`p-1 rounded transition-colors ${
                                  isDarkMode
                                    ? "text-gray-400 hover:text-red-400"
                                    : "text-gray-500 hover:text-red-500"
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
                              <div
                                key={reply.id}
                                className={`border-l-2 pl-3 py-2 ${
                                  reply.author === "Designer"
                                    ? "border-blue-300"
                                    : "border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      reply.author === "Designer"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {reply.author.charAt(0).toUpperCase()}
                                  </div>
                                  <span
                                    className={`text-xs font-medium ${textClass}`}
                                  >
                                    {reply.author}
                                  </span>
                                  <span
                                    className={`text-xs ${textSecondaryClass}`}
                                  >
                                    {new Date(reply.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <div className={`text-sm ${textClass}`}>
                                  {reply.content}
                                </div>
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
                                  value={replyAuthor[comment.id] || "Designer"}
                                  onChange={(e) =>
                                    setReplyAuthor({
                                      ...replyAuthor,
                                      [comment.id]: e.target.value,
                                    })
                                  }
                                  className={`flex-1 px-2 py-1 text-xs border rounded transition-colors ${inputClass}`}
                                  placeholder="Your name"
                                />
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={replyContent[comment.id] || ""}
                                  onChange={(e) =>
                                    setReplyContent({
                                      ...replyContent,
                                      [comment.id]: e.target.value,
                                    })
                                  }
                                  className={`flex-1 px-2 py-1 text-sm border rounded transition-colors ${inputClass}`}
                                  placeholder="Reply to this comment..."
                                  onKeyPress={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      replyContent[comment.id]?.trim()
                                    ) {
                                      onAddReply(
                                        selectedChart.id,
                                        comment.id,
                                        replyContent[comment.id].trim(),
                                        replyAuthor[comment.id] || "Designer"
                                      );
                                      setReplyContent({
                                        ...replyContent,
                                        [comment.id]: "",
                                      });
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => {
                                    if (replyContent[comment.id]?.trim()) {
                                      onAddReply(
                                        selectedChart.id,
                                        comment.id,
                                        replyContent[comment.id].trim(),
                                        replyAuthor[comment.id] || "Designer"
                                      );
                                      setReplyContent({
                                        ...replyContent,
                                        [comment.id]: "",
                                      });
                                    }
                                  }}
                                  disabled={!replyContent[comment.id]?.trim()}
                                  className={`px-3 py-1 rounded text-sm transition-colors ${
                                    replyContent[comment.id]?.trim()
                                      ? isDarkMode
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
                    <h3 className={`text-lg font-medium mb-2 ${textClass}`}>
                      No Comments Yet
                    </h3>
                    <p className="text-sm">
                      Add the first review comment for this chart.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code Generation Modal */}
      {(showCodeModal || parentShowCodeModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div
            className={`relative w-full max-w-3xl h-[70vh] rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDarkMode
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h2
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Export Dashboard Code
                    </h2>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Generate production-ready code for your dashboard
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCodeModal(false);
                    parentOnShowCodeModal?.(false);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto h-[calc(70vh-120px)] relative">
              {(isLoading || isModalOpening) && (
                <div className="absolute inset-0 bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div
                      className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                        isDarkMode ? "border-white" : "border-gray-900"
                      }`}
                    ></div>
                    <p
                      className={`mt-2 text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {isModalOpening
                        ? "Opening..."
                        : "Generating project files..."}
                    </p>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {/* Framework & Styling Selectors */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Framework Selector */}
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Framework
                    </label>
                    <select
                      value={selectedFramework}
                      onChange={(e) =>
                        setSelectedFramework(e.target.value as any)
                      }
                      className={`w-full p-2 text-sm rounded-md border transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      }`}
                    >
                      <option value="react-recharts">React</option>
                      <option value="vue">Vue</option>
                      <option value="angular">Angular</option>
                      <option value="python">Python (Django)</option>
                    </select>
                  </div>

                  {/* Styling Selector */}
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Styling
                    </label>
                    <select
                      value={selectedStyling}
                      onChange={(e) =>
                        setSelectedStyling(e.target.value as any)
                      }
                      className={`w-full p-2 text-sm rounded-md border transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      }`}
                    >
                      <option value="tailwind">Tailwind</option>
                      <option value="bootstrap">Bootstrap</option>
                      <option value="css">Plain CSS</option>
                    </select>
                  </div>
                </div>

                {/* Options Checkboxes */}
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={responsiveLayout}
                      onChange={(e) => setResponsiveLayout(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Responsive Layout
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={splitIntoComponents}
                      onChange={(e) => setSplitIntoComponents(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Split Components
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSampleData}
                      onChange={(e) => setIncludeSampleData(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Include Sample Data
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addComments}
                      onChange={(e) => setAddComments(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Add Comments
                    </span>
                  </label>
                </div>

                {/* Project Structure Preview */}
                <div
                  className={`rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700/50 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                        />
                      </svg>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Project Structure
                      </span>
                      {generatedZipBlob && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode
                              ? "bg-green-900/30 text-green-400"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          Ready
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-xs font-mono ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-blue-400">📁</span>
                          <span>dashboard.zip</span>
                        </div>
                        <div className="ml-4 space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-blue-400">📁</span>
                            <span>dashboard/</span>
                          </div>
                          <div className="ml-4 space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-blue-400">📁</span>
                              <span>public/</span>
                            </div>
                            <div className="ml-4 space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-green-400">📄</span>
                                <span>index.html</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-green-400">📄</span>
                                <span>manifest.json</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-blue-400">📁</span>
                              <span>src/</span>
                            </div>
                            <div className="ml-4 space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-blue-400">📁</span>
                                <span>components/</span>
                              </div>
                              <div className="ml-4 space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-green-400">📄</span>
                                  <span>Dashboard.tsx</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-green-400">📄</span>
                                  <span>Chart.tsx</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-green-400">📄</span>
                                  <span>Header.tsx</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-blue-400">📁</span>
                                <span>pages/</span>
                              </div>
                              <div className="ml-4 space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-green-400">📄</span>
                                  <span>Home.tsx</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-blue-400">📁</span>
                                <span>styles/</span>
                              </div>
                              <div className="ml-4 space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-green-400">📄</span>
                                  <span>globals.css</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-green-400">📄</span>
                                <span>App.tsx</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-green-400">📄</span>
                                <span>index.tsx</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-green-400">📄</span>
                              <span>package.json</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-green-400">📄</span>
                              <span>tsconfig.json</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-green-400">📄</span>
                              <span>README.md</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`p-3 border-t ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Auto-generated code
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportAsZip}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <DownloadIcon className="w-3 h-3" />
                    Export as ZIP
                  </button>

                  <button
                    onClick={() => {
                      setShowCodeModal(false);
                      parentOnShowCodeModal?.(false);
                    }}
                    className={`px-4 py-1.5 text-xs font-medium rounded transition-colors ${
                      isDarkMode
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Code Preview Modal */}
      {showFullscreenPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div
            className={`relative w-full h-full max-w-7xl max-h-[95vh] rounded-xl shadow-2xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Fullscreen Header */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span
                  className={`text-lg font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedFramework === "python"
                    ? "Dashboard.py"
                    : "Dashboard.js"}{" "}
                  - Full Preview
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(generateDashboardCode())}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-green-900/20 text-green-400 hover:bg-green-900/30"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </button>

                <button
                  onClick={exportAsFile}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download
                </button>

                <button
                  onClick={() => setShowFullscreenPreview(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Fullscreen Code Content */}
            <div
              className={`h-[calc(100%-80px)] overflow-auto ${
                isDarkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <pre
                className={`p-8 text-sm font-mono leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                <code>{generateDashboardCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Download Confirmation Dialog */}
      <AlertDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download React Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will download a complete React TypeScript project with your
              dashboard code. The project includes all necessary files and
              dependencies to run immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleZipDownload}>
              Download Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
