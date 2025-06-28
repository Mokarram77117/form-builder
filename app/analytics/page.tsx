"use client"

import { useState } from "react"
import { Select, SelectItem } from "@/components/ui/select"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { BarChart3 } from "lucide-react"

const forms = [
  { id: "1", name: "Customer Feedback Survey", submissions: 847 },
  { id: "2", name: "Product Registration", submissions: 623 },
  { id: "3", name: "Newsletter Signup", submissions: 1205 },
  { id: "4", name: "Contact Form", submissions: 389 },
]

export default function AnalyticsPage() {
  const [selectedForm, setSelectedForm] = useState("1")

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
            Analytics
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            {forms.map((form) => (
              <SelectItem key={form.id} value={form.id}>
                {form.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard formId={selectedForm} />
    </div>
  )
}
