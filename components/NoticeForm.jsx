import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Calendar, Tag, AlertTriangle, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react'

export default function NoticeForm({ initialData = null, onSubmit, isSubmitting }) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    body: initialData?.body || '',
    category: initialData?.category || 'General',
    priority: initialData?.priority || 'Normal',
    publishDate: initialData?.publishDate 
      ? new Date(initialData.publishDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    image: initialData?.image || ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for that field when user types
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be under 100 characters'
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Body content is required'
    }

    if (!formData.publishDate) {
      newErrors.publishDate = 'Publish date is required'
    } else if (isNaN(Date.parse(formData.publishDate))) {
      newErrors.publishDate = 'Must be a valid date'
    }

    if (formData.image && !formData.image.trim().startsWith('http')) {
      newErrors.image = 'Image must be a valid URL starting with http:// or https://'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
          <FileText className="h-4 w-4 mr-1.5 text-slate-400" />
          Title <span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Mid-Semester Exam Schedule"
          className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-slate-100 ${
            errors.title 
              ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
              : 'border-slate-200 dark:border-slate-800'
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Body Field */}
      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
          <FileText className="h-4 w-4 mr-1.5 text-slate-400" />
          Body Content <span className="text-red-500 ml-0.5">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={6}
          value={formData.body}
          onChange={handleChange}
          placeholder="Write the details of the notice here..."
          className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-slate-100 ${
            errors.body 
              ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
              : 'border-slate-200 dark:border-slate-800'
          }`}
        />
        {errors.body && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.body}
          </p>
        )}
      </div>

      {/* Category & Publish Date row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
            <Tag className="h-4 w-4 mr-1.5 text-slate-400" />
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-slate-100"
          >
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Publish Date */}
        <div>
          <label htmlFor="publishDate" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
            <Calendar className="h-4 w-4 mr-1.5 text-slate-400" />
            Publish Date <span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-slate-100 ${
              errors.publishDate 
                ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
                : 'border-slate-200 dark:border-slate-800'
            }`}
          />
          {errors.publishDate && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.publishDate}
            </p>
          )}
        </div>
      </div>

      {/* Priority Selection */}
      <div>
        <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1.5 text-slate-400" />
          Priority
        </span>
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <input
              type="radio"
              name="priority"
              value="Normal"
              checked={formData.priority === 'Normal'}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500/20 dark:border-slate-800"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
              Normal
            </span>
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer group">
            <input
              type="radio"
              name="priority"
              value="Urgent"
              checked={formData.priority === 'Urgent'}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 border-slate-300 focus:ring-red-500/20 dark:border-slate-800"
            />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors flex items-center">
              Urgent Notice
            </span>
          </label>
        </div>
      </div>

      {/* Optional Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center">
          <ImageIcon className="h-4 w-4 mr-1.5 text-slate-400" />
          Image URL <span className="text-xs text-slate-400 font-normal ml-1.5">(Optional)</span>
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-slate-100 ${
            errors.image 
              ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
              : 'border-slate-200 dark:border-slate-800'
          }`}
        />
        {errors.image && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.image}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            'Save Notice'
          )}
        </button>
      </div>
    </form>
  )
}
