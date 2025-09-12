// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   BarChart3, PieChart, Save, FolderOpen, FileText, 
//   Download, Upload, Eye, EyeOff, Grid, Plus 
// } from 'lucide-react';
// import { ProfessionalBarChart, ProfessionalDonutChart, DEFAULT_COLORS } from './ProfessionalCharts';
// import ChartCustomizer from './ChartCustomizer';

// interface Chart {
//   id: string;
//   type: 'bar' | 'donut';
//   title: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   data: { name: string; value: number; color: string }[];
//   titleColor: string;
//   titleSize: number;
// }

// const CHART_TEMPLATES = [
//   {
//     type: 'bar' as const,
//     name: 'Bar Chart',
//     icon: BarChart3,
//     defaultData: [
//       { name: 'Q1', value: 85, color: DEFAULT_COLORS[0] },
//       { name: 'Q2', value: 92, color: DEFAULT_COLORS[1] },
//       { name: 'Q3', value: 78, color: DEFAULT_COLORS[2] },
//       { name: 'Q4', value: 96, color: DEFAULT_COLORS[3] }
//     ]
//   },
//   {
//     type: 'donut' as const,
//     name: 'Donut Chart', 
//     icon: PieChart,
//     defaultData: [
//       { name: 'Desktop', value: 45, color: DEFAULT_COLORS[0] },
//       { name: 'Mobile', value: 30, color: DEFAULT_COLORS[1] },
//       { name: 'Tablet', value: 15, color: DEFAULT_COLORS[2] },
//       { name: 'Other', value: 10, color: DEFAULT_COLORS[3] }
//     ]
//   }
// ];

// export default function ProfessionalWireframeBuilder() {
//   const [charts, setCharts] = useState<Chart[]>([]);
//   const [selectedChart, setSelectedChart] = useState<string | null>(null);
//   const [isPreviewMode, setIsPreviewMode] = useState(false);
//   const [projectName, setProjectName] = useState('My Wireframe');
//   const [isSaving, setIsSaving] = useState(false);
//   const [draggedChart, setDraggedChart] = useState<string | null>(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//   const canvasRef = useRef<HTMLDivElement>(null);

//   const addChart = (template: typeof CHART_TEMPLATES[0]) => {
//     const newChart: Chart = {
//       id: `${template.type}-${Date.now()}`,
//       type: template.type,
//       title: template.name,
//       x: Math.random() * 300 + 50,
//       y: Math.random() * 200 + 50,
//       width: template.type === 'bar' ? 400 : 350,
//       height: template.type === 'bar' ? 300 : 400,
//       data: [...template.defaultData],
//       titleColor: '#1F2937',
//       titleSize: 16
//     };
//     setCharts(prev => [...prev, newChart]);
//     setSelectedChart(newChart.id);
//   };

//   const updateChart = (id: string, updates: Partial<Chart>) => {
//     setCharts(prev => prev.map(chart => 
//       chart.id === id ? { ...chart, ...updates } : chart
//     ));
//   };

//   const deleteChart = (id: string) => {
//     setCharts(prev => prev.filter(chart => chart.id !== id));
//     if (selectedChart === id) {
//       setSelectedChart(null);
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent, chartId: string) => {
//     if (isPreviewMode) return;

//     const chart = charts.find(c => c.id === chartId);
//     if (!chart) return;

//     setSelectedChart(chartId);
//     setDraggedChart(chartId);

//     const rect = e.currentTarget.getBoundingClientRect();
//     setDragOffset({
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top
//     });
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!draggedChart || !canvasRef.current) return;

//     const canvasRect = canvasRef.current.getBoundingClientRect();
//     const x = e.clientX - canvasRect.left - dragOffset.x;
//     const y = e.clientY - canvasRect.top - dragOffset.y;

//     updateChart(draggedChart, {
//       x: Math.max(0, Math.min(x, canvasRect.width - 400)),
//       y: Math.max(0, Math.min(y, canvasRect.height - 300))
//     });
//   };

