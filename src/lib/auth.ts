import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function syncUserWithDatabase() {
  const { userId } = await auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const data = {
    email: clerkUser.emailAddresses[0]?.emailAddress || null,
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
  }

  return prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: data,
    create: { clerkId: clerkUser.id, ...data },
  })
}