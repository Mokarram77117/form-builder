"use client"

import { useEffect, useCallback, useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  closestCenter,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { FormFieldPalette } from "@/components/form-builder/field-palette"
import { FormCanvas } from "@/components/form-builder/form-canvas"
import { FieldPropertiesPanel } from "@/components/form-builder/field-properties-panel"
import { generateId } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import {
  loadForm,
  saveForm,
  updateFormTitle,
  updateFormDescription,
  addField,
  updateField,
  deleteField,
  reorderFields,
  setSelectedField,
  clearForm,
} from "@/lib/features/formBuilder/formBuilderSlice"
import type { FormField } from "@/lib/types"

export default function FormBuilder({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch()
  const { currentForm, selectedField, isDirty, saving, loading, error } = useAppSelector((state) => state.formBuilder)

  const [draggedField, setDraggedField] = useState<FormField | null>(null)

  useEffect(() => {
    dispatch(loadForm(params.id))

    return () => {
      dispatch(clearForm())
    }
  }, [dispatch, params.id])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  )

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event

      if (typeof active.id === "string" && active.id.startsWith("palette-")) {
        const fieldType = active.id.replace("palette-", "") as FormField["type"]
        const newField: FormField = {
          id: `temp-${Date.now()}`,
          type: fieldType,
          label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
          required: false,
          placeholder: `Enter ${fieldType}...`,
        }
        setDraggedField(newField)
      } else {
        const field = currentForm?.fields.find((f) => f.id === active.id)
        if (field) {
          setDraggedField(field)
        }
      }
    },
    [currentForm?.fields],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      setDraggedField(null)

      if (!over || !currentForm) {
        return
      }

      if (typeof active.id === "string" && active.id.startsWith("palette-")) {
        if (over.id === "form-canvas" || over.id === "canvas-drop-zone") {
          const fieldType = active.id.replace("palette-", "") as FormField["type"]
          const newField: FormField = {
            id: generateId(),
            type: fieldType,
            label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
            required: false,
            placeholder: `Enter ${fieldType}...`,
          }

          dispatch(addField(newField))
          return
        }
      }

      if (active.id !== over.id && !active.id.toString().startsWith("palette-")) {
        const oldIndex = currentForm.fields.findIndex((field) => field.id === active.id)
        const newIndex = currentForm.fields.findIndex((field) => field.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch(reorderFields({ oldIndex, newIndex }))
        }
      }
    },
    [currentForm, dispatch],
  )

  const handleUpdateField = useCallback(
    (fieldId: string, updates: Partial<FormField>) => {
      dispatch(updateField({ id: fieldId, updates }))
    },
    [dispatch],
  )

  const handleDeleteField = useCallback(
    (fieldId: string) => {
      dispatch(deleteField(fieldId))
    },
    [dispatch],
  )

  const handleSaveForm = useCallback(async () => {
    if (currentForm) {
      dispatch(saveForm(currentForm))
    }
  }, [currentForm, dispatch])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form builder...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/forms">
            <Button>Back to Forms</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!currentForm) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/forms">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>

              <div className="flex flex-col">
                <Input
                  value={currentForm.name}
                  onChange={(e) => dispatch(updateFormTitle(e.target.value))}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                  placeholder="Form Name"
                />
                <Input
                  value={currentForm.description}
                  onChange={(e) => dispatch(updateFormDescription(e.target.value))}
                  className="text-sm text-gray-600 border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                  placeholder="Form Description"
                />
                {isDirty && (
                  <Badge variant="secondary" className="w-fit mt-1">
                    Unsaved changes
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link href={`/forms/${currentForm.id}/preview`}>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </Link>

              <Button onClick={handleSaveForm} size="sm" disabled={saving || !isDirty}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>

              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Left Panel - Field Palette */}
            <div className="col-span-3 overflow-y-auto">
              <FormFieldPalette />
            </div>

            {/* Center Panel - Form Canvas */}
            <div className="col-span-6 overflow-y-auto">
              <SortableContext items={currentForm.fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                <FormCanvas
                  fields={currentForm.fields}
                  selectedField={selectedField}
                  onSelectField={(field) => dispatch(setSelectedField(field))}
                  onUpdateField={handleUpdateField}
                  onDeleteField={handleDeleteField}
                />
              </SortableContext>
            </div>

            {/* Right Panel - Field Properties */}
            <div className="col-span-3 overflow-y-auto">
              <FieldPropertiesPanel
                field={selectedField}
                onUpdateField={(updates) => {
                  if (selectedField) {
                    handleUpdateField(selectedField.id, updates)
                  }
                }}
              />
            </div>
          </div>

          <DragOverlay>
            {draggedField && (
              <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-blue-500 opacity-90 transform rotate-3 scale-105 pointer-events-none">
                <div className="text-sm font-medium text-gray-900">{draggedField.label}</div>
                <div className="text-xs text-gray-500 mt-1">{draggedField.type}</div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
