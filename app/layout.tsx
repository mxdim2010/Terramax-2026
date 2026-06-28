import type { Metadata } from "next"
import { Space_Grotesk, Fraunces } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Terramax Developments",
  description: "Terramax Developments buys, renovates, and delivers quality residential properties.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  )
}
