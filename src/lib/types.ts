export interface User {
  readonly username: string
  readonly colorHue: number
  readonly messages: Message[]
  readonly expiresAt: Date
}
export interface Message {
  readonly timestamp: Date
  readonly message: string
}

export type SuperMessage = Message & Omit<User, 'messages'> & { readonly userId: string }
