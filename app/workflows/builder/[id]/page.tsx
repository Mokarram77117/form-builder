"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectItem } from "@/components/ui/select"
import { ArrowLeft, Save, Mail, Webhook, MessageSquare, Zap } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchForms } from "@/lib/features/forms/formsSlice"
import { createWorkflow, updateWorkflow } from "@/lib/features/workflows/workflowsSlice"
import type { Workflow, WorkflowTrigger, WorkflowAction } from "@/lib/types"

// Import the new VisualWorkflowBuilder component
import { VisualWorkflowBuilder } from "@/components/workflow-builder/visual-workflow-builder"

export default function WorkflowBuilder({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch()
  const { forms } = useAppSelector((state) => state.forms)
  const { selectedWorkflow } = useAppSelector((state) => state.workflows)

  const [workflowData, setWorkflowData] = useState<Partial<Workflow>>({
    name: "",
    formId: "",
    triggers: [],
    actions: [],
    isActive: true,
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchForms())

    if (params.id === "new") {
      setWorkflowData({
        name: "New Workflow",
        formId: "",
        triggers: [],
        actions: [],
        isActive: true,
      })
    } else {
      // Load existing workflow
      // This would typically fetch from API
      setWorkflowData({
        id: params.id,
        name: "Low Rating Alert",
        formId: "1",
        triggers: [
          {
            id: "trigger_1",
            type: "rating_threshold",
            fieldId: "rating",
            operator: "less_than",
            value: 3,
          },
        ],
        actions: [
          {
            id: "action_1",
            type: "send_email",
            config: {
              email: {
                to: "support@company.com",
                subject: "Low Rating Alert",
                message: "A customer gave a rating below 3 stars.",
              },
            },
          },
        ],
        isActive: true,
      })
    }
  }, [dispatch, params.id])

  const addTrigger = () => {
    const newTrigger: WorkflowTrigger = {
      id: `trigger_${Date.now()}`,
      type: "field_value",
      fieldId: "",
      operator: "equals",
      value: "",
    }
    setWorkflowData((prev) => ({
      ...prev,
      triggers: [...(prev.triggers || []), newTrigger],
    }))
  }

  const updateTrigger = (index: number, updates: Partial<WorkflowTrigger>) => {
    setWorkflowData((prev) => ({
      ...prev,
      triggers: prev.triggers?.map((trigger, i) => (i === index ? { ...trigger, ...updates } : trigger)) || [],
    }))
  }

  const removeTrigger = (index: number) => {
    setWorkflowData((prev) => ({
      ...prev,
      triggers: prev.triggers?.filter((_, i) => i !== index) || [],
    }))
  }

  const addAction = () => {
    const newAction: WorkflowAction = {
      id: `action_${Date.now()}`,
      type: "send_email",
      config: {
        email: {
          to: "",
          subject: "",
          message: "",
        },
      },
    }
    setWorkflowData((prev) => ({
      ...prev,
      actions: [...(prev.actions || []), newAction],
    }))
  }

  const updateAction = (index: number, updates: Partial<WorkflowAction>) => {
    setWorkflowData((prev) => ({
      ...prev,
      actions: prev.actions?.map((action, i) => (i === index ? { ...action, ...updates } : action)) || [],
    }))
  }

  const removeAction = (index: number) => {
    setWorkflowData((prev) => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (params.id === "new") {
        await dispatch(createWorkflow(workflowData as Omit<Workflow, "id" | "createdAt" | "updatedAt">))
      } else {
        await dispatch(updateWorkflow({ id: params.id, updates: workflowData }))
      }
    } finally {
      setSaving(false)
    }
  }

  const getSelectedForm = () => {
    return forms.find((form) => form.id === workflowData.formId)
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "send_email":
        return <Mail className="w-5 h-5" />
      case "webhook":
        return <Webhook className="w-5 h-5" />
      case "slack_notification":
        return <MessageSquare className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const { source, destination, type } = result

    if (type === "triggers") {
      const newTriggers = Array.from(workflowData.triggers || [])
      const [removed] = newTriggers.splice(source.index, 1)
      newTriggers.splice(destination.index, 0, removed)

      setWorkflowData((prev) => ({
        ...prev,
        triggers: newTriggers,
      }))
    } else if (type === "actions") {
      const newActions = Array.from(workflowData.actions || [])
      const [removed] = newActions.splice(source.index, 1)
      newActions.splice(destination.index, 0, removed)

      setWorkflowData((prev) => ({
        ...prev,
        actions: newActions,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/workflows">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <Input
                  value={workflowData.name}
                  onChange={(e) => setWorkflowData((prev) => ({ ...prev, name: e.target.value }))}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                  placeholder="Workflow Name"
                />
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Workflow"}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Form Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={workflowData.formId}
              onValueChange={(value) => setWorkflowData((prev) => ({ ...prev, formId: value }))}
            >
              {forms.map((form) => (
                <SelectItem key={form.id} value={form.id}>
                  {form.name}
                </SelectItem>
              ))}
            </Select>
          </CardContent>
        </Card>

        {/* Workflow Builder */}
        {/* Replace the existing workflow builder grid section with: */}
        <VisualWorkflowBuilder />
        {/* This will provide the enhanced "If → Then" visual logic builder with:
        - Drag-and-drop flow blocks
        - Visual connectors between conditions and actions  
        - Better condition builder for "If Dropdown = Urgent" and "If Rating < 3"
        - Enhanced action selection with icons and descriptions
        - Proper visual flow representation */}
      </div>
    </div>
  )
}
