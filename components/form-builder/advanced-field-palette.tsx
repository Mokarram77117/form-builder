"use client"

import { useDraggable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Type,
  Mail,
  ChevronDown,
  CheckSquare,
  Star,
  Upload,
  Hash,
  Calendar,
  Clock,
  Phone,
  Link,
  Palette,
  ToggleLeft,
  FileText,
  Eye,
  EyeOff,
  MapPin,
  CreditCard,
  FilePenLineIcon as Signature,
  ImageIcon,
  Video,
  Mic,
  QrCode,
  Calculator,
  Zap,
} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const basicFields = [
  { type: "text", label: "Short Text", icon: Type, description: "Single line text input", category: "basic" },
  { type: "textarea", label: "Long Text", icon: FileText, description: "Multi-line text area", category: "basic" },
  { type: "email", label: "Email", icon: Mail, description: "Email address field", category: "basic" },
  { type: "number", label: "Number", icon: Hash, description: "Numeric input field", category: "basic" },
  { type: "phone", label: "Phone", icon: Phone, description: "Phone number field", category: "basic" },
  { type: "url", label: "Website URL", icon: Link, description: "URL input field", category: "basic" },
]

const choiceFields = [
  { type: "select", label: "Dropdown", icon: ChevronDown, description: "Select from options", category: "choice" },
  { type: "radio", label: "Multiple Choice", icon: CheckSquare, description: "Single selection", category: "choice" },
  { type: "checkbox", label: "Checkboxes", icon: CheckSquare, description: "Multiple selection", category: "choice" },
  { type: "rating", label: "Rating", icon: Star, description: "Star rating field", category: "choice" },
]

const dateTimeFields = [
  { type: "date", label: "Date", icon: Calendar, description: "Date picker", category: "datetime" },
  { type: "time", label: "Time", icon: Clock, description: "Time picker", category: "datetime" },
  { type: "datetime", label: "Date & Time", icon: Calendar, description: "Date and time picker", category: "datetime" },
]

const mediaFields = [
  { type: "file", label: "File Upload", icon: Upload, description: "File attachment field", category: "media" },
  {
    type: "image",
    label: "Image Upload",
    icon: ImageIcon,
    description: "Image upload field",
    category: "media",
    premium: true,
  },
  {
    type: "video",
    label: "Video Upload",
    icon: Video,
    description: "Video upload field",
    category: "media",
    premium: true,
  },
  {
    type: "audio",
    label: "Audio Record",
    icon: Mic,
    description: "Audio recording field",
    category: "media",
    premium: true,
  },
]

const advancedFields = [
  {
    type: "signature",
    label: "Signature",
    icon: Signature,
    description: "Digital signature pad",
    category: "advanced",
    premium: true,
  },
  {
    type: "location",
    label: "Location",
    icon: MapPin,
    description: "GPS location picker",
    category: "advanced",
    premium: true,
  },
  {
    type: "payment",
    label: "Payment",
    icon: CreditCard,
    description: "Payment processing",
    category: "advanced",
    premium: true,
  },
  {
    type: "qrcode",
    label: "QR Code",
    icon: QrCode,
    description: "QR code scanner",
    category: "advanced",
    premium: true,
  },
  {
    type: "calculator",
    label: "Calculator",
    icon: Calculator,
    description: "Calculation field",
    category: "advanced",
    premium: true,
  },
  { type: "color", label: "Color Picker", icon: Palette, description: "Color selection", category: "advanced" },
  { type: "range", label: "Slider", icon: ToggleLeft, description: "Range slider", category: "advanced" },
  { type: "password", label: "Password", icon: EyeOff, description: "Password input", category: "advanced" },
  { type: "hidden", label: "Hidden Field", icon: Eye, description: "Hidden value field", category: "advanced" },
]

const categories = [
  { id: "basic", label: "Basic Fields", fields: basicFields },
  { id: "choice", label: "Choice Fields", fields: choiceFields },
  { id: "datetime", label: "Date & Time", fields: dateTimeFields },
  { id: "media", label: "Media Fields", fields: mediaFields },
  { id: "advanced", label: "Advanced Fields", fields: advancedFields },
]

function DraggableField({ type, label, icon: Icon, description, premium }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type: "palette-field",
      fieldType: type,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`field-palette-item p-4 rounded-xl cursor-grab hover:shadow-lg transition-all duration-200 select-none relative ${
        isDragging ? "opacity-50 shadow-xl scale-105 z-50" : ""
      }`}
    >
      {premium && (
        <Badge variant="gradient" size="sm" className="absolute -top-2 -right-2 z-10">
          PRO
        </Badge>
      )}
      <div className="flex items-center space-x-3 pointer-events-none">
        <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex-shrink-0">
          <Icon className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function AdvancedFieldPalette() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("basic")

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      fields: category.fields.filter(
        (field) =>
          field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          field.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.fields.length > 0)

  return (
    <Card className="h-full flex flex-col" variant="elevated">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-600" />
          Form Fields
        </CardTitle>
        <p className="text-sm text-gray-600">Drag fields to add them to your form</p>

        {/* Search */}
        <div className="mt-4">
          <Input
            placeholder="Search fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "gradient" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className="text-xs"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={activeCategory === "all" || activeCategory === category.id ? "block" : "hidden"}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                {category.label}
                <Badge variant="secondary" size="sm" className="ml-2">
                  {category.fields.length}
                </Badge>
              </h3>
              <div className="space-y-3">
                {category.fields.map((field) => (
                  <DraggableField key={field.type} {...field} />
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No fields found matching "{searchQuery}"</p>
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="mt-2">
                Clear search
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
