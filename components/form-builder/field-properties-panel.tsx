"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { FormField } from "@/lib/types"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface FieldPropertiesPanelProps {
  field: FormField | null
  onUpdateField: (updates: Partial<FormField>) => void
}

export function FieldPropertiesPanel({ field, onUpdateField }: FieldPropertiesPanelProps) {
  const [newOption, setNewOption] = useState("")

  if (!field) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-lg">Field Properties</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Select a field to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const addOption = () => {
    if (newOption.trim()) {
      const currentOptions = field.options || []
      onUpdateField({
        options: [...currentOptions, newOption.trim()],
      })
      setNewOption("")
    }
  }

  const removeOption = (index: number) => {
    const currentOptions = field.options || []
    onUpdateField({
      options: currentOptions.filter((_, i) => i !== index),
    })
  }

  const updateOption = (index: number, value: string) => {
    const currentOptions = field.options || []
    const newOptions = [...currentOptions]
    newOptions[index] = value
    onUpdateField({ options: newOptions })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">Field Properties</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {/* Basic Properties */}
        <div>
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => onUpdateField({ label: e.target.value })}
            placeholder="Field label"
          />
        </div>

        <div>
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder || ""}
            onChange={(e) => onUpdateField({ placeholder: e.target.value })}
            placeholder="Placeholder text"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="field-required">Required</Label>
          <Switch
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) => onUpdateField({ required: checked })}
          />
        </div>

        {/* Options for select, checkbox, radio */}
        {(field.type === "select" || field.type === "checkbox" || field.type === "radio") && (
          <div>
            <Label>Options</Label>
            <div className="space-y-2 mt-2">
              {(field.options || []).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeOption(index)} className="p-2 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  onKeyPress={(e) => e.key === "Enter" && addOption()}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm" onClick={addOption} className="p-2 flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Validation for number fields */}
        {field.type === "number" && (
          <div className="space-y-3">
            <Label>Validation</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-value" className="text-xs">
                  Min Value
                </Label>
                <Input
                  id="min-value"
                  type="number"
                  value={field.validation?.min || ""}
                  onChange={(e) =>
                    onUpdateField({
                      validation: {
                        ...field.validation,
                        min: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="Min"
                />
              </div>
              <div>
                <Label htmlFor="max-value" className="text-xs">
                  Max Value
                </Label>
                <Input
                  id="max-value"
                  type="number"
                  value={field.validation?.max || ""}
                  onChange={(e) =>
                    onUpdateField({
                      validation: {
                        ...field.validation,
                        max: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        )}

        {/* Character limits for text fields */}
        {(field.type === "text" || field.type === "textarea") && (
          <div className="space-y-3">
            <Label>Character Limits</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="min-length" className="text-xs">
                  Min Length
                </Label>
                <Input
                  id="min-length"
                  type="number"
                  value={field.validation?.min || ""}
                  onChange={(e) =>
                    onUpdateField({
                      validation: {
                        ...field.validation,
                        min: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="Min"
                />
              </div>
              <div>
                <Label htmlFor="max-length" className="text-xs">
                  Max Length
                </Label>
                <Input
                  id="max-length"
                  type="number"
                  value={field.validation?.max || ""}
                  onChange={(e) =>
                    onUpdateField({
                      validation: {
                        ...field.validation,
                        max: e.target.value ? Number.parseInt(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
