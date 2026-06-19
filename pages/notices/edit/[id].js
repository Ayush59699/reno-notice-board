import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import NoticeForm from '../../../components/NoticeForm'
import { prisma } from '../../../lib/prisma'
import { AlertCircle, ChevronLeft } from 'lucide-react'

export default function EditNotice({ notice }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch(`/api/notices/${notice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        router.push('/')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update notice.')
      }
    } catch (err) {
      console.error('Update error:', err)
      setError('An unexpected network error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Edit Notice | Reno Platforms</title>
      </Head>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to notices
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Edit Notice</h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Modify the details of the notice below. Changes will reflect instantly on the board.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg">
          <NoticeForm 
            initialData={notice}
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const noticeId = parseInt(params.id)

  if (isNaN(noticeId)) {
    return { notFound: true }
  }

  try {
    const notice = await prisma.notice.findUnique({
      where: { id: noticeId }
    })

    if (!notice) {
      return { notFound: true }
    }

    // Serialize DateTimes to strings for client consumption
    const serializedNotice = {
      ...notice,
      publishDate: notice.publishDate.toISOString(),
      createdAt: notice.createdAt.toISOString(),
      updatedAt: notice.updatedAt.toISOString(),
    }

    return {
      props: {
        notice: serializedNotice
      }
    }
  } catch (error) {
    console.error(`Failed to fetch notice ${noticeId} for editing:`, error)
    return {
      notFound: true
    }
  }
}
