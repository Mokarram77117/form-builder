"use client"

import { useState } from "react"
import { Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/components/providers/theme-provider"

const colorThemes = [
  { name: "Blue", value: "blue", color: "bg-blue-600" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Purple", value: "purple", color: "bg-purple-600" },
  { name: "Red", value: "red", color: "bg-red-600" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Indigo", value: "indigo", color: "bg-indigo-600" },
] as const

interface ColorThemeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function ColorThemeSelector({ isOpen, onClose }: ColorThemeSelectorProps) {
  const { colorTheme, setColorTheme } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Card className="w-80 bg-white dark:bg-gray-800 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Choose Color Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => {
                    setColorTheme(theme.value)
                    onClose()
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full ${theme.color} flex items-center justify-center`}>
                    {colorTheme === theme.value && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{theme.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function ColorThemeButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="w-9 h-9 p-0">
        <Palette className="h-4 w-4" />
        <span className="sr-only">Choose color theme</span>
      </Button>
      <ColorThemeSelector isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
