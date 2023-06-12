export interface User {
  readonly username: string
  readonly chats: Map<string, string>
}

export const users = new Map<string, User>()

export function createUser(id: string, username: string) {
  users.set(id, { username, chats: new Map() })
}

export function newChat(id: string, chat: string) {
  const user = users.get(id)
  if (!user) throw new Error('User not found')
  const chatId = crypto.randomUUID()
  user.chats.set(chatId, chat)
  setTimeout(() => user.chats.delete(chatId), 1000 * 60 * 60 * 24)
}
