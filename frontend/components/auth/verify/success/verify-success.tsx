import VerifySuccessLogo from '@/components/auth/verify/success/verify-success-logo'

const VerifySuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-32">
      <div className="flex flex-col items-center justify-center gap-4 font-semibold">
        <div className="text-pretty text-3xl">Login realizado com sucesso!</div>
        <div className="text-pretty text-xl text-muted-foreground">
          Você redirecionado em breve...
        </div>
      </div>
      <VerifySuccessLogo className="h-4/6 w-4/6" />
    </div>
  )
}

export default VerifySuccess
