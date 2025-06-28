"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectItem } from "@/components/ui/select"
import { Star, ArrowLeft, Smartphone, Monitor } from "lucide-react"
import Link from "next/link"

// Mock form data - in real app this would come from API
const mockForm = {
  id: "1",
  title: "Customer Feedback Survey",
  description: "Help us improve our services by sharing your feedback",
  fields: [
    {
      id: "1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      id: "2",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      required: true,
    },
    {
      id: "3",
      type: "select",
      label: "How did you hear about us?",
      placeholder: "Select an option",
      required: false,
      options: ["Google Search", "Social Media", "Friend Referral", "Advertisement"],
    },
    {
      id: "4",
      type: "radio",
      label: "Overall Satisfaction",
      required: true,
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    },
    {
      id: "5",
      type: "checkbox",
      label: "Which services have you used?",
      required: false,
      options: ["Customer Support", "Product Demo", "Training", "Consulting"],
    },
    {
      id: "6",
      type: "rating",
      label: "Rate our service",
      required: true,
    },
    {
      id: "7",
      type: "textarea",
      label: "Additional Comments",
      placeholder: "Share any additional feedback...",
      required: false,
    },
  ],
  settings: {
    theme: {
      primaryColor: "#8B5CF6",
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter",
    },
  },
}

export default function FormPreview({ params }: { params: { id: string } }) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [rating, setRating] = useState(0)

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const renderField = (field: any) => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              rows={4}
            />
          </div>
        )

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              {field.options?.map((option: string, index: number) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          </div>
        )

      case "radio":
        return (
          <div key={field.id} className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup value={formData[field.id] || ""} onValueChange={(value) => handleInputChange(field.id, value)}>
              {field.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "checkbox":
        return (
          <div key={field.id} className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${index}`}
                    checked={(formData[field.id] || []).includes(option)}
                    onCheckedChange={(checked) => {
                      const currentValues = formData[field.id] || []
                      if (checked) {
                        handleInputChange(field.id, [...currentValues, option])
                      } else {
                        handleInputChange(
                          field.id,
                          currentValues.filter((v: string) => v !== option),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          </div>
        )

      case "rating":
        return (
          <div key={field.id} className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star)
                    handleInputChange(field.id, star)
                  }}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (formData[field.id] || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your response has been submitted successfully.</p>
            <Button onClick={() => setSubmitted(false)} variant="outline">
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/forms/${params.id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Form
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{mockForm.title}</h1>
                <p className="text-sm text-gray-600">Form Preview</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="p-2"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="p-2"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Form Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className={previewMode === "mobile" ? "max-w-sm w-full" : "max-w-2xl w-full"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">{mockForm.title}</CardTitle>
                <p className="text-gray-600">{mockForm.description}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mockForm.fields.map(renderField)}

                  <div className="pt-6 border-t">
                    <Button
                      type="submit"
                      className="w-full"
                      style={{ backgroundColor: mockForm.settings.theme.primaryColor }}
                    >
                      Submit Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
