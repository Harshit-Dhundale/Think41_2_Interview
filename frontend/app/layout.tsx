// app/layout.tsx
import './globals.css'
import { GeistSans, GeistMono } from 'geist/font'

export const metadata = {
  title: 'E-commerce customer support chatbot',
  description: 'E-commerce customer support chatbot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body>{children}</body>
    </html>
  )
}
