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
import { useTheme } from "@/components/providers/theme-provider"

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
  const { colorTheme } = useTheme()

  const defaultTheme = {
    primaryColor: getThemeColor(colorTheme),
    backgroundColor: "transparent",
    fontFamily: "Inter",
    ...theme,
  }

  function getThemeColor(theme: string) {
    const colors = {
      blue: "#3b82f6",
      green: "#22c55e",
      purple: "#a855f7",
      red: "#ef4444",
      orange: "#f97316",
      indigo: "#6366f1",
    }
    return colors[theme as keyof typeof colors] || colors.blue
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
            className="focus:border-primary focus:ring-primary/20"
          />
        )
      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder}
            required={field.required}
            value={formValues[field.id] || ""}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
            className="focus:border-primary focus:ring-primary/20"
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
                <RadioGroupItem value={option} id={`${field.id}-${index}`} />
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
            className="focus:border-primary focus:ring-primary/20"
          />
        )
      case "file":
        return (
          <Input
            type="file"
            required={field.required}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.files?.[0] }))}
            className="focus:border-primary focus:ring-primary/20"
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
                  (formValues[field.id] || 0) >= star ? "text-primary" : "text-muted-foreground"
                } hover:text-primary`}
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground">Your response has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-2xl mx-auto">
        {/* Logo space */}
        {defaultTheme.logo && (
          <div className="text-center mb-8">
            <img src={defaultTheme.logo || "/placeholder.svg"} alt="Logo" className="h-12 mx-auto" />
          </div>
        )}

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl lg:text-2xl font-bold text-primary">{formData.name}</CardTitle>
            {formData.description && <p className="text-muted-foreground mt-2">{formData.description}</p>}
          </CardHeader>
          <CardContent className="p-4 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {formData.fields.map((field, index) => (
                <div key={field.id} className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}

              <div className="pt-6">
                <Button type="submit" className="w-full" disabled={isSubmitting} size="lg" variant="gradient">
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
