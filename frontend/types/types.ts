export interface UserData {
  id: string
  username: string
  email: string
  expires_at: Date
}

export interface SessionData {
  status: number
  data: UserData | null
}
