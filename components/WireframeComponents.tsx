'use client';
import React, { useState } from 'react';
import { 
  Type, Trash2, Square, MousePointer, Image, 
  AlignLeft, Menu, ChevronDown, Check, BarChart3,
  Search, User, Settings, Home, MessageSquare, Bell,
  AlertTriangle, UserCircle, Tag, ToggleLeft, ToggleRight,
  Sliders, FileText, Minus as DividerIcon, HelpCircle,
  Circle, Dot, Save, Download, Upload, Share2, Edit3,
  Copy, Code, FolderOpen, Eye, EyeOff, Grid, Plus, Moon, Sun,
  Heart, Star, Camera, Calendar, CheckCircle, XCircle,
  PlusCircle, MinusCircle, Play, Pause, StopCircle as Stop,
  RefreshCw as Refresh, Lock, Unlock, Link, Cloud
} from 'lucide-react';

const INLINE_DELETE_ENABLED = false;

// Base interface for all wireframe components
interface WireframeComponentProps {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: any) => void;
  onDelete?: (id: string) => void;
  isDarkMode?: boolean;
  data?: any;
}

// Button Component
export function WireframeButton({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const buttonText = data?.text || 'Button';
  const buttonType = data?.type || 'primary';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Button - looks like actual UI */}
      <div className="w-full h-full flex items-center justify-center p-2">
        <div 
          className={`
            w-full h-full flex items-center justify-center rounded font-medium text-sm cursor-pointer transition-all hover:scale-105
            ${buttonType === 'primary' ? 'text-white' : 
              buttonType === 'secondary' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 
              'border-2 border-gray-300 text-gray-700 hover:border-gray-400 bg-white'}
          `}
          style={{
            backgroundColor: buttonType === 'primary' ? (data?.color || '#3B82F6') : undefined,
            borderColor: buttonType === 'outline' ? (data?.color || '#3B82F6') : undefined,
            color: buttonType === 'outline' ? (data?.color || '#3B82F6') : undefined
          }}
        >
          {buttonText}
        </div>
      </div>

      {/* Delete Button disabled in favor of context menu */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Input Field Component
export function WireframeInput({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const placeholder = data?.placeholder || 'Enter text...';
  const inputType = data?.type || 'text';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Input - looks like actual UI */}
      <div className="w-full h-full flex items-center justify-center p-2">
        <div 
          className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-gray-500'} focus-within:border-blue-500 transition-colors`}
          style={{
            borderColor: data?.borderColor || undefined,
            backgroundColor: data?.backgroundColor || undefined
          }}
        >
          <div className="flex items-center">
            {inputType === 'search' && <Search className="w-4 h-4 mr-2" />}
            <span>{placeholder}</span>
          </div>
        </div>
      </div>

      {/* Delete Button disabled in favor of context menu */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Text/Label Component
export function WireframeText({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const textContent = data?.content || 'Sample Text';
  const textSize = data?.size || 'medium';
  const textAlign = data?.align || 'left';

  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl font-bold'
  };

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Text - looks like actual UI */}
      <div className="w-full h-full flex items-center justify-center p-2">
        <div 
          className={`${sizeClasses[textSize as keyof typeof sizeClasses]} text-${textAlign} w-full`}
          style={{
            color: data?.color || (isDarkMode ? '#F3F4F6' : '#374151')
          }}
        >
          {textContent}
        </div>
      </div>

      {/* Delete Button disabled in favor of context menu */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Image Placeholder Component
export function WireframeImage({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const imageText = data?.text || 'Image';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Image - looks like actual UI */}
      <div className="w-full h-full p-2">
        {data?.hasImage && data?.imageUrl ? (
          // Show uploaded image
          <div className="w-full h-full relative overflow-hidden" style={{
            borderRadius: `${data?.borderRadius || 8}px`,
            border: data?.borderWidth ? `${data?.borderWidth}px solid ${data?.borderColor || '#E5E7EB'}` : 'none'
          }}>
            <img
              src={data.imageUrl}
              alt={data?.fileName || 'Uploaded image'}
              className="w-full h-full"
              style={{
                objectFit: data?.objectFit || 'cover'
              }}
            />
          </div>
        ) : (
          // Show placeholder
          <div 
            className={`w-full h-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex flex-col items-center justify-center border-2 border-dashed ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            style={{
              borderRadius: `${data?.borderRadius || 8}px`,
              border: data?.borderWidth ? `${data?.borderWidth}px solid ${data?.borderColor || '#E5E7EB'}` : undefined
            }}
          >
            <Image className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-2`} />
            <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center px-2`}>{imageText}</span>
          </div>
        )}
      </div>

      {/* Delete Button disabled in favor of context menu */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Card Container Component
export function WireframeCard({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const cardTitle = data?.cardTitle || 'Card Title';
  const cardContent = data?.content || 'Card content goes here...';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Card - looks like actual UI */}
      <div className="w-full h-full p-3">
        <div 
          className={`w-full h-full p-4 rounded-lg border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} shadow-sm`}
          style={{
            backgroundColor: data?.backgroundColor || (isDarkMode ? '#1F2937' : '#FFFFFF')
          }}
        >
          <h4 className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>{cardTitle}</h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cardContent}</p>
        </div>
      </div>

      {/* Delete Button disabled in favor of context menu */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Navigation Component
export function WireframeNavigation({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const navItems = data?.items || ['Home', 'About', 'Services', 'Contact'];

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Navigation - looks like actual UI */}
      <div className="w-full h-full p-2">
        <div className={`w-full h-full flex items-center justify-between px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-200'} shadow-sm`}>
          <div className="flex items-center gap-6">
            {navItems.map((item: string, index: number) => (
              <span key={index} className={`text-sm ${index === 0 ? (isDarkMode ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium') : (isDarkMode ? 'text-gray-300' : 'text-gray-600')} cursor-pointer hover:text-blue-500`}>
                {item}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <Bell className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
        </div>
      </div>

      {/* Delete Button (only shown when selected) */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Dropdown Component
export function WireframeDropdown({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Dropdown - looks like actual UI */}
      <div className="w-full h-full flex items-center justify-center p-2">
        <div 
          className={`w-full px-3 py-2 border rounded-md flex items-center justify-between cursor-pointer transition-colors hover:border-gray-400 ${
            data?.style === 'filled' ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-50') :
            data?.style === 'outlined' ? 'bg-transparent' :
            data?.style === 'underlined' ? 'border-l-0 border-r-0 border-t-0 rounded-none' :
            isDarkMode ? 'bg-gray-700' : 'bg-white'
          }`}
          style={{
            borderColor: data?.borderColor || (isDarkMode ? '#4B5563' : '#D1D5DB'),
            backgroundColor: data?.backgroundColor || (data?.style === 'filled' ? (isDarkMode ? '#374151' : '#F9FAFB') : (isDarkMode ? '#374151' : '#FFFFFF'))
          }}
        >
          <span className={data?.hasSelection && data?.selectedOption ? '' : 'opacity-60'}>
            {data?.hasSelection && data?.selectedOption ? data.selectedOption : (data?.placeholder || 'Select option...')}
          </span>
          <ChevronDown className="w-4 h-4 opacity-60" />
        </div>
      </div>

      {/* Delete Button (only shown when selected) */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Checkbox Component
export function WireframeCheckbox({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const checkboxText = data?.text || 'Checkbox option';
  const isChecked = data?.checked || false;

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Checkbox - looks like actual UI */}
      <div className="w-full h-full flex items-center justify-center p-2">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 border rounded flex items-center justify-center cursor-pointer ${isChecked ? 'bg-blue-500 border-blue-500' : (isDarkMode ? 'border-gray-600' : 'border-gray-300')} transition-colors hover:border-blue-400`}>
            {isChecked && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}>{checkboxText}</span>
        </div>
      </div>

      {/* Delete Button (only shown when selected) */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}


// Progress Bar Component
export function WireframeProgress({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const progress = data?.progress || 65;
  const progressText = data?.text || 'Progress';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      {/* Clean Progress Bar - looks like actual UI */}
      <div className="w-full h-full flex items-center justify-center p-3">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{progressText}</span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{progress}%</span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Delete Button (only shown when selected) */}
      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Alert Component
export function WireframeAlert({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const alertTitle = data?.alertTitle || 'Alert';
  const alertMessage = data?.message || 'This is an alert message';
  const alertType = data?.type || 'info';

  const typeStyles = {
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    success: 'border-green-200 bg-green-50 text-green-800'
  };

  const icons = {
    info: <AlertTriangle className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
    error: <AlertTriangle className="w-4 h-4" />,
    success: <Check className="w-4 h-4" />
  };

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full p-2">
        <div className={`w-full h-full p-3 rounded-lg border ${typeStyles[alertType as keyof typeof typeStyles]}`}>
          <div className="flex items-start gap-2">
            {icons[alertType as keyof typeof icons]}
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{alertTitle}</h4>
              <p className="text-sm opacity-90">{alertMessage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* No inline delete button for icons; use context menu in builder */}
    </div>
  );
}

// Avatar Component
export function WireframeAvatar({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const avatarText = data?.text || 'JD';
  const avatarSize = data?.size || 'medium';

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base',
    xlarge: 'w-20 h-20 text-lg'
  };

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full flex items-center justify-center p-2">
        {data?.hasImage && data?.imageUrl ? (
          <img
            src={data.imageUrl}
            alt="Avatar"
            className={`${sizeClasses[avatarSize as keyof typeof sizeClasses]} rounded-full object-cover border-2 border-gray-200`}
          />
        ) : (
          <div className={`${sizeClasses[avatarSize as keyof typeof sizeClasses]} rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600`}>
            {avatarText}
          </div>
        )}
      </div>

      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Badge Component
export function WireframeBadge({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const badgeText = data?.text || 'Badge';
  const badgeVariant = data?.variant || 'default';

  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full flex items-center justify-center p-2">
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${variantStyles[badgeVariant as keyof typeof variantStyles]}`}>
          {badgeText}
        </div>
      </div>

      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Switch Component
export function WireframeSwitch({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const switchText = data?.text || 'Switch';
  const isOn = data?.isOn || false;

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full flex items-center justify-center p-2">
        <div className="flex items-center gap-2">
          <div className={`w-11 h-6 rounded-full p-1 transition-colors ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{switchText}</span>
        </div>
      </div>

      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Slider Component
export function WireframeSlider({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const sliderValue = data?.value || 50;
  const sliderLabel = data?.label || 'Slider';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full flex items-center justify-center p-3">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{sliderLabel}</span>
            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{sliderValue}</span>
          </div>
          <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} relative`}>
            <div 
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${sliderValue}%` }}
            />
            <div 
              className="absolute top-0 w-4 h-4 bg-blue-500 rounded-full -mt-1 border-2 border-white shadow"
              style={{ left: `calc(${sliderValue}% - 8px)` }}
            />
          </div>
        </div>
      </div>

      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Textarea Component
export function WireframeTextarea({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const placeholder = data?.placeholder || 'Enter your message...';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full p-2">
        <div 
          className={`w-full h-full px-3 py-2 border rounded-md ${isDarkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-gray-500'} focus-within:border-blue-500 transition-colors resize-none`}
          style={{
            borderColor: data?.borderColor || undefined,
            backgroundColor: data?.backgroundColor || undefined
          }}
        >
          <div className="text-sm">{placeholder}</div>
        </div>
      </div>

      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Separator Component
export function WireframeSeparator({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const orientation = data?.orientation || 'horizontal';

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full flex items-center justify-center p-2">
        <div 
          className={`${
            orientation === 'horizontal' ? 'w-full h-px' : 'w-px h-full'
          }`}
          style={{
            backgroundColor: data?.color || (isDarkMode ? '#4B5563' : '#D1D5DB')
          }}
        />
      </div>

      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// Icon Button Component
export function WireframeIconButton({
  id, title, x, y, width, height, isSelected = false,
  onSelect, onDelete, isDarkMode = false, data
}: WireframeComponentProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent';
  const iconName = data?.icon || 'Save';
  const bgColor = data?.bgColor; // default none (transparent)
  const borderColor = data?.borderColor; // default none
  const borderWidth = typeof data?.borderWidth === 'number' ? data.borderWidth : 0; // default none
  const borderRadius = typeof data?.borderRadius === 'number' ? data.borderRadius : 0; // default square
  const iconColor = data?.color || (isDarkMode ? '#E5E7EB' : '#111827');

  const iconMap: Record<string, React.ComponentType<any>> = {
    Save, Download, Upload, Share: Share2, Edit: Edit3, Delete: Trash2, Copy, Tag,
    User: UserCircle, Code, Folder: FolderOpen, File: FileText, Eye, EyeOff, Grid,
    Plus, Moon, Sun, Home, Search, Settings, Bell, Heart, Star, Camera, Calendar,
    CheckCircle, XCircle, PlusCircle, MinusCircle, Play, Pause, Stop, Refresh,
    Lock, Unlock, Link, Cloud
  };
  const IconComp = iconMap[iconName] || Save;

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg`}
      style={{ left: x, top: y, width, height }}
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full h-full flex items-center justify-center p-0">
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            backgroundColor: bgColor || 'transparent',
            border: borderWidth && borderColor ? `${borderWidth}px solid ${borderColor}` : 'none',
            borderRadius
          }}
        >
          {(() => {
            const size = Math.max(8, Math.floor(Math.min(width, height) * 0.8));
            return <IconComp style={{ width: size, height: size, color: iconColor }} />;
          })()}
        </div>
      </div>

      {INLINE_DELETE_ENABLED && isSelected && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors shadow-md flex items-center justify-center"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}