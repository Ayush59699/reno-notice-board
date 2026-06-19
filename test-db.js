import { PrismaClient } from './generated/prisma/client';

async function test() {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ DB connection works');
  } catch (e) {
    console.error('❌ DB connection failed', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
