import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { MainNav } from '@/components/main-nav'
import { BottomNav } from '@/components/bottom-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </head>
        <body className={inter.className}>
          <div className="flex flex-col h-screen overflow-hidden">
            <header className="w-full border-b border-grey p-4 bg-purple-700 h-16"><MainNav /></header>
            <main className="flex-grow pb-8 overflow-y-scroll">{children}</main>
            <footer className="p-4 h-16 md:hidden text-white"><BottomNav /></footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
