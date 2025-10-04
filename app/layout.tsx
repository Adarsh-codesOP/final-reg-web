import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "🚀 XL-Pro Community",
  description: "Created by XL-Pro",
  generator: "XL-Pro",
  icons: {
    icon: "https://xlfzqufxcfykxqrehyxa.supabase.co/storage/v1/object/public/extra/file%20(1).svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark antialiased">
      <head />
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
        <Toaster />
      </body>
    </html>
  )
}
