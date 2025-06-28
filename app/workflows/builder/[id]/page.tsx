"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Plus, Trash2, ArrowRight, Mail, Webhook, MessageSquare, Zap } from "lucide-react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchForms } from "@/lib/features/forms/formsSlice"
import { createWorkflow, updateWorkflow } from "@/lib/features/workflows/workflowsSlice"
import type { Workflow, WorkflowTrigger, WorkflowAction } from "@/lib/types"

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Triggers */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Triggers (IF)</CardTitle>
              <Button onClick={addTrigger} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowData.triggers?.map((trigger, index) => (
                  <div key={trigger.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Trigger {index + 1}</span>
                      <Button onClick={() => removeTrigger(index)} size="sm" variant="ghost" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Field</Label>
                      <Select
                        value={trigger.fieldId}
                        onValueChange={(value) => updateTrigger(index, { fieldId: value })}
                      >
                        {getSelectedForm()?.fields.map((field) => (
                          <SelectItem key={field.id} value={field.id}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select
                        value={trigger.operator}
                        onValueChange={(value) => updateTrigger(index, { operator: value as any })}
                      >
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Not Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater Than</SelectItem>
                        <SelectItem value="less_than">Less Than</SelectItem>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={trigger.value}
                        onChange={(e) => updateTrigger(index, { value: e.target.value })}
                        placeholder="Enter value"
                      />
                    </div>
                  </div>
                ))}

                {workflowData.triggers?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No triggers added yet</p>
                    <p className="text-sm">Click the + button to add a trigger</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Flow Connector */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <ArrowRight className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500 font-medium">THEN</span>
            </div>
          </div>

          {/* Actions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Actions (THEN)</CardTitle>
              <Button onClick={addAction} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowData.actions?.map((action, index) => (
                  <div key={action.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getActionIcon(action.type)}
                        <span className="text-sm font-medium">Action {index + 1}</span>
                      </div>
                      <Button onClick={() => removeAction(index)} size="sm" variant="ghost" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Action Type</Label>
                      <Select
                        value={action.type}
                        onValueChange={(value) => updateAction(index, { type: value as any })}
                      >
                        <SelectItem value="send_email">Send Email</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="slack_notification">Slack Notification</SelectItem>
                      </Select>
                    </div>

                    {action.type === "send_email" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>To Email</Label>
                          <Input
                            value={action.config.email?.to || ""}
                            onChange={(e) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  email: { ...action.config.email, to: e.target.value },
                                },
                              })
                            }
                            placeholder="recipient@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Input
                            value={action.config.email?.subject || ""}
                            onChange={(e) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  email: { ...action.config.email, subject: e.target.value },
                                },
                              })
                            }
                            placeholder="Email subject"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Textarea
                            value={action.config.email?.message || ""}
                            onChange={(e) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  email: { ...action.config.email, message: e.target.value },
                                },
                              })
                            }
                            placeholder="Email message"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {action.type === "webhook" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Webhook URL</Label>
                          <Input
                            value={action.config.webhook?.url || ""}
                            onChange={(e) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  webhook: { ...action.config.webhook, url: e.target.value },
                                },
                              })
                            }
                            placeholder="https://api.example.com/webhook"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Method</Label>
                          <Select
                            value={action.config.webhook?.method || "POST"}
                            onValueChange={(value) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  webhook: { ...action.config.webhook, method: value as "POST" | "GET" },
                                },
                              })
                            }
                          >
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="GET">GET</SelectItem>
                          </Select>
                        </div>
                      </div>
                    )}

                    {action.type === "slack_notification" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label>Slack Webhook URL</Label>
                          <Input
                            value={action.config.slack?.webhook || ""}
                            onChange={(e) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  slack: { ...action.config.slack, webhook: e.target.value },
                                },
                              })
                            }
                            placeholder="https://hooks.slack.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Channel</Label>
                          <Input
                            value={action.config.slack?.channel || ""}
                            onChange={(e) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  slack: { ...action.config.slack, channel: e.target.value },
                                },
                              })
                            }
                            placeholder="#general"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Textarea
                            value={action.config.slack?.message || ""}
                            onChange={(e) =>
                              updateAction(index, {
                                config: {
                                  ...action.config,
                                  slack: { ...action.config.slack, message: e.target.value },
                                },
                              })
                            }
                            placeholder="Slack message"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {workflowData.actions?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No actions added yet</p>
                    <p className="text-sm">Click the + button to add an action</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
