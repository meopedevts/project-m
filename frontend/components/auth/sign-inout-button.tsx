'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SignInOutButton = () => {
  const pathName = usePathname()

  return pathName === '/auth/register' ? (
    <Button variant={'outline'} asChild>
      <Link href="/auth/login">Login</Link>
    </Button>
  ) : pathName === '/auth/login' ? (
    <Button variant={'outline'} asChild>
      <Link href="/auth/register">Registrar</Link>
    </Button>
  ) : (
    <></>
  )
}

export default SignInOutButton
