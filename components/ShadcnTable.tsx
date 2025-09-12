'use client';
import React, { useState } from 'react';
import { 
  Move, Type, Trash2, Plus, X, Edit3, 
  MoreVertical, ArrowUp, ArrowDown, Settings,
  Table as TableIcon, GripVertical
} from 'lucide-react';

interface TableCell {
  id: string;
  content: string;
  type: 'text' | 'number' | 'date' | 'email' | 'url';
}

interface TableColumn {
  id: string;
  name: string;
  width: number;
  type: 'text' | 'number' | 'date' | 'email' | 'url';
  sortable: boolean;
  align: 'left' | 'center' | 'right';
}

interface TableRow {
  id: string;
  cells: { [columnId: string]: TableCell };
}

interface TableData {
  columns: TableColumn[];
  rows: TableRow[];
  showHeader: boolean;
  showBorder: boolean;
  striped: boolean;
  compact: boolean;
  roundedCorners: boolean;
}

interface ShadcnTableProps {
  id: string;
  type: 'table';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  data: TableData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  titleColor: string;
  titleSize: number;
  titleWeight?: string;
  isDarkMode: boolean;
}

export function ShadcnTable({
  id, title, data, x, y, width, height, isSelected, onSelect, onUpdate, onDelete, 
  titleColor, titleSize, titleWeight, isDarkMode
}: ShadcnTableProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [columnName, setColumnName] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const selectedBorderClass = isSelected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : borderClass;
  const hoverBorderClass = isDarkMode ? 'hover:border-gray-600' : 'hover:border-gray-300';
  const headerBorderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const textMutedClass = isDarkMode ? 'text-gray-500' : 'text-gray-500';
  const headerBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const cellBgClass = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const cellHoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
  const stripedClass = data.striped ? (isDarkMode ? 'even:bg-gray-800/50' : 'even:bg-gray-50/50') : '';

  // Add new column
  const addColumn = () => {
    const newColumn: TableColumn = {
      id: `col-${Date.now()}`,
      name: `Column ${data.columns.length + 1}`,
      width: 150,
      type: 'text',
      sortable: true,
      align: 'left'
    };

    const updatedRows = data.rows.map(row => ({
      ...row,
      cells: {
        ...row.cells,
        [newColumn.id]: {
          id: `cell-${Date.now()}-${row.id}`,
          content: '',
          type: 'text'
        }
      }
    }));

    onUpdate(id, {
      data: {
        ...data,
        columns: [...data.columns, newColumn],
        rows: updatedRows
      }
    });
  };

  // Remove column
  const removeColumn = (columnId: string) => {
    if (data.columns.length <= 1) return; // Keep at least one column
    
    const updatedColumns = data.columns.filter(col => col.id !== columnId);
    const updatedRows = data.rows.map(row => {
      const { [columnId]: removed, ...remainingCells } = row.cells;
      return { ...row, cells: remainingCells };
    });

    onUpdate(id, {
      data: {
        ...data,
        columns: updatedColumns,
        rows: updatedRows
      }
    });
  };

  // Add new row
  const addRow = () => {
    const newCells: { [columnId: string]: TableCell } = {};
    data.columns.forEach(column => {
      newCells[column.id] = {
        id: `cell-${Date.now()}-${column.id}`,
        content: '',
        type: column.type
      };
    });

    const newRow: TableRow = {
      id: `row-${Date.now()}`,
      cells: newCells
    };

    onUpdate(id, {
      data: {
        ...data,
        rows: [...data.rows, newRow]
      }
    });
  };

  // Remove row
  const removeRow = (rowId: string) => {
    if (data.rows.length <= 1) return; // Keep at least one row
    
    const updatedRows = data.rows.filter(row => row.id !== rowId);
    onUpdate(id, {
      data: {
        ...data,
        rows: updatedRows
      }
    });
  };

  // Start editing cell
  const startEditingCell = (rowId: string, columnId: string, currentValue: string) => {
    setEditingCell({ rowId, columnId });
    setEditingValue(currentValue);
  };

  // Save cell edit
  const saveCellEdit = () => {
    if (!editingCell) return;

    const updatedRows = data.rows.map(row => {
      if (row.id === editingCell.rowId) {
        return {
          ...row,
          cells: {
            ...row.cells,
            [editingCell.columnId]: {
              ...row.cells[editingCell.columnId],
              content: editingValue
            }
          }
        };
      }
      return row;
    });

    onUpdate(id, {
      data: {
        ...data,
        rows: updatedRows
      }
    });

    setEditingCell(null);
    setEditingValue('');
  };

  // Cancel cell edit
  const cancelCellEdit = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  // Start editing column name
  const startEditingColumn = (columnId: string, currentName: string) => {
    setEditingColumn(columnId);
    setColumnName(currentName);
  };

  // Save column name
  const saveColumnName = () => {
    if (!editingColumn) return;

    const updatedColumns = data.columns.map(col => 
      col.id === editingColumn ? { ...col, name: columnName } : col
    );

    onUpdate(id, {
      data: {
        ...data,
        columns: updatedColumns
      }
    });

    setEditingColumn(null);
    setColumnName('');
  };

  // Move row up/down
  const moveRow = (rowId: string, direction: 'up' | 'down') => {
    const currentIndex = data.rows.findIndex(row => row.id === rowId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === data.rows.length - 1)
    ) return;

    const newRows = [...data.rows];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newRows[currentIndex], newRows[targetIndex]] = [newRows[targetIndex], newRows[currentIndex]];

    onUpdate(id, {
      data: {
        ...data,
        rows: newRows
      }
    });
  };

  // Update table settings
  const updateTableSettings = (settings: Partial<TableData>) => {
    onUpdate(id, {
      data: {
        ...data,
        ...settings
      }
    });
  };

  const tableClasses = `
    w-full overflow-hidden
    ${data.roundedCorners ? 'rounded-lg' : ''}
    ${data.showBorder ? `border ${borderClass}` : ''}
  `.trim();

  const cellPadding = data.compact ? 'px-2 py-1' : 'px-4 py-3';

  return (
    <div
      className={`absolute ${bgClass} rounded-lg shadow-md border-2 transition-all duration-200 ${selectedBorderClass} ${!isSelected ? hoverBorderClass : ''}`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect(id)}
    >
      {/* Header */}
      <div className={`p-4 border-b ${headerBorderClass} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-blue-500" />
          <h3 
            className={`truncate ${titleWeight ? `font-${titleWeight}` : 'font-semibold'}`}
            style={{ color: titleColor, fontSize: `${titleSize}px` }}
          >
            {title}
          </h3>
        </div>
        {isSelected && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              className={`p-1.5 rounded transition-colors ${
                showSettings
                  ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                  : isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
              }`}
              title="Table settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(id, { title: prompt('Table title:', title) || title });
              }}
              className={`p-1.5 rounded transition-colors ${
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
              className={`p-1.5 rounded transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-gray-500 hover:text-red-600'
              }`}
              title="Delete table"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {isSelected && showSettings && (
        <div className={`p-4 border-b ${headerBorderClass} ${headerBgClass}`}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showHeader}
                onChange={(e) => updateTableSettings({ showHeader: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className={textClass}>Show Header</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showBorder}
                onChange={(e) => updateTableSettings({ showBorder: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className={textClass}>Show Border</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.striped}
                onChange={(e) => updateTableSettings({ striped: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className={textClass}>Striped Rows</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.compact}
                onChange={(e) => updateTableSettings({ compact: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className={textClass}>Compact</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer col-span-2">
              <input
                type="checkbox"
                checked={data.roundedCorners}
                onChange={(e) => updateTableSettings({ roundedCorners: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className={textClass}>Rounded Corners</span>
            </label>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-auto" style={{ height: height - (showSettings ? 160 : 80) }}>
        <table className={tableClasses}>
          {/* Table Header */}
          {data.showHeader && (
            <thead>
              <tr className={`${headerBgClass} border-b ${borderClass}`}>
                {data.columns.map((column, index) => (
                  <th
                    key={column.id}
                    className={`${cellPadding} text-left font-semibold ${textClass} border-r last:border-r-0 ${borderClass} relative group`}
                    style={{ 
                      width: `${column.width}px`,
                      textAlign: column.align
                    }}
                  >
                    {editingColumn === column.id ? (
                      <input
                        type="text"
                        value={columnName}
                        onChange={(e) => setColumnName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveColumnName();
                          if (e.key === 'Escape') {
                            setEditingColumn(null);
                            setColumnName('');
                          }
                        }}
                        onBlur={saveColumnName}
                        className={`w-full px-1 py-0.5 text-sm font-semibold bg-transparent border-b-2 border-blue-500 focus:outline-none ${textClass}`}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span 
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingColumn(column.id, column.name);
                          }}
                        >
                          {column.name}
                        </span>
                        {isSelected && (
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeColumn(column.id);
                              }}
                              className={`p-0.5 rounded transition-colors ${
                                isDarkMode 
                                  ? 'text-gray-400 hover:text-red-400' 
                                  : 'text-gray-500 hover:text-red-600'
                              }`}
                              title="Remove column"
                              disabled={data.columns.length <= 1}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
                {isSelected && (
                  <th className={`${cellPadding} w-12 text-center`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addColumn();
                      }}
                      className={`p-1 rounded transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-green-400' 
                          : 'text-gray-500 hover:text-green-600'
                      }`}
                      title="Add column"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </th>
                )}
              </tr>
            </thead>
          )}

          {/* Table Body */}
          <tbody>
            {data.rows.map((row, rowIndex) => (
              <tr 
                key={row.id} 
                className={`group border-b last:border-b-0 ${borderClass} ${stripedClass} ${cellHoverClass} transition-colors`}
              >
                {data.columns.map((column) => {
                  const cell = row.cells[column.id];
                  const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id;
                  
                  return (
                    <td
                      key={`${row.id}-${column.id}`}
                      className={`${cellPadding} border-r last:border-r-0 ${borderClass} relative`}
                      style={{ 
                        width: `${column.width}px`,
                        textAlign: column.align
                      }}
                    >
                      {isEditing ? (
                        <input
                          type={column.type === 'number' ? 'number' : column.type === 'email' ? 'email' : column.type === 'url' ? 'url' : 'text'}
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveCellEdit();
                            if (e.key === 'Escape') cancelCellEdit();
                          }}
                          onBlur={saveCellEdit}
                          className={`w-full px-1 py-0.5 text-sm bg-transparent border-b-2 border-blue-500 focus:outline-none ${textClass}`}
                          autoFocus
                        />
                      ) : (
                        <span 
                          className={`text-sm cursor-pointer hover:bg-opacity-50 rounded px-1 py-0.5 block ${textClass} ${
                            !cell?.content ? textMutedClass : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingCell(row.id, column.id, cell?.content || '');
                          }}
                        >
                          {cell?.content || (
                            <span className="italic">Click to edit</span>
                          )}
                        </span>
                      )}
                    </td>
                  );
                })}
                {isSelected && (
                  <td className={`${cellPadding} w-12`}>
                    <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveRow(row.id, 'up');
                        }}
                        className={`p-0.5 rounded transition-colors ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-blue-400' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                        title="Move up"
                        disabled={rowIndex === 0}
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveRow(row.id, 'down');
                        }}
                        className={`p-0.5 rounded transition-colors ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-blue-400' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                        title="Move down"
                        disabled={rowIndex === data.rows.length - 1}
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRow(row.id);
                        }}
                        className={`p-0.5 rounded transition-colors ${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-red-400' 
                            : 'text-gray-500 hover:text-red-600'
                        }`}
                        title="Remove row"
                        disabled={data.rows.length <= 1}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row Button */}
        {isSelected && (
          <div className={`flex items-center justify-center p-4 border-t ${borderClass}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addRow();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border-2 border-dashed ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-400 hover:bg-green-900/10' 
                  : 'border-gray-300 text-gray-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Row</span>
            </button>
          </div>
        )}
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
