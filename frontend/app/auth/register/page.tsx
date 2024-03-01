import AuthTemplate from '@/components/auth/auth-template'
import RegisterForm from '@/components/auth/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registre-se',
  description: 'Registre-se Project M',
}

export default function Register() {
  return (
    <div>
      <AuthTemplate>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-semibold">Crie sua conta</div>
            <div className="text-center text-muted-foreground">
              Preencha o formulário abaixo para criar sua conta
            </div>
          </div>
          <RegisterForm />
        </div>
      </AuthTemplate>
    </div>
  )
}
