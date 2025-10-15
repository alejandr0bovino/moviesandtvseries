// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) throw new Error('Missing CLERK_WEBHOOK_SECRET')

  const payload = JSON.stringify(await req.json())
  const wh = new Webhook(secret)
  const headersList = await headers()
  const evt = wh.verify(payload, {
    'svix-id': headersList.get('svix-id')!,
    'svix-timestamp': headersList.get('svix-timestamp')!,
    'svix-signature': headersList.get('svix-signature')!,
  }) as WebhookEvent

  switch (evt.type) {
    case 'user.created':
    case 'user.updated':
      await prisma.user.upsert({
        where: { clerkId: evt.data.id! },
        update: {
          email: evt.data.email_addresses[0]?.email_address || null,
          name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
        },
        create: {
          clerkId: evt.data.id!,
          email: evt.data.email_addresses[0]?.email_address || null,
          name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
        },
      })
      break
    case 'user.deleted':
      await prisma.user.delete({ where: { clerkId: evt.data.id! } })
      break
  }

  return new Response(null, { status: 200 })
}