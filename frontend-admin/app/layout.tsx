import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AppThemeProvider } from "@/lib/theme-context"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { TrackingWrapper } from "@/components/tracking-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "Movie in the Park - Cinéma en Plein Air",
  description:
    "Vivez le cinéma autrement sous les étoiles. Découvrez notre événement premium de cinéma en plein air à Yaoundé.",
  generator: "Movie",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/apple-icon.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#0E0520] text-[#F9F5FF]">
        <AppThemeProvider>
          <TrackingWrapper>
            {children}
            <ScrollToTopButton />
            <Analytics />
          </TrackingWrapper>
        </AppThemeProvider>
      </body>
    </html>
  )
}
