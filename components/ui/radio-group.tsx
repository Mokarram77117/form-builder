"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { cn } from "@/lib/utils"

interface RadioGroupContextType {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}

const RadioGroupContext = createContext<RadioGroupContextType>({})

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function RadioGroup({ value, onValueChange, disabled, children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <div className={cn("grid gap-2", className)} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps {
  value: string
  id?: string
  disabled?: boolean
  className?: string
}

export function RadioGroupItem({ value, id, disabled, className }: RadioGroupItemProps) {
  const { value: groupValue, onValueChange, disabled: groupDisabled } = useContext(RadioGroupContext)
  const isChecked = groupValue === value
  const isDisabled = disabled || groupDisabled

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      id={id}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-gray-300 text-blue-600 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isChecked && "border-blue-600",
        className,
      )}
      onClick={() => !isDisabled && onValueChange?.(value)}
      disabled={isDisabled}
    >
      {isChecked && (
        <div className="flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-blue-600" />
        </div>
      )}
    </button>
  )
}
