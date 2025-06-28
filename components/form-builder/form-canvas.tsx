"use client"

import { useDroppable } from "@dnd-kit/core"
import { Card, CardContent } from "@/components/ui/card"
import type { FormField } from "@/app/builder/[id]/page"
import { SortableFormField } from "./sortable-form-field"
import { Plus } from "lucide-react"

interface FormCanvasProps {
  fields: FormField[]
  selectedField: FormField | null
  onSelectField: (field: FormField | null) => void
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  onDeleteField: (fieldId: string) => void
}

export function FormCanvas({ fields, selectedField, onSelectField, onUpdateField, onDeleteField }: FormCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "form-canvas",
  })

  // Additional drop zone for better targeting
  const { setNodeRef: setDropZoneRef, isOver: isDropZoneOver } = useDroppable({
    id: "canvas-drop-zone",
  })

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 lg:p-6 flex-1 flex flex-col">
        <div
          ref={setNodeRef}
          className={`flex-1 space-y-4 transition-all duration-200 ${
            isOver || isDropZoneOver ? "bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg p-2" : ""
          }`}
        >
          {fields.length === 0 ? (
            <div
              ref={setDropZoneRef}
              className={`flex flex-col items-center justify-center h-64 lg:h-96 text-center transition-all duration-200 rounded-lg ${
                isOver || isDropZoneOver
                  ? "bg-blue-100 border-2 border-dashed border-blue-500"
                  : "border-2 border-dashed border-gray-200"
              }`}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Form</h3>
              <p className="text-gray-600 max-w-sm text-sm lg:text-base px-4">
                Drag and drop form fields from the {window.innerWidth < 1024 ? "menu" : "left panel"} to start creating
                your form.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <SortableFormField
                  key={field.id}
                  field={field}
                  isSelected={selectedField?.id === field.id}
                  onSelect={() => onSelectField(field)}
                  onUpdate={(updates) => onUpdateField(field.id, updates)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))}
              {/* Additional drop zone at the bottom */}
              <div
                ref={setDropZoneRef}
                className={`h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isOver || isDropZoneOver ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                }`}
              >
                <p className="text-sm text-gray-500">Drop field here to add to form</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
