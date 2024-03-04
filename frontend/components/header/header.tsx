import ThemeToggle from '@/components/theme/theme-toggle'
import SignInButton from '@/components/auth/signin-button'
import UserNav from '@/components/header/user-nav'
import LogoComponent from '@/components/header/logo'
import { Separator } from '@/components/ui/separator'
import NavItems from './nav-items'

const Header = () => {
  return (
    <div className="flex w-full border-b-[1px] px-8 py-3">
      <div className="flex flex-1 items-center justify-start gap-4">
        <LogoComponent />
        <Separator orientation="vertical" />
        <NavItems />
      </div>
      <div className="flex items-center gap-4">
        <SignInButton />
        <ThemeToggle />
        <UserNav />
      </div>
    </div>
  )
}

export default Header
