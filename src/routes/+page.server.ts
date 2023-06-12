import { fail } from '@sveltejs/kit'
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
      data,
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
  async default({ request }) {
    const data = Object.fromEntries(await request.formData())
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      return fail(400, { error: parsed.error.errors[0].message })
    }
    const { captcha_id, captcha } = parsed.data
    if (captchas.get(captcha_id) !== captcha) {
      return fail(400, { error: 'Invalid captcha' })
    }
    console.log(parsed.data)
  },
}
