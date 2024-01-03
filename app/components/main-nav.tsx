import Link from "next/link"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { UserNav } from "@/components/user-nav"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center p-4 hidden md:block", className)}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        <div className="hidden md:block">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            <Image className="bg-white pr-2 rounded-full" src="/pupgolf.png" alt="me" width={80} height={80} />
          </Link>
        </div>
        <div className="hidden md:block">
          <Link
            href="/events"
            className="px-4 text-sm font-medium transition-colors hover:text-primary"
          >
            Events
          </Link>
          <Link
            href="/leaderboard"
            className="px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Leaderboard
          </Link>
        </div>
        <div className="hidden md:block">
          <UserNav />
        </div>
      </div>
    </nav>
  )
}