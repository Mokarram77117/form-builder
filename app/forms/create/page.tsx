"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import { useAppDispatch } from "@/lib/hooks"
import { createForm } from "@/lib/features/forms/formsSlice"

const templates = [
  {
    id: "blank",
    name: "Blank Form",
    description: "Start from scratch with a completely blank form",
    icon: "📝",
    category: "basic",
  },
  {
    id: "contact",
    name: "Contact Form",
    description: "Simple contact form with name, email, and message fields",
    icon: "📧",
    category: "basic",
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email Address", required: true },
      { type: "text", label: "Subject", required: true },
      { type: "textarea", label: "Message", required: true },
    ],
  },
  {
    id: "feedback",
    name: "Customer Feedback",
    description: "Collect customer satisfaction ratings and feedback",
    icon: "⭐",
    category: "business",
    fields: [
      { type: "text", label: "Your Name", required: true },
      { type: "email", label: "Email Address", required: true },
      { type: "rating", label: "Overall Satisfaction", required: true },
      { type: "select", label: "Service Used", required: true, options: ["Support", "Sales", "Technical"] },
      { type: "textarea", label: "Additional Comments", required: false },
    ],
  },
  {
    id: "registration",
    name: "Event Registration",
    description: "Register attendees for events and workshops",
    icon: "🎟️",
    category: "events",
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email Address", required: true },
      { type: "text", label: "Company/Organization", required: false },
      { type: "select", label: "Ticket Type", required: true, options: ["Regular", "VIP", "Student"] },
      {
        type: "checkbox",
        label: "Dietary Restrictions",
        required: false,
        options: ["Vegetarian", "Vegan", "Gluten-free", "None"],
      },
    ],
  },
  {
    id: "survey",
    name: "Survey Form",
    description: "Comprehensive survey with multiple question types",
    icon: "📊",
    category: "research",
    fields: [
      { type: "text", label: "Name (Optional)", required: false },
      { type: "radio", label: "Age Group", required: true, options: ["18-25", "26-35", "36-45", "46-55", "55+"] },
      {
        type: "checkbox",
        label: "Interests",
        required: true,
        options: ["Technology", "Sports", "Arts", "Travel", "Food"],
      },
      { type: "rating", label: "Satisfaction Rating", required: true },
      { type: "textarea", label: "Additional Comments", required: false },
    ],
  },
  {
    id: "application",
    name: "Job Application",
    description: "Professional job application form",
    icon: "💼",
    category: "hr",
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email Address", required: true },
      { type: "text", label: "Phone Number", required: true },
      { type: "text", label: "Position Applied For", required: true },
      { type: "file", label: "Resume/CV", required: true },
      { type: "textarea", label: "Cover Letter", required: false },
    ],
  },
]

export default function CreateFormPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateForm = async () => {
    if (!formName.trim()) return

    setIsCreating(true)

    try {
      const template = templates.find((t) => t.id === selectedTemplate)

      const formData = {
        name: formName,
        description: formDescription,
        fields:
          template?.fields?.map((field, index) => ({
            id: `field_${index + 1}`,
            type: field.type as any,
            label: field.label,
            required: field.required,
            placeholder: field.type === "textarea" ? "Enter your response..." : `Enter ${field.label.toLowerCase()}...`,
            options: field.options || [],
          })) || [],
        settings: {
          theme: {
            primaryColor: "#8B5CF6",
            backgroundColor: "#FFFFFF",
            fontFamily: "Inter",
          },
          notifications: {},
          allowMultipleSubmissions: true,
          requireAuth: false,
          showProgressBar: false,
          customTheme: "default",
        },
        status: "draft" as const,
      }

      const result = await dispatch(createForm(formData))

      if (result.meta.requestStatus === "fulfilled") {
        const newForm = result.payload as any
        router.push(`/forms/builder/${newForm.id}`)
      }
    } catch (error) {
      console.error("Failed to create form:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = templates.find((t) => t.id === templateId)
    if (template && template.id !== "blank") {
      setFormName(template.name)
      setFormDescription(template.description)
    } else {
      setFormName("")
      setFormDescription("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/forms">
                <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Forms
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Create New Form</h1>
                <p className="text-sm text-gray-600">Choose a template or start from scratch</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-8">
        {/* Template Selection */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Choose a Template
            </CardTitle>
            <p className="text-gray-600">
              Select a template to get started quickly, or choose blank to build from scratch
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedTemplate === template.id
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      {template.fields && (
                        <p className="text-xs text-purple-600 mt-2">{template.fields.length} fields included</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Details */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-xl">Form Details</CardTitle>
            <p className="text-gray-600">Provide basic information about your form</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="form-name">Form Name *</Label>
              <Input
                id="form-name"
                placeholder="Enter form name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                placeholder="Describe what this form is for (optional)"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm text-gray-600">
                  {selectedTemplate ? (
                    <>
                      Selected template:{" "}
                      <span className="font-medium">{templates.find((t) => t.id === selectedTemplate)?.name}</span>
                    </>
                  ) : (
                    "No template selected"
                  )}
                </p>
              </div>
              <Button
                onClick={handleCreateForm}
                disabled={!formName.trim() || isCreating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreating ? "Creating..." : "Create Form"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
