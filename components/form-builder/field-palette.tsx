"use client"

import { useDraggable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Type, Mail, ChevronDown, CheckSquare, Star, Upload } from "lucide-react"

const fieldTypes = [
  { type: "text", label: "Short Text", icon: Type, description: "Single line text input" },
  { type: "email", label: "Email", icon: Mail, description: "Email address field" },
  { type: "dropdown", label: "Dropdown", icon: ChevronDown, description: "Select from options" },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare, description: "Multiple choice selection" },
  { type: "rating", label: "Rating", icon: Star, description: "Star rating field" },
  { type: "file", label: "File Upload", icon: Upload, description: "File attachment field" },
]

function DraggableField({ type, label, icon: Icon, description }: (typeof fieldTypes)[0]) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: "palette-field",
      fieldType: type,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 border border-gray-200 rounded-lg cursor-grab hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 select-none ${
        isDragging ? "opacity-50 shadow-lg scale-105 z-50" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-center space-x-3 pointer-events-none">
        <div className="p-2 bg-gray-100 rounded-md flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function FormFieldPalette() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Form Fields</CardTitle>
        <p className="text-sm text-gray-600">Drag fields to add them to your form</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fieldTypes.map((field) => (
            <DraggableField key={field.type} {...field} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
