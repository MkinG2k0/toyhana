"use client"

import { AuthProvider } from "./auth-provider"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
