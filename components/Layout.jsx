import React from 'react'
import Link from 'next/link'
import { PlusCircle, Megaphone } from 'lucide-react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-all duration-200 shadow-md shadow-blue-600/10">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Reno Notice Board
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none mt-0.5">
                Engineering
              </span>
            </div>
          </Link>

          <Link
            href="/notices/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-600/10 hover:shadow-blue-600/25 transition-all duration-200"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Notice
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 dark:text-slate-500 space-y-2 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Reno Platforms. Web Development Internship.
          </div>
          <div className="flex space-x-4">
            <span>Powered by Next.js & Prisma</span>
            <span>&bull;</span>
            <span>MySQL Connection</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
