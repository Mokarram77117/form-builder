"use client"

import { useEffect, useCallback } from "react"
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
  type DragOverEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, Smartphone, Monitor, ArrowLeft, Menu, X } from "lucide-react"
import Link from "next/link"
import { FormFieldPalette } from "@/components/form-builder/field-palette"
import { FormCanvas } from "@/components/form-builder/form-canvas"
import { FormPreview } from "@/components/form-builder/form-preview"
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
  updateFormSettings,
  setPreviewMode,
  setActiveTab,
  clearForm,
} from "@/lib/features/formBuilder/formBuilderSlice"
import type { FormField } from "@/lib/types"
import { useState } from "react"

export default function FormBuilder({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch()
  const { currentForm, selectedField, isDirty, saving, loading, error, previewMode, activeTab } = useAppSelector(
    (state) => state.formBuilder,
  )

  const [draggedField, setDraggedField] = useState<FormField | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    dispatch(loadForm(params.id))

    return () => {
      dispatch(clearForm())
    }
  }, [dispatch, params.id])

  // Configure sensors for both mouse and touch with proper activation constraints
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
      console.log("Drag started:", active.id)

      // Check if dragging from palette
      if (typeof active.id === "string" && active.id.startsWith("palette-")) {
        const fieldType = active.id.replace("palette-", "") as FormField["type"]
        const newField: FormField = {
          id: `temp-${Date.now()}`, // Temporary ID for preview
          type: fieldType,
          label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
          required: false,
          placeholder: fieldType === "textarea" ? "Enter your response..." : `Enter ${fieldType}...`,
        }
        setDraggedField(newField)
      } else {
        // Dragging existing field
        const field = currentForm?.fields.find((f) => f.id === active.id)
        if (field) {
          setDraggedField(field)
        }
      }
    },
    [currentForm?.fields],
  )

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Optional: Add visual feedback during drag over
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      console.log("Drag ended:", { active: active.id, over: over?.id })

      setDraggedField(null)

      if (!over || !currentForm) {
        console.log("No drop target or current form")
        return
      }

      // Handle dropping from palette to canvas
      if (typeof active.id === "string" && active.id.startsWith("palette-")) {
        if (over.id === "form-canvas" || over.id === "canvas-drop-zone") {
          const fieldType = active.id.replace("palette-", "") as FormField["type"]
          const newField: FormField = {
            id: generateId(),
            type: fieldType,
            label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
            required: false,
            placeholder: fieldType === "textarea" ? "Enter your response..." : `Enter ${fieldType}...`,
          }

          console.log("Adding new field:", newField)
          dispatch(addField(newField))
          return
        }
      }

      // Handle reordering existing fields
      if (active.id !== over.id && !active.id.toString().startsWith("palette-")) {
        const oldIndex = currentForm.fields.findIndex((field) => field.id === active.id)
        const newIndex = currentForm.fields.findIndex((field) => field.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          console.log("Reordering fields:", { oldIndex, newIndex })
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
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
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
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-sm font-semibold truncate max-w-32">{currentForm.title}</h1>
              <p className="text-xs text-gray-500 truncate max-w-32">{currentForm.description}</p>
              {isDirty && <span className="text-xs text-orange-500">• Unsaved changes</span>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={handleSaveForm} size="sm" disabled={saving || !isDirty}>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>

              <div className="flex flex-col">
                <Input
                  value={currentForm.title}
                  onChange={(e) => dispatch(updateFormTitle(e.target.value))}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                />
                <Input
                  value={currentForm.description}
                  onChange={(e) => dispatch(updateFormDescription(e.target.value))}
                  className="text-sm text-gray-600 border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                />
                {isDirty && <span className="text-xs text-orange-500">• Unsaved changes</span>}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => dispatch(setPreviewMode("desktop"))}
                  className="p-2"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => dispatch(setPreviewMode("mobile"))}
                  className="p-2"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>

              <Button onClick={handleSaveForm} size="sm" disabled={saving || !isDirty}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <Tabs value={activeTab} onValueChange={(value) => dispatch(setActiveTab(value as any))} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="mt-0">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {/* Mobile Layout */}
              <div className="lg:hidden">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                  <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
                    <div
                      className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-hidden flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-4 border-b flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Form Fields</h3>
                          <button onClick={() => setSidebarOpen(false)}>
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Long press and drag to add fields</p>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4">
                        <FormFieldPalette />
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Form Canvas with SortableContext */}
                <div className="space-y-4 h-[calc(100vh-140px)] overflow-y-auto">
                  <SortableContext items={currentForm.fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                    <FormCanvas
                      fields={currentForm.fields}
                      selectedField={selectedField}
                      onSelectField={(field) => dispatch(setSelectedField(field))}
                      onUpdateField={handleUpdateField}
                      onDeleteField={handleDeleteField}
                    />
                  </SortableContext>

                  {selectedField && (
                    <Card className="mx-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Field Properties</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <FieldPropertiesPanel
                          field={selectedField}
                          onUpdateField={(updates) => {
                            if (selectedField) {
                              handleUpdateField(selectedField.id, updates)
                            }
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:h-[calc(100vh-200px)]">
                {/* Field Palette */}
                <div className="col-span-3 overflow-y-auto">
                  <FormFieldPalette />
                </div>

                {/* Form Canvas */}
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

                {/* Properties Panel */}
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
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="flex justify-center">
              <div className={previewMode === "mobile" ? "max-w-sm w-full" : "max-w-2xl w-full"}>
                <FormPreview formData={currentForm} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Form Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Allow Multiple Submissions</label>
                      <p className="text-sm text-gray-600">Users can submit this form multiple times</p>
                    </div>
                    <Switch
                      checked={currentForm.settings.allowMultipleSubmissions}
                      onCheckedChange={(checked) => dispatch(updateFormSettings({ allowMultipleSubmissions: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Require Authentication</label>
                      <p className="text-sm text-gray-600">Users must be logged in to submit</p>
                    </div>
                    <Switch
                      checked={currentForm.settings.requireAuth}
                      onCheckedChange={(checked) => dispatch(updateFormSettings({ requireAuth: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Show Progress Bar</label>
                      <p className="text-sm text-gray-600">Display progress indicator for multi-step forms</p>
                    </div>
                    <Switch
                      checked={currentForm.settings.showProgressBar}
                      onCheckedChange={(checked) => dispatch(updateFormSettings({ showProgressBar: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
