import Link from "next/link"

import { cn } from "@/lib/utils"


export function BottomNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      {...props}
    >
        {/* <Link
            href="/events"
            className="px-4 text-sm font-medium transition-colors hover:text-primary"
        >
            Events
        </Link>
        <Link
            href="/leaderboard"
            className="px-4 text-sm font-medium text-grey-900 transition-colors hover:text-primary"
        >
            Leaderboard
        </Link> */}
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-black border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-2 mx-auto font-medium">
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-black dark:hover:bg-gray-800 group">
                    <svg className="w-5 h-5 mb-2 text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z"/>
                        <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z"/>
                    </svg>
                    <span className="text-sm text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500"><Link href="/events">Events</Link></span>
                </button>
                <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-black dark:hover:bg-gray-800 group">
                    <svg className="w-5 h-5 mb-2 text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"/>
                    </svg>
                    <span className="text-sm text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500"><Link href="/leaderboard">Leaderboard</Link></span>
                </button>
            </div>
        </div>
    </nav>
  )
}