"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child, {
              onClick: () => setIsOpen(!isOpen),
              isOpen,
            })
          }
          if (child.type === DropdownMenuContent) {
            return isOpen
              ? React.cloneElement(child, {
                  onClose: () => setIsOpen(false),
                  isOpen,
                })
              : null
          }
        }
        return child
      })}
    </div>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  onClick?: () => void
  asChild?: boolean
  isOpen?: boolean
}

export function DropdownMenuTrigger({ children, onClick, asChild, isOpen }: DropdownMenuTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick,
      "aria-expanded": isOpen,
      "data-state": isOpen ? "open" : "closed",
    })
  }

  return (
    <button
      onClick={onClick}
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
      className="inline-flex items-center justify-center"
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: "start" | "end"
  onClose?: () => void
  className?: string
  isOpen?: boolean
}

export function DropdownMenuContent({
  children,
  align = "start",
  onClose,
  className,
  isOpen,
}: DropdownMenuContentProps) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95",
        align === "end" ? "right-0" : "left-0",
        "top-full mt-1",
        className,
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
