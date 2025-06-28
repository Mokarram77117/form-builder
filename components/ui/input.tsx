import type React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "underlined"
  error?: boolean
}

export function Input({ className, variant = "default", error, ...props }: InputProps) {
  const variants = {
    default: "border border-gray-200 bg-white focus:border-purple-500 focus:ring-purple-500/20",
    filled: "border-0 bg-gray-50 focus:bg-white focus:ring-purple-500/20",
    underlined: "border-0 border-b-2 border-gray-200 bg-transparent focus:border-purple-500 rounded-none",
  }

  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl px-4 py-2 text-sm transition-all duration-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className,
      )}
      {...props}
    />
  )
}
