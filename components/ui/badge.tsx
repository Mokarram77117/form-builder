import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "success" | "warning" | "gradient" | "outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function Badge({ className, variant = "default", size = "md", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    secondary: "bg-blue-100 text-blue-800 border border-blue-200",
    destructive: "bg-red-100 text-red-800 border border-red-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    gradient: "gradient-primary text-white border-0 shadow-md",
    outline: "bg-transparent border-2 border-purple-200 text-purple-700",
  }

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-all duration-200",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
