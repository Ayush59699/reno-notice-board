import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteModal({ isOpen, onClose, onConfirm, noticeTitle }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg w-full max-w-sm p-6 mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-300 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="text-sm font-semibold">
              Delete Notice
            </h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Are you sure you want to delete <span className="font-medium text-zinc-700 dark:text-zinc-300">&ldquo;{noticeTitle}&rdquo;</span>? This action is permanent.
          </p>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs font-medium text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 rounded-lg transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
