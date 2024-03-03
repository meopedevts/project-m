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

export interface Links {
  title: string
  href: string
}

export interface NavProps {
  isCollapsed: boolean
  links: Links[]
  path: string
}

export interface ResponseError {
  status: number
  cause: string
  message: string
}
