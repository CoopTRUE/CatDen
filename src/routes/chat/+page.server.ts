import parseMessage from '$lib/server/messageParser'
import { newChat, users } from '$lib/server/server'
import { error } from '@sveltejs/kit'
import { z } from 'zod'

const userIdSchema = z
  .string()
  .uuid()
  .refine((v) => users.has(v), { message: 'User not found' })
export function load({ cookies }) {
  const parsed = userIdSchema.safeParse(cookies.get('user_id'))
  if (!parsed.success) {
    throw error(400, parsed.error.errors[0].message)
  }
  return {
    userId: parsed.data,
    users,
  }
}

const messageSchema = z.object({
  userId: userIdSchema,
  message: z.string().min(1),
})
export const actions = {
  async message({ request }) {
    const data = Object.fromEntries(await request.formData())
    const messageParsed = messageSchema.safeParse(data)
    if (!messageParsed.success) {
      console.log(messageParsed.error.errors)
      throw error(400, messageParsed.error.errors[0].message)
    }
    const { userId, message } = messageParsed.data
    const parsedMessage = parseMessage(message)
    newChat(userId, parsedMessage)
    console.log('new message', userId, parsedMessage)
  },
}
