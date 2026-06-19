import React from 'react'
import Link from 'next/link'
import { PlusCircle, Megaphone } from 'lucide-react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <Megaphone className="h-4.5 w-4.5 text-zinc-900 dark:text-zinc-100" />
            <div>
              <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Reno Notice Board
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-medium leading-none mt-0.5">
                Engineering
              </span>
            </div>
          </Link>

          <Link
            href="/notices/new"
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-medium text-white dark:text-zinc-950 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 rounded-lg transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Add Notice
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900/60 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500 space-y-2 sm:space-y-0">
          <div>
            &copy; {new Date().getFullYear()} Reno Platforms. Web Development Internship.
          </div>
          <div className="flex space-x-4">
            <span>Powered by Next.js & Prisma</span>
            <span>&middot;</span>
            <span>MySQL Connection</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
