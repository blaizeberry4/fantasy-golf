import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { MainNav } from '@/components/main-nav'
import { BottomNav } from '@/components/bottom-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PUP Golf',
  description: 'Generated by create next app',
  appleWebApp: true,
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex flex-col h-screen overflow-hidden">
            <header className="w-full border-b border-grey bg-purple-700"><MainNav /></header>
            <main className="flex-grow pb-8 overflow-y-scroll">{children}</main>
            <footer className="p-4 h-24 md:hidden text-white"><BottomNav /></footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
