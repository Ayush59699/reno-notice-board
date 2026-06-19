import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteModal({ isOpen, onClose, onConfirm, noticeTitle }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md p-6 overflow-hidden transform transition-all duration-300 scale-100 mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 bg-red-50 dark:bg-red-950/30 p-3 rounded-full text-red-600 dark:text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Delete Notice
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete the notice <span className="font-semibold text-slate-800 dark:text-slate-200">&ldquo;{noticeTitle}&rdquo;</span>? This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl shadow-md shadow-red-600/10 hover:shadow-red-600/20 transition-all duration-200"
          >
            Delete Notice
          </button>
        </div>
      </div>
    </div>
  )
}
