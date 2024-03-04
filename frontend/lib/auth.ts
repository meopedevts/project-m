'use server'

import { SessionData, UserData } from '@/types/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { cookies } from 'next/headers'

export async function verifySession(jwtToken: string) {
  const payload = {
    token: jwtToken,
  }

  return await axios
    .post('http://localhost:8080/auth/verify', payload)
    .then((response: AxiosResponse) => {
      const responseData = response.data
      const sessionData: SessionData = {
        status: 200,
        data: responseData,
      }
      return sessionData
    })
    .catch((error: AxiosError) => {
      const status = error.response?.status
      if (status === 404) {
        const sessionData: SessionData = {
          status,
          data: null,
        }
        return sessionData
      }

      if (status === 401) {
        const sessionData: SessionData = {
          status,
          data: null,
        }
        return sessionData
      }
    })
}
export async function setSessionCookie(userData: UserData) {
  if (cookies().has('authentication')) {
    cookies().delete('authentication')
  }

  cookies().set({
    name: 'authentication',
    value: JSON.stringify(userData),
    secure: true,
  })
}

export async function deleteSessionCookie() {
  cookies().delete('authentication')
}

export async function getSessionCookie(): Promise<UserData> {
  if (cookies().has('authentication')) {
    return JSON.parse(cookies().get('authentication')!.value)
  }
  const userData: UserData = {
    id: '',
    email: '',
    username: '',
    expires_at: new Date(),
  }
  return userData
}
