import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { AlertCircle } from 'lucide-react'

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
        <label htmlFor="title" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
          Title <span className="text-zinc-300 dark:text-zinc-600">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Mid-Semester Exam Schedule"
          className={`w-full px-0 py-2 bg-transparent border-0 border-b text-sm focus:outline-none focus:ring-0 transition-colors dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 ${
            errors.title 
              ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
              : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100'
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
        <label htmlFor="body" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
          Body Content <span className="text-zinc-300 dark:text-zinc-600">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          value={formData.body}
          onChange={handleChange}
          placeholder="Write the details of the notice here..."
          className={`w-full px-0 py-2 bg-transparent border-0 border-b text-sm focus:outline-none focus:ring-0 transition-colors dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 resize-none ${
            errors.body 
              ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
              : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100'
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
          <label htmlFor="category" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-0 py-2 bg-transparent border-0 border-b border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-0 focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100"
          >
            <option value="General">General</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Publish Date */}
        <div>
          <label htmlFor="publishDate" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
            Publish Date <span className="text-zinc-300 dark:text-zinc-600">*</span>
          </label>
          <input
            type="date"
            id="publishDate"
            name="publishDate"
            value={formData.publishDate}
            onChange={handleChange}
            className={`w-full px-0 py-2 bg-transparent border-0 border-b text-sm focus:outline-none focus:ring-0 transition-colors dark:text-zinc-100 ${
              errors.publishDate 
                ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
                : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100'
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
        <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">
          Priority
        </span>
        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="radio"
              name="priority"
              value="Normal"
              checked={formData.priority === 'Normal'}
              onChange={handleChange}
              className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              Normal
            </span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="radio"
              name="priority"
              value="Urgent"
              checked={formData.priority === 'Urgent'}
              onChange={handleChange}
              className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 border-zinc-300 dark:border-zinc-700 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
              Urgent
            </span>
          </label>
        </div>
      </div>

      {/* Optional Image URL */}
      <div>
        <label htmlFor="image" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
          Image URL <span className="text-zinc-300 dark:text-zinc-600 normal-case text-[10px] tracking-normal">(optional)</span>
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className={`w-full px-0 py-2 bg-transparent border-0 border-b text-sm focus:outline-none focus:ring-0 transition-colors dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 ${
            errors.image 
              ? 'border-red-300 dark:border-red-900 focus:border-red-500' 
              : 'border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100'
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
      <div className="pt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="px-4 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-xs font-medium text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
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
