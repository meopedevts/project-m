import VerifyUnsuccessLogo from '@/components/auth/verify/invalid/verify-unsuccess-logo'

const VerifyUnsuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-32">
      <div className="flex flex-col items-center justify-center gap-4 font-semibold">
        <div className="text-pretty text-3xl">Tempo de login expirado</div>
        <div className="text-pretty text-xl text-muted-foreground">
          Você redirecionado em breve...
        </div>
      </div>
      <VerifyUnsuccessLogo className="h-4/6 w-4/6" />
    </div>
  )
}

export default VerifyUnsuccess
