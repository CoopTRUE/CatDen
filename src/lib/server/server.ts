import type { User } from '$lib/types'

const USER_DURATION = 1000 * 60 * 60
export const users = new Map<string, User>()

export function createUser(username: string) {
  const id = crypto.randomUUID()
  users.set(id, {
    username,
    messages: [],
    colorHue: Math.random() * 360,
    expiresAt: new Date(Date.now() + USER_DURATION),
  })
  setTimeout(() => users.delete(id), USER_DURATION)
  return id
}

export function newMessage(id: string, chat: string) {
  const user = users.get(id)
  if (!user) throw new Error('User not found')
  user.messages.push({
    timestamp: new Date(),
    message: chat,
  })
}
