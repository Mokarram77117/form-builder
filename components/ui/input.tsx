import type React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "underlined"
  error?: boolean
}

export function Input({ className, variant = "default", error, ...props }: InputProps) {
  const variants = {
    default: "border border-input bg-background focus:border-primary focus:ring-primary/20",
    filled: "border-0 bg-muted focus:bg-background focus:ring-primary/20",
    underlined: "border-0 border-b-2 border-input bg-transparent focus:border-primary rounded-none",
  }

  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl px-4 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-foreground",
        variants[variant],
        error && "border-destructive focus:border-destructive focus:ring-destructive/20",
        className,
      )}
      {...props}
    />
  )
}
