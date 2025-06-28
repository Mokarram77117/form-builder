"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type ColorTheme = "blue" | "green" | "purple" | "red" | "orange" | "indigo"

interface ThemeContextType {
  theme: Theme
  colorTheme: ColorTheme
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light")
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme

    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Check system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      setTheme(systemTheme)
    }

    if (savedColorTheme) {
      setColorTheme(savedColorTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")
    root.classList.remove("theme-blue", "theme-green", "theme-purple", "theme-red", "theme-orange", "theme-indigo")

    // Add new theme classes
    root.classList.add(theme)
    root.classList.add(`theme-${colorTheme}`)

    // Save to localStorage
    localStorage.setItem("theme", theme)
    localStorage.setItem("colorTheme", colorTheme)
  }, [theme, colorTheme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, setTheme, setColorTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
