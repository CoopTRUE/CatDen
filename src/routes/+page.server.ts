import { createUser } from '$lib/server/server'
import { fail, redirect } from '@sveltejs/kit'
import * as svgCaptcha from 'svg-captcha'
import { z } from 'zod'

const CAPTCHA_LENGTH = 5
const captchas = new Map<string, string>()

export function load() {
  const id = crypto.randomUUID()
  const { data, text } = svgCaptcha.create({ color: true, size: CAPTCHA_LENGTH, noise: 7 })
  captchas.set(id, text)
  setTimeout(() => captchas.delete(id), 1000 * 60)
  return {
    captcha: {
      id,
      data: Buffer.from(data).toString('base64'),
    },
  }
}

const schema = z.object({
  captcha_id: z.string().refine((v) => captchas.has(v), { message: 'Expired captcha' }),
  captcha: z.string(),
  username: z
    .string()
    .min(3, {
      message: 'Username must be at least 3 characters long',
    })
    .max(20, {
      message: 'Username must be at most 20 characters long',
    }),
})
export const actions = {
  async default({ request, cookies }) {
    const data = Object.fromEntries(await request.formData())
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      return fail(400, { error: parsed.error.errors[0].message })
    }
    const { captcha_id, captcha, username } = parsed.data
    if (captchas.get(captcha_id) !== captcha) {
      return fail(400, { error: 'Invalid captcha' })
    }
    const userId = crypto.randomUUID()
    createUser(userId, username)
    cookies.set('user_id', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    })
    throw redirect(302, '/chat')
  },
}
