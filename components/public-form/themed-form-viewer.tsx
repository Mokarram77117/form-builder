"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"
import type { FormData } from "@/lib/types"

interface ThemedFormViewerProps {
  formData: FormData
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    fontFamily?: string
    logo?: string
  }
}

export function ThemedFormViewer({ formData, theme }: ThemedFormViewerProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultTheme = {
    primaryColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
    ...theme,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Form submitted:", formValues)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const renderField = (field: any) => {
    const fieldStyle = {
      borderColor: defaultTheme.primaryColor,
      focusRingColor: defaultTheme.primaryColor,
    }

    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "phone":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formValues[field.id] || ""}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
            className="border-gray-200 focus:border-current focus:ring-current"
            style={{
              "--tw-ring-color": `${defaultTheme.primaryColor}20`,
              borderColor: formValues[field.id] ? defaultTheme.primaryColor : undefined,
            }}
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            required={field.required}
            value={formValues[field.id] || ""}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
            className="border-gray-200 focus:border-current focus:ring-current"
            style={{
              "--tw-ring-color": `${defaultTheme.primaryColor}20`,
              borderColor: formValues[field.id] ? defaultTheme.primaryColor : undefined,
            }}
            rows={4}
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
          <div className="space-y-3">
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
                  style={{ accentColor: defaultTheme.primaryColor }}
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )
      case "radio":
        return (
          <RadioGroup
            value={formValues[field.id] || ""}
            onValueChange={(value) => setFormValues((prev) => ({ ...prev, [field.id]: value }))}
            className="space-y-3"
          >
            {(field.options || []).map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`${field.id}-${index}`}
                  style={{ accentColor: defaultTheme.primaryColor }}
                />
                <Label htmlFor={`${field.id}-${index}`} className="text-sm font-normal">
                  {option}
                </Label>
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
            className="border-gray-200 focus:border-current focus:ring-current"
            style={{
              "--tw-ring-color": `${defaultTheme.primaryColor}20`,
              borderColor: formValues[field.id] ? defaultTheme.primaryColor : undefined,
            }}
          />
        )
      case "file":
        return (
          <Input
            type="file"
            required={field.required}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.files?.[0] }))}
            className="border-gray-200 focus:border-current focus:ring-current"
          />
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-3xl transition-colors ${
                  (formValues[field.id] || 0) >= star ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400`}
                onClick={() => setFormValues((prev) => ({ ...prev, [field.id]: star }))}
                style={{
                  color: (formValues[field.id] || 0) >= star ? defaultTheme.primaryColor : undefined,
                }}
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

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: defaultTheme.backgroundColor,
          fontFamily: defaultTheme.fontFamily,
        }}
      >
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${defaultTheme.primaryColor}20` }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: defaultTheme.primaryColor }} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your response has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: defaultTheme.backgroundColor,
        fontFamily: defaultTheme.fontFamily,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Logo space */}
        {defaultTheme.logo && (
          <div className="text-center mb-8">
            <img src={defaultTheme.logo || "/placeholder.svg"} alt="Logo" className="h-12 mx-auto" />
          </div>
        )}

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl lg:text-2xl font-bold" style={{ color: defaultTheme.primaryColor }}>
              {formData.name}
            </CardTitle>
            {formData.description && <p className="text-gray-600 mt-2">{formData.description}</p>}
          </CardHeader>
          <CardContent className="p-4 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {formData.fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full text-white border-0"
                  disabled={isSubmitting}
                  size="lg"
                  style={{
                    backgroundColor: defaultTheme.primaryColor,
                    boxShadow: `0 4px 14px 0 ${defaultTheme.primaryColor}40`,
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
