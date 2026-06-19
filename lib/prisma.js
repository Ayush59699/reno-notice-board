import { PrismaClient } from '../generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis

const createPrismaClient = () => {
  const rawUrl = process.env.DATABASE_URL || ''
  const dbUrl = rawUrl.replace(/^\"|\"$/g, '')
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
        // Use TiDB Cloud HTTPS adapter for serverless environments
        try {
          const { PrismaTiDBCloud } = require('@tidbcloud/prisma-adapter');
          const { connect } = require('@tidbcloud/serverless');
          const connection = connect({ url: dbUrl });
          const adapter = new PrismaTiDBCloud(connection);
          return new PrismaClient({ adapter });
        } catch (e) {
          console.error('Failed to initialize TiDB Cloud adapter, falling back to default client:', e);
          return new PrismaClient();
        }
      }
  } catch (error) {
    console.error('Error creating Prisma adapter:', error)
  }

  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma
