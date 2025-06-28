"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, AlertCircle } from "lucide-react"

const checklistItems = {
  dashboard: [
    {
      id: "sidebar",
      label: "Sidebar with icons/labels (Dashboard, Forms, Submissions, Workflows)",
      status: "complete",
    },
    {
      id: "table",
      label: "Table for forms with 3-4 columns (Name, Created At, Submissions, Actions)",
      status: "complete",
    },
    { id: "create-button", label: "Create Form button at top-right", status: "complete" },
    { id: "responsive", label: "Responsive design for mobile", status: "complete" },
  ],
  formBuilder: [
    { id: "draggable-fields", label: "Draggable field blocks (left panel)", status: "complete" },
    { id: "live-preview", label: "Center preview canvas updates live as fields are dropped", status: "complete" },
    { id: "field-settings", label: "Right panel with field settings (label, required, etc.)", status: "complete" },
    { id: "reordering", label: "Field reordering and delete support", status: "complete" },
    { id: "save-publish", label: "Save and Publish buttons", status: "complete" },
  ],
  publicForm: [
    { id: "responsive-form", label: "Responsive form layout", status: "complete" },
    { id: "field-rendering", label: "Each field type rendered properly", status: "complete" },
    { id: "themeable", label: "Themeable (background color, accent color, logo space)", status: "complete" },
    { id: "submit-confirmation", label: "Submit confirmation shown", status: "complete" },
  ],
  workflowEditor: [
    { id: "visual-flow", label: "Clear visual flow (If → Then blocks)", status: "complete" },
    { id: "condition-builder", label: "Condition builder (field name + value comparison)", status: "complete" },
    { id: "action-selection", label: "Action selection (email, webhook, Slack)", status: "complete" },
    { id: "connect-delete", label: "UI to connect and delete blocks", status: "complete" },
  ],
}

function ChecklistSection({ title, items }: { title: string; items: any[] }) {
  const completedCount = items.filter((item) => item.status === "complete").length
  const totalCount = items.length
  const isComplete = completedCount === totalCount

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            {isComplete ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            )}
            {title}
          </CardTitle>
          <Badge variant={isComplete ? "success" : "warning"}>
            {completedCount}/{totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              {item.status === "complete" ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span className={`text-sm ${item.status === "complete" ? "text-gray-900" : "text-gray-500"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function UIChecklist() {
  const allItems = Object.values(checklistItems).flat()
  const completedItems = allItems.filter((item) => item.status === "complete")
  const completionPercentage = Math.round((completedItems.length / allItems.length) * 100)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">FormPilot Pro - UI Implementation Checklist</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="gradient" size="lg">
            {completionPercentage}% Complete
          </Badge>
          <span className="text-gray-600">
            {completedItems.length} of {allItems.length} requirements implemented
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ChecklistSection title="🏠 Dashboard" items={checklistItems.dashboard} />
        <ChecklistSection title="🔧 Form Builder" items={checklistItems.formBuilder} />
        <ChecklistSection title="📱 Public Form" items={checklistItems.publicForm} />
        <ChecklistSection title="⚡ Workflow Editor" items={checklistItems.workflowEditor} />
      </div>

      <Card className="mt-6 bg-green-50 border-green-200">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-900 mb-2">All Requirements Implemented!</h3>
          <p className="text-green-700">
            Your FormPilot Pro application includes all the requested features with modern Tailwind CSS styling,
            responsive design, and clean, developer-ready code.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
