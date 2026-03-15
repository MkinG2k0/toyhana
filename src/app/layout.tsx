import { Golos_Text, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/providers"
import "./globals.css"

import type { Metadata } from "next"

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Тойхана — Банкетные залы Махачкалы и Дагестана",
    template: "%s | Тойхана",
  },
  description:
    "Найдите идеальный банкетный зал для свадьбы, помолвки или мероприятия в Махачкале. Реальные цены, отзывы, бронирование онлайн.",
  keywords: [
    "банкетный зал",
    "свадебный зал",
    "Махачкала",
    "Дагестан",
    "тойхана",
    "бронирование зала",
    "свадьба",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVariables = `${golosText.variable} ${playfairDisplay.variable}`

  return (
    <html lang="ru" className={fontVariables} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  )
}
