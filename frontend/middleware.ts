import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { UserData } from './types/types'

export function middleware(request: NextRequest) {
  if (request.cookies.has('authentication')) {
    const currentUser: UserData = JSON.parse(
      request.cookies.get('authentication')!.value,
    )
    const currentDate = new Date()
    const expiresAt = new Date(currentUser.expires_at)
    if (currentDate > expiresAt) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  } else {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|auth|_next/static|_next/image|.*\\.png$).*)'],
}
