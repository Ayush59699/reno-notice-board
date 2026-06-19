import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import NoticeForm from '../../components/NoticeForm'
import { AlertCircle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewNotice() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        router.push('/')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create notice.')
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError('An unexpected network error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Create Notice | Reno Platforms</title>
      </Head>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to notices
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Create New Notice</h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Fill out the form below to publish a notice to the campus notice board.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 p-4 rounded-xl flex items-center space-x-2 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
          <NoticeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </div>
    </Layout>
  )
}
