import React from 'react'
import Link from 'next/link'
import { Calendar, Edit2, Trash2 } from 'lucide-react'

export default function NoticeCard({ notice, onDeleteClick }) {
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'Exam':
        return 'Exam'
      case 'Event':
        return 'Event'
      case 'General':
      default:
        return 'General'
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
    <div className={`relative flex flex-col justify-between bg-white dark:bg-zinc-950 border rounded-lg transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 group ${
      notice.priority === 'Urgent' 
        ? 'border-zinc-300 dark:border-zinc-700' 
        : 'border-zinc-100 dark:border-zinc-900'
    }`}>
      {/* Urgent indicator — subtle top line */}
      {notice.priority === 'Urgent' && (
        <div className="absolute top-0 left-0 right-0 h-px bg-zinc-900 dark:bg-zinc-100" />
      )}

      {/* Notice Image (if provided) */}
      {notice.image && (
        <div className="relative w-full h-40 overflow-hidden bg-zinc-50 dark:bg-zinc-900 rounded-t-lg">
          <img 
            src={notice.image} 
            alt={notice.title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Category & Priority */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider font-medium text-zinc-400 dark:text-zinc-500">
              {getCategoryLabel(notice.category)}
            </span>

            {notice.priority === 'Urgent' && (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-900 dark:text-zinc-100">
                Urgent
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
            {notice.title}
          </h3>

          {/* Body */}
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 whitespace-pre-wrap leading-relaxed">
            {notice.body}
          </p>
        </div>

        {/* Footer info & Actions */}
        <div className="mt-5 pt-4 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
          {/* Publish Date */}
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1.5" />
            <span>{formatDate(notice.publishDate)}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Link 
              href={`/notices/edit/${notice.id}`}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors"
              title="Edit notice"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Link>
            <button 
              onClick={() => onDeleteClick(notice)}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md transition-colors"
              title="Delete notice"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
