import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' },
          { publishDate: 'desc' }
        ]
      })
      return res.status(200).json(notices)
    } catch (error) {
      console.error('Error fetching notices:', error)
      return res.status(500).json({ error: 'Failed to fetch notices' })
    }
  } 
  
  if (req.method === 'POST') {
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
      const newNotice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image ? image.trim() : null
        }
      })
      return res.status(201).json(newNotice)
    } catch (error) {
      console.error('Error creating notice:', error)
      return res.status(500).json({ error: 'Failed to create notice.' })
    }
  }

  // Handle unsupported HTTP methods
  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).json({ error: `Method ${req.method} not allowed.` })
}
