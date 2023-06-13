import parseMessage from '$lib/server/messageParser'
import { newChat, users } from '$lib/server/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod'

const userIdSchema = z
  .string()
  .uuid()
  .refine((v) => users.has(v), { message: 'User not found' })
export function load({ cookies }) {
  const parsed = userIdSchema.safeParse(cookies.get('user_id'))
  if (!parsed.success) {
    throw redirect(302, '/')
  }
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    localUserId: parsed.data,
    users,
  }
}

const messageSchema = z.object({
  userId: userIdSchema,
  message: z.string().min(1),
})
const logoutSchema = z.object({
  userId: userIdSchema,
})
export const actions = {
  async message({ request }) {
    const data = Object.fromEntries(await request.formData())
    const messageParsed = messageSchema.safeParse(data)
    if (!messageParsed.success) {
      throw error(400, messageParsed.error.errors[0].message)
    }
    const { userId, message } = messageParsed.data
    const parsedMessage = parseMessage(message)
    newChat(userId, parsedMessage)
    console.log('new message', userId, parsedMessage)
  },
  async logout({ request }) {
    const data = Object.fromEntries(await request.formData())
    const parsed = logoutSchema.safeParse(data)
    if (!parsed.success) {
      throw error(400, parsed.error.errors[0].message)
    }
    users.delete(parsed.data.userId)
    throw redirect(302, '/')
  },
}
