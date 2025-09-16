import { ObjectId } from "mongodb"

export interface User {
  _id: ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  preferences?: {
    notifications: boolean
    theme: string
    language: string
  }
}

export interface Project {
  _id: ObjectId
  userId: ObjectId
  name: string
  description: string
  isPublic: boolean
  charts: Chart[]
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  thumbnail?: string
}

export interface Chart {
  id: string
  type: 'bar' | 'donut' | 'line' | 'pie' | 'area' | 'combo' | 'card' | 'table' | 'button' | 'input' | 'text' | 'image' | 'navigation' | 'dropdown' | 'checkbox' | 'progress' | 'multibar' | 'radio'
  title: string
  x: number
  y: number
  width: number
  height: number
  data: ChartData[] | any
  titleColor: string
  titleSize: number
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  shadow?: boolean
  animation?: boolean
  comments?: Comment[]
  pageId?: string
}

export interface ChartData {
  name: string
  value: number
  color: string
  label?: string
}

export interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  resolved: boolean
  replies?: Comment[]
}

export interface ProjectTemplate {
  _id: ObjectId
  name: string
  description: string
  category: string
  charts: Chart[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserActivity {
  _id: ObjectId
  userId: ObjectId
  action: string
  resource: string
  resourceId: ObjectId
  metadata?: any
  createdAt: Date
}

export interface ProjectShare {
  _id: ObjectId
  projectId: ObjectId
  sharedBy: ObjectId
  sharedWith?: ObjectId
  shareToken?: string
  permissions: 'view' | 'edit'
  expiresAt?: Date
  createdAt: Date
}

export interface ProjectComment {
  _id: ObjectId
  projectId: ObjectId
  authorEmail: string
  authorName?: string
  content: string
  position?: {
    x: number
    y: number
    pageId: string
  }
  chartId?: string
  isResolved: boolean
  createdAt: Date
  updatedAt: Date
}