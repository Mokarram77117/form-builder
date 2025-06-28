"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  children: React.ReactNode
  disabled?: boolean
  required?: boolean
}

export function Select({ value, onValueChange, placeholder, children, disabled, required }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        required={required}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder || "Select an option"}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: () => {
                  onValueChange?.(child.props.value)
                  setIsOpen(false)
                },
              })
            }
            return child
          })}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  onClick?: () => void
}

export function SelectItem({ value, children, onClick }: SelectItemProps) {
  return (
    <div
      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
      onClick={onClick}
    >
      {children}
    </div>
  )
}
