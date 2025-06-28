import type React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "success" | "warning" | "gradient"
  size?: "sm" | "md" | "lg" | "xl"
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  className,
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg",
    success: "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-lg",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 shadow-lg",
    gradient: "gradient-primary text-white hover:shadow-lg hover:scale-105 shadow-lg",
  }

  const sizes = {
    sm: "px-3 py-2 text-sm h-9",
    md: "px-4 py-2.5 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    xl: "px-8 py-4 text-lg h-14",
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  )
}
