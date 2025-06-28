"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { FormField } from "@/app/builder/[id]/page"
import { GripVertical, Trash2, Settings } from "lucide-react"

interface SortableFormFieldProps {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormField>) => void
  onDelete: () => void
}

export function SortableFormField({ field, isSelected, onSelect, onUpdate, onDelete }: SortableFormFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isSorting } = useSortable({
    id: field.id,
    data: {
      type: "form-field",
      field,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
    touchAction: "none",
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            placeholder={field.placeholder}
            type={field.type}
            disabled
            className="pointer-events-none bg-gray-50"
          />
        )
      case "textarea":
        return <Textarea placeholder={field.placeholder} disabled className="pointer-events-none bg-gray-50" />
      case "select":
        return (
          <div className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
            Select an option
          </div>
        )
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox disabled />
            <Label className="text-gray-500">Option 1</Label>
          </div>
        )
      case "radio":
        return (
          <RadioGroup disabled>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" disabled />
              <Label className="text-gray-500">Option 1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" disabled />
              <Label className="text-gray-500">Option 2</Label>
            </div>
          </RadioGroup>
        )
      case "date":
        return <Input type="date" disabled className="pointer-events-none bg-gray-50" />
      case "file":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
            <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          </div>
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-gray-300 text-xl cursor-default">
                ★
              </span>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-4 border rounded-lg transition-all duration-200 select-none ${
        isSelected ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"
      } ${isDragging ? "opacity-60 shadow-xl scale-105 rotate-2 z-50" : ""} ${isSorting ? "z-10" : ""}`}
      onClick={onSelect}
    >
      {/* Drag Handle - More prominent on mobile */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity cursor-grab p-2 hover:bg-gray-100 rounded-md active:bg-gray-200"
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Field Actions */}
      <div className="absolute right-2 top-2 opacity-100 transition-opacity flex space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className="p-2 h-auto hover:bg-blue-100"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Field Content */}
      <div className="pl-12 pr-20">
        <div className="mb-2">
          <Label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
        {renderField()}
      </div>
    </div>
  )
}
