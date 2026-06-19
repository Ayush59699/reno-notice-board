import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import NoticeCard from '../components/NoticeCard'
import DeleteModal from '../components/DeleteModal'
import { prisma } from '../lib/prisma'
import { Megaphone, Search, Filter, AlertCircle, Database } from 'lucide-react'

export default function Home({ initialNotices, dbError }) {
  const [notices, setNotices] = useState(initialNotices || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState(null)

  // Handlers for deleting a notice
  const handleDeleteClick = (notice) => {
    setDeleteTarget(notice)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notices/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotices(prev => prev.filter(n => n.id !== deleteTarget.id))
        setMessage({ type: 'success', text: 'Notice deleted successfully.' })
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.error || 'Failed to delete notice.' })
      }
    } catch (err) {
      console.error('Delete error:', err)
      setMessage({ type: 'error', text: 'An unexpected error occurred.' })
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
      // Auto-hide alert message
      setTimeout(() => setMessage(null), 4000)
    }
  }

  // Filters logic
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.body.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      notice.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <Layout>
      <Head>
        <title>Notice Board | Reno Platforms</title>
        <meta name="description" content="View and manage academic and event notices on the Reno Notice Board." />
      </Head>

      <div className="space-y-6">
        {/* Page Title & Intro */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Campus Notice Board
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Stay updated with the latest events, exam notices, and general announcements.
            </p>
          </div>
        </div>

        {/* Database Connection Alert */}
        {dbError && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex items-start space-x-3 text-amber-800 dark:text-amber-300">
            <Database className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">Database Connection Pending</h3>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                Prisma client is configured, but unable to connect to the database. Set up your hosted MySQL database and run migrations to get started. 
                <code className="block mt-1.5 p-1 bg-amber-100 dark:bg-amber-900/40 rounded text-slate-800 dark:text-slate-200 text-[10px]">
                  DATABASE_URL=&quot;mysql://username:password@host:port/database&quot;
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {message && (
          <div className={`p-4 rounded-xl border flex items-center space-x-2 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400'
          }`}>
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 transition-colors">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-slate-100"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            <Filter className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
            {['All', 'General', 'Exam', 'Event'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        {filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl transition-colors">
            <Megaphone className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No notices found</h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your search query or category filter.' 
                : 'Get started by creating your very first notice.'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        noticeTitle={deleteTarget?.title || ''}
      />
    </Layout>
  )
}

export async function getServerSideProps() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { priority: 'desc' },
        { publishDate: 'desc' }
      ]
    })

    // Serialize DateTimes to strings for client consumption
    const serializedNotices = notices.map(notice => ({
      ...notice,
      publishDate: notice.publishDate.toISOString(),
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
    }))

    return {
      props: {
        initialNotices: serializedNotices,
        dbError: false
      }
    }
  } catch (error) {
    console.error('Failed to retrieve notices from database:', error)
    return {
      props: {
        initialNotices: [],
        dbError: true
      }
    }
  }
}
