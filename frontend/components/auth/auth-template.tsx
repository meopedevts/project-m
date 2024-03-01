'use client'

import { deleteSessionCookie } from '@/lib/auth'
import { ReactNode, useEffect } from 'react'

const AuthTemplate = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const cookie = async () => {
      await deleteSessionCookie()
    }

    cookie()
  }, [])

  return (
    <div className="flex w-full items-center justify-center">{children}</div>
  )
}

export default AuthTemplate
