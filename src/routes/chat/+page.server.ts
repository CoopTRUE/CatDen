import { users } from '$lib/server/server'
import { error } from '@sveltejs/kit'
import { z } from 'zod'

const userId = z
  .string()
  .uuid()
  .refine((v) => users.has(v), { message: 'User not found' })
export function load({ cookies }) {
  const parsed = userId.safeParse(cookies.get('user_id'))
  if (!parsed.success) {
    throw error(400, parsed.error.errors[0].message)
  }
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user: users.get(parsed.data)!,
  }
}
