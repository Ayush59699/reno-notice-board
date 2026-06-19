import React from 'react'
import Link from 'next/link'
import { Calendar, Tag, AlertCircle, Edit2, Trash2 } from 'lucide-react'

export default function NoticeCard({ notice, onDeleteClick }) {
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Exam':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800'
      case 'Event':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
      case 'General':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-700'
    }
  }

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch {
      return dateString
    }
  }

  return (
    <div className={`relative flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900 border rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${
      notice.priority === 'Urgent' 
        ? 'border-red-200 dark:border-red-900 shadow-sm shadow-red-50 dark:shadow-none' 
        : 'border-slate-100 dark:border-slate-800 shadow-sm'
    }`}>
      {/* Red Highlight Bar for Urgent Notices */}
      {notice.priority === 'Urgent' && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 to-rose-600" />
      )}

      {/* Notice Image (if provided) */}
      {notice.image && (
        <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img 
            src={notice.image} 
            alt={notice.title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none'; // Hide if URL fails to load
            }}
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Category & Priority */}
          <div className="flex items-center justify-between mb-3.5">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryStyles(notice.category)}`}>
              <Tag className="h-3 w-3 mr-1" />
              {notice.category}
            </span>

            {notice.priority === 'Urgent' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-900 animate-pulse">
                <AlertCircle className="h-3 w-3 mr-1" />
                Urgent
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {notice.title}
          </h3>

          {/* Body */}
          <p className="mt-2.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-4 whitespace-pre-wrap leading-relaxed">
            {notice.body}
          </p>
        </div>

        {/* Footer info & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {/* Publish Date */}
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
            <span>{formatDate(notice.publishDate)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link 
              href={`/notices/edit/${notice.id}`}
              className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-all duration-200"
              title="Edit notice"
            >
              <Edit2 className="h-4 w-4" />
            </Link>
            <button 
              onClick={() => onDeleteClick(notice)}
              className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all duration-200"
              title="Delete notice"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