//   const handleMouseUp = () => {
//     setDraggedChart(null);
//   };

//   const saveWireframe = () => {
//     setIsSaving(true);
//     const wireframeData = {
//       version: '1.0',
//       timestamp: new Date().toISOString(),
//       projectName,
//       charts: charts.map(chart => ({ ...chart }))
//     };

//     localStorage.setItem('currentWireframe', JSON.stringify(wireframeData));
    
//     const savedWireframes = JSON.parse(localStorage.getItem('savedWireframes') || '[]');
//     const existingIndex = savedWireframes.findIndex((w: any) => w.projectName === projectName);
    
//     if (existingIndex >= 0) {
//       savedWireframes[existingIndex] = wireframeData;
//     } else {
//       savedWireframes.push(wireframeData);
//     }
    
//     localStorage.setItem('savedWireframes', JSON.stringify(savedWireframes));
    
//     setTimeout(() => setIsSaving(false), 1000);
//   };

//   const exportWireframe = () => {
//     const exportData = {
//       version: '1.0',
//       timestamp: new Date().toISOString(),
//       projectName,
//       charts
//     };
    
//     const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${projectName.replace(/\s+/g, '_')}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const loadWireframe = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = JSON.parse(e.target?.result as string);
//         if (data.charts) {
//           setCharts(data.charts);
//           setProjectName(data.projectName || 'Loaded Wireframe');
//           setSelectedChart(null);
//         }
//       } catch (error) {
//         alert('Invalid wireframe file');
//       }
//     };
//     reader.readAsText(file);
//   };

//   const newProject = () => {
//     if (charts.length > 0) {
//       const confirmed = window.confirm('Start new project? Current work will be lost.');
//       if (!confirmed) return;
//     }
//     setCharts([]);
//     setSelectedChart(null);
//     setProjectName('New Wireframe');
//   };

//   // Auto-save
//   useEffect(() => {
//     if (charts.length > 0) {
//       const autoSave = setTimeout(() => {
//         const wireframeData = {
//           version: '1.0',
//           timestamp: new Date().toISOString(),
//           projectName: projectName + ' (Auto-saved)',
//           charts
//         };
//         localStorage.setItem('currentWireframe', JSON.stringify(wireframeData));
//       }, 5000);

//       return () => clearTimeout(autoSave);
//     }
//   }, [charts, projectName]);

//   // Keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) {
//         switch (e.key) {
//           case 's':
//             e.preventDefault();
//             saveWireframe();
//             break;
//           case 'n':
//             e.preventDefault();
//             newProject();
//             break;
//           case 'Escape':
//             setSelectedChart(null);
//             break;
//         }
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   const selectedChartData = selectedChart ? charts.find(c => c.id === selectedChart) : null;

//   return (
//     <div className="h-screen bg-gray-50 flex">
//       {/* Sidebar - Chart Library */}
//       <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Chart Library</h2>
//           <p className="text-sm text-gray-600">Drag charts to the canvas to start building your wireframe</p>
//         </div>

//         {/* Chart Templates */}
//         <div className="flex-1 p-6">
//           <div className="space-y-4">
//             {CHART_TEMPLATES.map((template) => {
//               const IconComponent = template.icon;
//               return (
//                 <button
//                   key={template.type}
//                   onClick={() => addChart(template)}
//                   className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
//                       <IconComponent className="w-6 h-6 text-blue-600" />
//                     </div>
//                     <div className="text-left">
//                       <h3 className="font-medium text-gray-900">{template.name}</h3>
//                       <p className="text-sm text-gray-500">Click to add to canvas</p>
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-6 border-t border-gray-200">
//           <div className="text-sm text-gray-500 text-center">
//             {charts.length} chart{charts.length !== 1 ? 's' : ''} added
//           </div>
//         </div>
//       </div>

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <div className="bg-white border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <input
//                 type="text"
//                 value={projectName}
//                 onChange={(e) => setProjectName(e.target.value)}
//                 className="text-xl font-semibold bg-transparent border-none outline-none focus:bg-gray-50 px-2 py-1 rounded"
//               />
//               <div className="text-sm text-gray-500">
//                 {charts.length} chart{charts.length !== 1 ? 's' : ''}
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={newProject}
//                 className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
//               >
//                 <FileText className="w-4 h-4" />
//                 New
//               </button>

