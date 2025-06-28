"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, MessageSquare, Star, Users, CreditCard, Calendar, Zap } from "lucide-react"
import Link from "next/link"
import { useAppDispatch } from "@/lib/hooks"
import { createNewForm } from "@/lib/features/formBuilder/formBuilderSlice"

const templates = [
  {
    id: "blank",
    name: "Blank Form",
    description: "Start from scratch with a completely blank form",
    icon: Plus,
    category: "Basic",
    fields: [],
  },
  {
    id: "contact",
    name: "Contact Form",
    description: "Simple contact form with name, email, and message",
    icon: MessageSquare,
    category: "Business",
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email Address", required: true },
      { type: "text", label: "Subject", required: false },
      { type: "textarea", label: "Message", required: true },
    ],
  },
  {
    id: "feedback",
    name: "Feedback Survey",
    description: "Collect customer feedback with ratings and comments",
    icon: Star,
    category: "Survey",
    fields: [
      { type: "text", label: "Name", required: false },
      { type: "email", label: "Email", required: false },
      { type: "rating", label: "Overall Satisfaction", required: true },
      {
        type: "select",
        label: "How did you hear about us?",
        options: ["Google", "Social Media", "Friend", "Advertisement"],
        required: false,
      },
      { type: "textarea", label: "Additional Comments", required: false },
    ],
  },
  {
    id: "registration",
    name: "Event Registration",
    description: "Registration form for events and workshops",
    icon: Calendar,
    category: "Event",
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email Address", required: true },
      { type: "text", label: "Phone Number", required: true },
      {
        type: "select",
        label: "Event Session",
        options: ["Morning Session", "Afternoon Session", "Full Day"],
        required: true,
      },
      {
        type: "checkbox",
        label: "Dietary Restrictions",
        options: ["Vegetarian", "Vegan", "Gluten-Free", "None"],
        required: false,
      },
    ],
  },
  {
    id: "survey",
    name: "Customer Survey",
    description: "Comprehensive survey for market research",
    icon: Users,
    category: "Survey",
    fields: [
      { type: "text", label: "Age", required: false },
      { type: "radio", label: "Gender", options: ["Male", "Female", "Other", "Prefer not to say"], required: false },
      {
        type: "select",
        label: "Income Range",
        options: ["Under $25k", "$25k-$50k", "$50k-$75k", "$75k-$100k", "Over $100k"],
        required: false,
      },
      { type: "rating", label: "Product Satisfaction", required: true },
      { type: "textarea", label: "Suggestions for Improvement", required: false },
    ],
  },
  {
    id: "order",
    name: "Order Form",
    description: "Product order form with payment details",
    icon: CreditCard,
    category: "Business",
    premium: true,
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email Address", required: true },
      { type: "select", label: "Product", options: ["Basic Plan", "Pro Plan", "Enterprise Plan"], required: true },
      { type: "number", label: "Quantity", required: true },
      { type: "textarea", label: "Special Instructions", required: false },
    ],
  },
]

export default function CreateForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

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

  const handleCreateForm = async () => {
    if (!formName.trim() || !selectedTemplate) return

    setIsCreating(true)

    try {
      const template = templates.find((t) => t.id === selectedTemplate)
      const result = await dispatch(
        createNewForm({
          name: formName,
          description: formDescription,
          templateId: selectedTemplate,
          fields: template?.fields || [],
        }),
      ).unwrap()

      // Redirect to form builder
      router.push(`/builder/${result.id}`)
    } catch (error) {
      console.error("Failed to create form:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/forms">
              <Button variant="ghost" size="sm" className="hover:bg-purple-50 hover:text-purple-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Create New Form</h1>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template</h2>
              <p className="text-gray-600">Start with a pre-built template or create a form from scratch</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const Icon = template.icon
                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-purple-500 bg-purple-50"
                        : "hover:border-purple-300"
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                            <Icon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {template.name}
                              {template.premium && (
                                <Badge variant="secondary" className="text-xs">
                                  PRO
                                </Badge>
                              )}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      {template.fields.length > 0 && (
                        <div className="text-xs text-gray-500">
                          {template.fields.length} field{template.fields.length !== 1 ? "s" : ""} included
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Form Details */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Form Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="form-name">Form Name *</Label>
                  <Input
                    id="form-name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter form name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe what this form is for"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {selectedTemplate && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Selected Template</h4>
                    <div className="text-sm text-gray-600">
                      {templates.find((t) => t.id === selectedTemplate)?.name}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateForm}
                  disabled={!formName.trim() || !selectedTemplate || isCreating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Form
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You'll be redirected to the form builder after creation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
