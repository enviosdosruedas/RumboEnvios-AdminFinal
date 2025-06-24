import { PrismaClient } from "@prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"

const prismaClientSingleton = () => {
  // Only create a new PrismaClient if the DATABASE_URL is set.
  // This prevents the app from crashing on startup if the .env file is not configured.
  if (!process.env.DATABASE_URL) {
    console.warn(
      "DATABASE_URL environment variable is not set. Prisma Client will not be initialized. Please set it in your .env file to enable database functionality."
    );
    return null;
  }
  return new PrismaClient().$extends(withAccelerate())
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

declare global {
  var prisma: undefined | PrismaClientSingleton
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma
}
