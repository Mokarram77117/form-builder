"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle } from "lucide-react"

// Mock form data for public access
const mockPublicForm = {
  id: "1",
  name: "Customer Feedback Survey",
  description: "Help us improve our services by sharing your feedback",
  fields: [
    {
      id: "name",
      type: "text" as const,
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "email",
      type: "email" as const,
      label: "Email Address",
      placeholder: "Enter your email",
      required: true,
    },
    {
      id: "rating",
      type: "rating" as const,
      label: "Overall Satisfaction",
      required: true,
    },
    {
      id: "service",
      type: "dropdown" as const,
      label: "Which service did you use?",
      required: true,
      options: ["Customer Support", "Product Demo", "Technical Support", "Sales Inquiry"],
    },
    {
      id: "recommend",
      type: "checkbox" as const,
      label: "What did you like most?",
      required: false,
      options: ["Easy to use", "Fast response", "Helpful staff", "Good pricing", "Quality service"],
    },
  ],
  settings: {
    theme: {
      primaryColor: "#3B82F6",
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter",
    },
  },
}

export default function PublicForm({ params }: { params: { id: string } }) {
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            value={formValues[field.id] || ""}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
            style={{ borderColor: mockPublicForm.settings.theme.primaryColor }}
          />
        )
      case "dropdown":
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
              >
                ★
              </button>
            ))}
          </div>
        )
      case "file":
        return (
          <Input
            type="file"
            required={field.required}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.files?.[0] }))}
          />
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
          backgroundColor: mockPublicForm.settings.theme.backgroundColor,
          fontFamily: mockPublicForm.settings.theme.fontFamily,
        }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${mockPublicForm.settings.theme.primaryColor}20` }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: mockPublicForm.settings.theme.primaryColor }} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your response has been submitted successfully. We appreciate your feedback!</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: mockPublicForm.settings.theme.backgroundColor,
        fontFamily: mockPublicForm.settings.theme.fontFamily,
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle
              className="text-xl lg:text-2xl font-bold"
              style={{ color: mockPublicForm.settings.theme.primaryColor }}
            >
              {mockPublicForm.name}
            </CardTitle>
            {mockPublicForm.description && <p className="text-gray-600 mt-2">{mockPublicForm.description}</p>}
          </CardHeader>
          <CardContent className="p-4 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {mockPublicForm.fields.map((field, index) => (
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
                  className="w-full"
                  disabled={isSubmitting}
                  size="lg"
                  style={{ backgroundColor: mockPublicForm.settings.theme.primaryColor }}
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
