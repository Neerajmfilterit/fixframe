"use client"

import React from 'react'
import { X } from 'lucide-react'

interface WireframeRadioButtonProps {
  id: string
  title?: string
  x: number
  y: number
  width: number
  height: number
  isSelected?: boolean
  onSelect?: (id: string) => void
  onDelete?: (id: string) => void
  isDarkMode?: boolean
  data?: {
    options: string[]
    selected: string
    label: string
    color?: string
    borderColor?: string
    layout?: string
    size?: string
    spacing?: string
    labelSize?: string
  }
}

export function WireframeRadioButton({
  id,
  title,
  x,
  y,
  width,
  height,
  isSelected = false,
  onSelect,
  onDelete,
  isDarkMode = false,
  data
}: WireframeRadioButtonProps) {
  const selectedBorderClass = isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
  const options = data?.options || ['Option 1', 'Option 2', 'Option 3']
  const selected = data?.selected || options[0]
  const label = data?.label || 'Select an option'
  const color = data?.color || '#3B82F6'
  const borderColor = data?.borderColor || '#D1D5DB'
  const layout = data?.layout || 'horizontal'
  const size = data?.size || 'medium'
  const spacing = data?.spacing || 'medium'
  const labelSize = data?.labelSize || 'medium'

  // Size mappings
  const sizeMap = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  }

  const spacingMap = {
    tight: 'gap-2',
    medium: 'gap-4',
    loose: 'gap-6'
  }

  const labelSizeMap = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(id)
  }

  const handleRadioClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(id)
  }

  return (
    <div
      className={`absolute border-2 transition-all duration-200 ${selectedBorderClass} rounded-lg bg-white`}
      style={{ left: x, top: y, width, height }}
      onClick={handleContainerClick}
    >
      {/* Delete Button */}
      {isSelected && onDelete && (
        <button
          onClick={handleDeleteClick}
          className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Radio Button Content */}
      <div 
        className="w-full h-full flex flex-col justify-center p-4"
        onClick={handleRadioClick}
        onMouseDown={handleRadioClick}
      >
        <label 
          className={`${labelSizeMap[labelSize as keyof typeof labelSizeMap]} font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} block mb-3`}
          onClick={handleRadioClick}
          onMouseDown={handleRadioClick}
        >
          {label}
        </label>
        
        <div 
          className={`flex ${layout === 'horizontal' ? `flex-row ${spacingMap[spacing as keyof typeof spacingMap]}` : 'flex-col space-y-2'}`}
          onClick={handleRadioClick}
          onMouseDown={handleRadioClick}
        >
          {options.map((option: string, index: number) => (
            <div 
              key={index} 
              className="flex items-center gap-2"
              onClick={handleRadioClick}
              onMouseDown={handleRadioClick}
            >
              <div 
                className={`${sizeMap[size as keyof typeof sizeMap]} border-2 rounded-full flex items-center justify-center cursor-pointer transition-colors hover:border-opacity-80`}
                style={{
                  backgroundColor: selected === option ? color : 'transparent',
                  borderColor: selected === option ? color : borderColor
                }}
                onClick={handleRadioClick}
                onMouseDown={handleRadioClick}
              >
                {selected === option && (
                  <div 
                    className="w-1/2 h-1/2 bg-white rounded-full"
                    style={{ backgroundColor: selected === option ? 'white' : 'transparent' }}
                  />
                )}
              </div>
              <span
                className={`${labelSizeMap[labelSize as keyof typeof labelSizeMap]} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}
                onClick={handleRadioClick}
                onMouseDown={handleRadioClick}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