//               <button
//                 onClick={saveWireframe}
//                 disabled={isSaving}
//                 className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
//                   isSaving 
//                     ? 'bg-gray-100 text-gray-400' 
//                     : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
//                 }`}
//               >
//                 <Save className="w-4 h-4" />
//                 {isSaving ? 'Saving...' : 'Save'}
//               </button>

//               <button
//                 onClick={exportWireframe}
//                 className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
//               >
//                 <Download className="w-4 h-4" />
//                 Export
//               </button>

//               <label className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2 cursor-pointer">
//                 <Upload className="w-4 h-4" />
//                 Load
//                 <input
//                   type="file"
//                   accept=".json"
//                   onChange={loadWireframe}
//                   className="hidden"
//                 />
//               </label>

//               <button
//                 onClick={() => setIsPreviewMode(!isPreviewMode)}
//                 className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
//                   isPreviewMode 
//                     ? 'bg-blue-100 text-blue-700' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 {isPreviewMode ? 'Edit' : 'Preview'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Canvas */}
//         <div
//           ref={canvasRef}
//           className="flex-1 relative overflow-auto bg-gray-50"
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setSelectedChart(null);
//             }
//           }}
//         >
//           {/* Grid Background */}
//           <div 
//             className="absolute inset-0 opacity-30 pointer-events-none"
//             style={{
//               backgroundImage: `
//                 linear-gradient(to right, #e5e7eb 1px, transparent 1px),
//                 linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
//               `,
//               backgroundSize: '24px 24px'
//             }}
//           />

//           {/* Charts */}
//           {charts.map((chart) => (
//             <div
//               key={chart.id}
//               onMouseDown={(e) => handleMouseDown(e, chart.id)}
//               style={{ cursor: isPreviewMode ? 'default' : 'move' }}
//             >
//               {chart.type === 'bar' ? (
//                 <ProfessionalBarChart
//                   {...chart}
//                   isSelected={selectedChart === chart.id && !isPreviewMode}
//                   onSelect={setSelectedChart}
//                   onUpdate={updateChart}
//                   onDelete={deleteChart}
//                 />
//               ) : (
//                 <ProfessionalDonutChart
//                   {...chart}
//                   isSelected={selectedChart === chart.id && !isPreviewMode}
//                   onSelect={setSelectedChart}
//                   onUpdate={updateChart}
//                   onDelete={deleteChart}
//                 />
//               )}
//             </div>
//           ))}

//           {/* Empty State */}
//           {charts.length === 0 && (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-6xl mb-4">📊</div>
//                 <h2 className="text-2xl font-semibold text-gray-600 mb-2">
//                   Start Building Your Wireframe
//                 </h2>
//                 <p className="text-gray-500 mb-6 max-w-md">
//                   Add charts from the library to create your dashboard wireframe
//                 </p>
//                 <button
//                   onClick={() => addChart(CHART_TEMPLATES[0])}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
//                 >
//                   <Plus className="w-5 h-5" />
//                   Add Your First Chart
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
        
//         {/* Instructions */}
//         {!isPreviewMode && charts.length > 0 && (
//           <div className="bg-blue-50 border-t border-blue-200 p-3">
//             <div className="text-sm text-blue-700">
//               <strong>💡 Tips:</strong> Click charts to customize • Drag to reposition • Use Ctrl+S to save • Ctrl+N for new project
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Customization Panel */}
//       <ChartCustomizer
//         selectedChart={selectedChartData}
//         onUpdateChart={updateChart}
//       />
//     </div>
//   );
// }
