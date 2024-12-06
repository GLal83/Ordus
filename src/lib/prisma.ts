import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  })
}

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = prismaClientSingleton()
  }
}

export const prisma = global.prisma || prismaClientSingleton()