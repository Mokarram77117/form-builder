"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Workflow, Edit, Trash2, MoreVertical, Zap, Mail, Webhook, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchWorkflows, deleteWorkflow, updateWorkflow } from "@/lib/features/workflows/workflowsSlice"
import { fetchForms } from "@/lib/features/forms/formsSlice"
import { format } from "date-fns"

export default function WorkflowsPage() {
  const dispatch = useAppDispatch()
  const { workflows, loading } = useAppSelector((state) => state.workflows)
  const { forms } = useAppSelector((state) => state.forms)

  useEffect(() => {
    dispatch(fetchForms())
    dispatch(fetchWorkflows())
  }, [dispatch])

  const handleDeleteWorkflow = (id: string) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      dispatch(deleteWorkflow(id))
    }
  }

  const handleToggleWorkflow = (id: string, isActive: boolean) => {
    dispatch(updateWorkflow({ id, updates: { isActive } }))
  }

  const getFormName = (formId: string) => {
    const form = forms.find((f) => f.id === formId)
    return form?.name || "Unknown Form"
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "send_email":
        return <Mail className="w-4 h-4" />
      case "webhook":
        return <Webhook className="w-4 h-4" />
      case "slack_notification":
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getActionLabel = (type: string) => {
    switch (type) {
      case "send_email":
        return "Send Email"
      case "webhook":
        return "Webhook"
      case "slack_notification":
        return "Slack Notification"
      default:
        return "Unknown Action"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/4" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600">Automate actions based on form submissions</p>
        </div>
        <Link href="/workflows/builder/new">
          <Button className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>

      {/* Workflows Grid */}
      {workflows.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Workflow className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first workflow to automate actions when forms are submitted
            </p>
            <Link href="/workflows/builder/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Workflow
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Form: {getFormName(workflow.formId)}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/workflows/builder/${workflow.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteWorkflow(workflow.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active</span>
                    <Switch
                      checked={workflow.isActive}
                      onCheckedChange={(checked) => handleToggleWorkflow(workflow.id, checked)}
                    />
                  </div>

                  {/* Triggers */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Triggers</h4>
                    <div className="space-y-1">
                      {workflow.triggers.map((trigger) => (
                        <div key={trigger.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          If {trigger.fieldId} {trigger.operator.replace("_", " ")} {trigger.value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                    <div className="space-y-1">
                      {workflow.actions.map((action) => (
                        <div
                          key={action.id}
                          className="flex items-center space-x-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded"
                        >
                          {getActionIcon(action.type)}
                          <span>{getActionLabel(action.type)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Created {format(new Date(workflow.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
