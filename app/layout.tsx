import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Sidebar } from "@/components/layout/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FormPilot Pro - Professional Form Builder with Workflow Automation",
  description:
    "Create, manage, and automate forms with advanced workflow capabilities. Perfect for businesses and developers.",
  keywords: ["form builder", "workflow automation", "drag and drop", "forms", "submissions"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ReduxProvider>
            <Sidebar>{children}</Sidebar>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
