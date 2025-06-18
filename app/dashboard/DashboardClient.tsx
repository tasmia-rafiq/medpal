'use client'

import { useState } from 'react'
import { MedicalReport } from '@/lib/types'
import { format } from 'date-fns'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Calendar,
  Tag,
  Grid,
  List
} from 'lucide-react'
import Link from 'next/link'

interface DashboardClientProps {
  initialReports: MedicalReport[]
}

export default function DashboardClient({ initialReports }: DashboardClientProps) {
  const [reports, setReports] = useState(initialReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.extractedText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(reports.map(r => r.category).filter(Boolean)))]

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return
    
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setReports(reports.filter(r => r._id !== reportId))
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Medical Reports</h1>
            <p className="text-black-300 mt-1">
              Manage and organize your medical documents
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Report</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-secondary bg-opacity-10 rounded-lg">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black-300">Total Reports</p>
              <p className="text-2xl font-bold text-primary">{reports.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black-300">This Month</p>
              <p className="text-2xl font-bold text-primary">
                {reports.filter(r => 
                  new Date(r.createdAt).getMonth() === new Date().getMonth()
                ).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Tag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black-300">Categories</p>
              <p className="text-2xl font-bold text-primary">{categories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-300 w-4 h-4" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-secondary text-white' : 'text-black-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-secondary text-white' : 'text-black-300'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-black-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-black-200 mb-2">
            {reports.length === 0 ? 'No reports yet' : 'No reports found'}
          </h3>
          <p className="text-black-300 mb-6">
            {reports.length === 0 
              ? 'Upload your first medical report to get started'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {reports.length === 0 && (
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Report</span>
            </Link>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'p-4' : 'p-6'
              }`}
            >
              <div className={`flex ${viewMode === 'list' ? 'items-center space-x-4' : 'flex-col'}`}>
                <div className={`${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                  <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
                    {report.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-black-300 mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(report.createdAt), 'MMM dd, yyyy')}</span>
                    </span>
                    {report.category && (
                      <span className="flex items-center space-x-1">
                        <Tag className="w-4 h-4" />
                        <span>{report.category}</span>
                      </span>
                    )}
                  </div>
                  {viewMode === 'grid' && (
                    <p className="text-black-300 text-sm line-clamp-3">
                      {report.extractedText.substring(0, 150)}...
                    </p>
                  )}
                </div>
                
                <div className={`flex ${viewMode === 'list' ? 'space-x-2' : 'justify-between mt-4'}`}>
                  <Link
                    href={`/dashboard/reports/${report._id}`}
                    className="flex items-center space-x-1 text-secondary hover:text-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </Link>
                  <button
                    onClick={() => handleDeleteReport(report._id!)}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}