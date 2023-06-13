import { newChat, users } from '$lib/server/server'
import { error } from '@sveltejs/kit'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { marked } from 'marked'
import { z } from 'zod'

const renderer = new marked.Renderer()
renderer.paragraph = (text) => text
renderer.strong = (text) => `<b>${text}</b>`
renderer.em = (text) => `<i>${text}</i>`
renderer.codespan = (text) => `<code>${text}</code>`
renderer.blockquote = (text) => `<blockquote>${text}</blockquote>`
marked.use({ renderer })

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)
const DOMPurifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'code', 'blockquote'],
  ALLOWED_ATTR: [],
}
DOMPurify.setConfig(DOMPurifyConfig)

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
    const markdown = marked(message.replace(/</g, '&lt;').replace(/>/g, '&gt;'))
    const purified = DOMPurify.sanitize(markdown)
    newChat(userId, purified)
    console.log('new message', userId, purified)
  },
}
