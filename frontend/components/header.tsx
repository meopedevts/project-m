import ThemeToggle from '@/components/theme-toggle'
import SignInOutButton from '@/components/auth/sign-inout-button'

const Header = () => {
  return (
    <div className="flex w-full border-b-[1px] px-16 py-2">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <SignInOutButton />
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Header
