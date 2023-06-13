export interface User {
  readonly username: string
  readonly colorHue: number
  readonly chats: Map<string, string>
}

export const users = new Map<string, User>()

export function createUser(username: string) {
  const id = crypto.randomUUID()
  users.set(id, { username, chats: new Map(), colorHue: Math.random() * 360 })
  return id
}

export function newChat(id: string, chat: string) {
  const user = users.get(id)
  if (!user) throw new Error('User not found')
  const chatId = crypto.randomUUID()
  user.chats.set(chatId, chat)
  setTimeout(() => user.chats.delete(chatId), 1000 * 60 * 60 * 24)
}
