import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Marcus Vale — 1-on-1 Futures Trading Mentorship',
  description: 'Build a repeatable futures trading process with private mentorship from Marcus Vale.',
  metadataBase: new URL('https://marcusvale.example'),
  openGraph: {
    title: 'Marcus Vale — 1-on-1 Futures Trading Mentorship',
    description: 'Build a repeatable futures trading process with private mentorship from Marcus Vale.',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111311',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
