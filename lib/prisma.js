import { PrismaClient } from '../generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis

const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL || ''
  console.log('Creating Prisma client for:', dbUrl ? dbUrl.split(':')[0] + '://' : 'NO URL')

  if (!dbUrl) {
    return new PrismaClient()
  }

  try {
    if (dbUrl.startsWith('prisma+postgres://') || dbUrl.startsWith('prisma://')) {
      return new PrismaClient({
        accelerateUrl: dbUrl,
      }).$extends(withAccelerate())
    }

    if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
      const { PrismaPg } = require('@prisma/adapter-pg')
      const { Pool } = require('pg')
      const pool = new Pool({ connectionString: dbUrl })
      const adapter = new PrismaPg(pool)
      return new PrismaClient({ adapter })
    }

    if (dbUrl.startsWith('mysql://')) {
      const { PrismaMariaDb } = require('@prisma/adapter-mariadb')
      const url = new URL(dbUrl)

      const isTiDB = url.hostname.includes('tidbcloud.com') ||
        url.hostname.includes('planetscale.com') ||
        url.searchParams.get('sslaccept') === 'strict'

      const config = {
        host: url.hostname,
        port: url.port ? parseInt(url.port) : 3306,
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: decodeURIComponent(url.pathname.replace(/^\//, '').split('?')[0]),
        connectionLimit: 5,
        ...(isTiDB && { ssl: { rejectUnauthorized: false } }),
      }

      console.log('PrismaMariaDb config:', { ...config, password: '***' })
      const adapter = new PrismaMariaDb(config)
      return new PrismaClient({ adapter })
    }
  } catch (error) {
    console.error('Error creating Prisma adapter:', error)
  }

  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma
