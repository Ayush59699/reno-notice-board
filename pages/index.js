import React, { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import NoticeCard from '../components/NoticeCard'
import DeleteModal from '../components/DeleteModal'
import { prisma } from '../lib/prisma'
import { Megaphone, Search, AlertCircle, Database } from 'lucide-react'

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

      <div className="space-y-8">
        {/* Page Title & Intro */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Campus Notice Board
          </h1>
          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            Stay updated with the latest events, exam notices, and general announcements.
          </p>
        </div>

        {/* Database Connection Alert */}
        {dbError && (
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 flex items-start space-x-3 text-zinc-500 dark:text-zinc-400">
            <Database className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sm text-zinc-700 dark:text-zinc-300">Database Connection Pending</h3>
              <p className="text-xs mt-1 leading-relaxed">
                Prisma client is configured, but unable to connect to the database. Set up your hosted MySQL database and run migrations to get started. 
                <code className="block mt-1.5 p-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-600 dark:text-zinc-400 text-[10px]">
                  DATABASE_URL=&quot;mysql://username:password@host:port/database&quot;
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        {message && (
          <div className={`p-3 rounded-lg border flex items-center space-x-2 text-sm ${
            message.type === 'success'
              ? 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              : 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400'
          }`}>
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">{message.text}</span>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent border-b border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-1">
            {['All', 'General', 'Exam', 'Event'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? 'text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100'
                    : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Grid */}
        {filteredNotices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Megaphone className="mx-auto h-8 w-8 text-zinc-200 dark:text-zinc-800" />
            <h3 className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">No notices found</h3>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500 max-w-xs mx-auto">
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
