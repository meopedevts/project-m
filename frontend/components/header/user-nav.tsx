'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteSessionCookie, getSessionCookie } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { UserData } from '@/types/types'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserNav() {
  const path = usePathname()
  const [userData, setUserData] = useState<UserData>()
  useEffect(() => {
    const cookies = async () => {
      await getSessionCookie().then((session) => setUserData(session))
    }
    cookies()
  }, [userData])

  async function Logout() {
    await deleteSessionCookie()
    window.location.reload()
  }

  return (
    <div className={cn(path.startsWith('/auth') && 'hidden', '')}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="#" alt={userData?.username} />
              <AvatarFallback>TS</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userData?.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => Logout()}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
