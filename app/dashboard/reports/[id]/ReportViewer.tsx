'use client'

import { useState } from 'react'
import { MedicalReport } from '@/lib/types'
import { format } from 'date-fns'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Calendar, 
  Tag, 
  FileText,
  Copy,
  Check
} from 'lucide-react'
import Link from 'next/link'

interface ReportViewerProps {
  report: MedicalReport
}

export default function ReportViewer({ report: initialReport }: ReportViewerProps) {
  const [report, setReport] = useState(initialReport)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(report.title)
  const [editCategory, setEditCategory] = useState(report.category || '')
  const [editTags, setEditTags] = useState(report.tags?.join(', ') || '')
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/reports/${report._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          tags: editTags.split(',').map(tag => tag.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        const updatedReport = await response.json()
        setReport(updatedReport)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating report:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(report.title)
    setEditCategory(report.category || '')
    setEditTags(report.tags?.join(', ') || '')
    setIsEditing(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(report.extractedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatExtractedText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return null
        
        const isHeader = /^[A-Z\s]{3,}$/.test(trimmedLine) || 
                        /^(PATIENT|DOCTOR|DATE|REPORT|TEST|RESULT|DIAGNOSIS|PRESCRIPTION)/i.test(trimmedLine)
        
        return (
          <div key={index} className={`mb-2 ${isHeader ? 'font-semibold text-primary text-lg' : 'text-black-200'}`}>
            {trimmedLine}
          </div>
        )
      })
      .filter(Boolean)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-black-300 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-black-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        {isEditing ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black-200 mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent text-lg"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black-200 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="e.g., Blood Test, X-Ray, Prescription"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black-200 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g., urgent, follow-up, routine"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary mb-6">{report.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-black-300 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {format(new Date(report.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
              
              {report.category && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <span>{report.category}</span>
                </div>
              )}
              
              {report.tags && report.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span>Tags:</span>
                  <div className="flex space-x-2">
                    {report.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-secondary bg-opacity-10 text-secondary rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Extracted Text */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Extracted Text</span>
          </h2>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 text-secondary hover:text-blue-600 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
        
        <div className="prose max-w-none">
          <div className="bg-white-100 p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
            {formatExtractedText(report.extractedText)}
          </div>
        </div>
      </div>
    </>
  )
}