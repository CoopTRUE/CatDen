export interface User {
  readonly id: number
  readonly name: string
}

export interface Chat {
  readonly user: User
  readonly content: string
}
