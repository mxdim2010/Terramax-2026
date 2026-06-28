import type { Metadata } from "next"
import { Oswald, Source_Sans_3 } from "next/font/google"

import "./globals.css"

const fontDisplay = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

const fontBody = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "TerraMax Developments | Property Renovation and Acquisition",
  description:
    "TerraMax Developments acquires and renovates residential properties with fast offers, quality construction, and strong market outcomes.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fontDisplay.variable} ${fontBody.variable}`}>{children}</body>
    </html>
  )
}
