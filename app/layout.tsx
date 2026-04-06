import type { Metadata } from 'next'
import { Geist, Geist_Mono, Cormorant_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});
const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant'
});

export const metadata: Metadata = {
  title: 'Happy Birthday Diksha Jangra',
  description: 'A digital celebration of friendship',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js" defer />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
