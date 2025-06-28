"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, Smartphone, Monitor, Plus } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loadForm } from "@/lib/features/formBuilder/formBuilderSlice"

export default function FormPreview({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch()
  const { currentForm, loading } = useAppSelector((state) => state.formBuilder)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

  useEffect(() => {
    if (params.id !== "new") {
      dispatch(loadForm(params.id))
    }
  }, [dispatch, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
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
            style={{ borderColor: currentForm?.settings.theme.primaryColor }}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form preview...</p>
        </div>
      </div>
    )
  }

  if (!currentForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Form not found or no fields added yet</p>
          <Link href={`/forms/builder/${params.id}`}>
            <Button>Back to Builder</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: currentForm.settings.theme.backgroundColor,
          fontFamily: currentForm.settings.theme.fontFamily,
        }}
      >
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${currentForm.settings.theme.primaryColor}20` }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: currentForm.settings.theme.primaryColor }} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your response has been submitted successfully.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/forms/builder/${params.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Builder
              </Button>
            </Link>

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
      </header>

      {/* Form Preview */}
      <div
        className="py-8 px-4"
        style={{
          backgroundColor: currentForm.settings.theme.backgroundColor,
          fontFamily: currentForm.settings.theme.fontFamily,
        }}
      >
        <div className={`mx-auto ${previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"}`}>
          <Card>
            <CardHeader className="text-center">
              {currentForm.settings.theme.logo && (
                <div className="mb-4">
                  <img
                    src={currentForm.settings.theme.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="h-12 mx-auto"
                  />
                </div>
              )}
              <CardTitle
                className="text-xl lg:text-2xl font-bold"
                style={{ color: currentForm.settings.theme.primaryColor }}
              >
                {currentForm.name}
              </CardTitle>
              {currentForm.description && <p className="text-gray-600 mt-2">{currentForm.description}</p>}
            </CardHeader>
            <CardContent className="p-4 lg:p-8">
              {currentForm.fields.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No fields added yet</h3>
                  <p className="text-gray-600 mb-4">Add some fields to your form to see the preview</p>
                  <Link href={`/forms/builder/${params.id}`}>
                    <Button>Add Fields</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                  {currentForm.fields.map((field, index) => (
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
                      style={{ backgroundColor: currentForm.settings.theme.primaryColor }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Form"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
