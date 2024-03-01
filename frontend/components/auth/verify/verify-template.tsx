'use client'

import { setSessionCookie, verifySession } from '@/lib/auth'
import { SessionData } from '@/types/types'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import VerifyUnsuccess from './invalid/verify-unsuccess'
import VerifySuccess from './success/verify-success'

const VerifyTemplate = () => {
  const pathName = usePathname()
  const token = pathName.substring(13, pathName.length)
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData>()
  const [isMounted, setIsMounted] = useState(false)
  const [cookieOk, setCookieOk] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const data = await verifySession(token)
      if (isMounted) {
        setSessionData(data)
      }
    }

    if (!sessionData) {
      fetchData()
    }

    return () => {
      setIsMounted(true)
    }
  }, [token, sessionData, isMounted])

  const setCookie = async () => {
    if (!cookieOk) {
      await setSessionCookie(sessionData!.data!)
      setCookieOk(true)
    }
  }

  if (
    sessionData?.status === 404 ||
    sessionData?.status === 500 ||
    sessionData?.status === 401
  ) {
    setTimeout(() => {
      router.push('/auth/login')
    }, 5000)

    return (
      <div>
        <VerifyUnsuccess />
      </div>
    )
  }

  if (sessionData?.status === 200) {
    setCookie()
    setTimeout(() => {
      router.push('/app')
    }, 5000)
    return (
      <div>
        <VerifySuccess />
      </div>
    )
  }

  return <></>
}

export default VerifyTemplate
