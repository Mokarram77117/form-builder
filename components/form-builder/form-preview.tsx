"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { FormData } from "@/lib/types"
import { useState } from "react"

interface FormPreviewProps {
  formData: FormData
}

export function FormPreview({ formData }: FormPreviewProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formValues)
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formValues[field.id] || ""}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            required={field.required}
            value={formValues[field.id] || ""}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
          />
        )
      case "select":
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => setFormValues((prev) => ({ ...prev, [field.id]: value }))}
          >
            {(field.options || []).map((option: string, index: number) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            {(field.options || []).map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${index}`}
                  checked={(formValues[field.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const currentValues = formValues[field.id] || []
                    if (checked) {
                      setFormValues((prev) => ({
                        ...prev,
                        [field.id]: [...currentValues, option],
                      }))
                    } else {
                      setFormValues((prev) => ({
                        ...prev,
                        [field.id]: currentValues.filter((v: string) => v !== option),
                      }))
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )
      case "radio":
        return (
          <RadioGroup
            value={formValues[field.id] || ""}
            onValueChange={(value) => setFormValues((prev) => ({ ...prev, [field.id]: value }))}
          >
            {(field.options || []).map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case "date":
        return (
          <Input
            type="date"
            required={field.required}
            value={formValues[field.id] || ""}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
          />
        )
      case "file":
        return (
          <Input
            type="file"
            required={field.required}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.files?.[0] }))}
          />
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-2xl ${
                  (formValues[field.id] || 0) >= star ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
                onClick={() => setFormValues((prev) => ({ ...prev, [field.id]: star }))}
              >
                ★
              </button>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{formData.title}</CardTitle>
        {formData.description && <p className="text-gray-600">{formData.description}</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.fields.map((field) => (
            <div key={field.id}>
              <Label className="text-sm font-medium mb-2 block">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}

          {formData.fields.length > 0 && (
            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
