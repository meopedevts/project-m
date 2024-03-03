'use client'

import { navLinks } from '@/lib/nav-links'
import { Links } from '@/types/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavItems() {
  const pathname = usePathname()
  const items: Links[] = navLinks

  return (
    <div className="pl-2">
      {!pathname.startsWith('/auth') && (
        <div className="flex gap-8 text-sm text-muted-foreground">
          {items.map((item, i) => (
            <Link href={item.href} key={i}>
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
