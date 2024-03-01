import AuthTemplate from '@/components/auth/auth-template'
import LoginForm from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Entre com sua Project M',
}

export default function Register() {
  return (
    <div>
      <AuthTemplate>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-semibold">Entre com sua conta</div>
            <div className="text-center text-muted-foreground">
              Preencha o seu email para receber o link de acesso
            </div>
          </div>
          <LoginForm />
        </div>
      </AuthTemplate>
    </div>
  )
}
