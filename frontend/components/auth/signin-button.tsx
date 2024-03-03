'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SignInButton = () => {
  const pathName = usePathname()

  return (
    <>
      {pathName === '/auth/register' && (
        <Button variant={'outline'} asChild>
          <Link href="/auth/login">Entrar</Link>
        </Button>
      )}
      {pathName === '/auth/login' && (
        <Button variant={'outline'} asChild>
          <Link href="/auth/register">Registar-se</Link>
        </Button>
      )}
    </>
  )
}

export default SignInButton
