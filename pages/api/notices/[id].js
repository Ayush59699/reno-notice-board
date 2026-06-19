import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const { id } = req.query
  const noticeId = parseInt(id)

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: 'Invalid notice ID.' })
  }

  // GET: Fetch single notice details
  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id: noticeId }
      })

      if (!notice) {
        return res.status(404).json({ error: 'Notice not found.' })
      }

      return res.status(200).json(notice)
    } catch (error) {
      console.error('Error fetching notice:', error)
      return res.status(500).json({ error: 'Failed to fetch notice.' })
    }
  }

  // PUT: Update notice
  if (req.method === 'PUT') {
    const { title, body, category, priority, publishDate, image } = req.body

    // Server-side Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required and cannot be empty.' })
    }
    if (title.length > 100) {
      return res.status(400).json({ error: 'Title must be under 100 characters.' })
    }

    if (!body || typeof body !== 'string' || !body.trim()) {
      return res.status(400).json({ error: 'Body is required and cannot be empty.' })
    }

    const validCategories = ['Exam', 'Event', 'General']
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Category must be one of: Exam, Event, General.' })
    }

    const validPriorities = ['Normal', 'Urgent']
    if (!priority || !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be one of: Normal, Urgent.' })
    }

    if (!publishDate || isNaN(Date.parse(publishDate))) {
      return res.status(400).json({ error: 'A valid publish date is required.' })
    }

    if (image && (typeof image !== 'string' || !image.trim().startsWith('http'))) {
      return res.status(400).json({ error: 'Image URL must be a valid URL starting with http:// or https://.' })
    }

    try {
      const existingNotice = await prisma.notice.findUnique({
        where: { id: noticeId }
      })

      if (!existingNotice) {
        return res.status(404).json({ error: 'Notice not found.' })
      }

      const updatedNotice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image ? image.trim() : null
        }
      })

      return res.status(200).json(updatedNotice)
    } catch (error) {
      console.error('Error updating notice:', error)
      return res.status(500).json({ error: 'Failed to update notice.' })
    }
  }

  // DELETE: Remove notice
  if (req.method === 'DELETE') {
    try {
      const existingNotice = await prisma.notice.findUnique({
        where: { id: noticeId }
      })

      if (!existingNotice) {
        return res.status(404).json({ error: 'Notice not found.' })
      }

      await prisma.notice.delete({
        where: { id: noticeId }
      })

      return res.status(204).end()
    } catch (error) {
      console.error('Error deleting notice:', error)
      return res.status(500).json({ error: 'Failed to delete notice.' })
    }
  }

  // Handle unsupported HTTP methods
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
  return res.status(405).json({ error: `Method ${req.method} not allowed.` })
}
