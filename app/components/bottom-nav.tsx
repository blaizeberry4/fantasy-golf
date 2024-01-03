import Link from "next/link"
import { FaCalendarAlt } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";

import { UserNav } from "./user-nav";


export function BottomNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      {...props}
    >
        <div className="fixed bottom-0 left-0 z-50 w-full h-24 pb-2 bg-black border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
                <div className="inline-flex flex-col items-center justify-center px-5 hover:bg-black dark:hover:bg-gray-800 group">
                    <Link href="/events" className="inline-flex flex-col items-center justify-center">
                        <FaCalendarAlt className="w-5 h-5 mb-2 text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500" />
                        <span className="text-sm text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500">Events</span>
                    </Link>
                </div>
                <div className="inline-flex flex-col items-center justify-center px-5 hover:bg-black dark:hover:bg-gray-800 group">
                    <Link href="/leaderboard" className="inline-flex flex-col items-center justify-center">
                        <FaTrophy className="w-5 h-5 mb-2 text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500" />
                        <span className="text-sm text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500">Leaderboard</span>
                    </Link>
                </div>
                <div className="inline-flex flex-col items-center justify-center px-5 hover:bg-black dark:hover:bg-gray-800 group">
                    <div className="inline-flex flex-col items-center justify-center">
                        <UserNav />
                        <span className="text-sm text-gray-200 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-blue-500">Profile</span>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  )
}