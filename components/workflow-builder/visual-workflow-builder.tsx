"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  ArrowRight,
  Zap,
  Mail,
  Webhook,
  MessageSquare,
  AlertTriangle,
  Star,
  ChevronDown,
  Settings,
} from "lucide-react"
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"

interface WorkflowTrigger {
  id: string
  type: "field_value" | "rating_threshold" | "form_submitted"
  fieldId?: string
  operator: "equals" | "not_equals" | "less_than" | "greater_than" | "contains"
  value: string | number
  label: string
}

interface WorkflowAction {
  id: string
  type: "send_email" | "webhook" | "slack_notification"
  label: string
  config: any
}

interface WorkflowStep {
  id: string
  type: "trigger" | "action"
  data: WorkflowTrigger | WorkflowAction
  position: { x: number; y: number }
}

const triggerTypes = [
  {
    type: "field_value",
    label: "Field Value",
    icon: ChevronDown,
    description: "When a field equals a specific value",
  },
  {
    type: "rating_threshold",
    label: "Rating Threshold",
    icon: Star,
    description: "When rating is above/below a value",
  },
  {
    type: "form_submitted",
    label: "Form Submitted",
    icon: Zap,
    description: "When form is submitted",
  },
]

const actionTypes = [
  {
    type: "send_email",
    label: "Send Email",
    icon: Mail,
    description: "Send email notification",
  },
  {
    type: "webhook",
    label: "Webhook",
    icon: Webhook,
    description: "POST to external URL",
  },
  {
    type: "slack_notification",
    label: "Slack Notification",
    icon: MessageSquare,
    description: "Send message to Slack",
  },
]

function DraggableWorkflowBlock({
  step,
  onEdit,
  onDelete,
}: {
  step: WorkflowStep
  onEdit: (step: WorkflowStep) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: step.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const isAction = step.type === "action"
  const data = step.data as any

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        relative p-4 rounded-xl border-2 cursor-move transition-all duration-200
        ${isDragging ? "opacity-50 scale-105 z-50" : ""}
        ${
          isAction
            ? "border-green-200 bg-green-50 hover:border-green-300"
            : "border-blue-200 bg-blue-50 hover:border-blue-300"
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isAction ? "bg-green-100" : "bg-blue-100"}`}>
            {isAction
              ? actionTypes.find((a) => a.type === data.type)?.icon &&
                React.createElement(actionTypes.find((a) => a.type === data.type)!.icon, {
                  className: "w-5 h-5 text-green-600",
                })
              : triggerTypes.find((t) => t.type === data.type)?.icon &&
                React.createElement(triggerTypes.find((t) => t.type === data.type)!.icon, {
                  className: "w-5 h-5 text-blue-600",
                })}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{isAction ? "THEN" : "IF"}</h4>
            <p className="text-sm text-gray-600">{data.label}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(step)} className="p-1 h-auto">
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(step.id)}
            className="p-1 h-auto text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Connection point for arrows */}
      {!isAction && (
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <ArrowRight className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  )
}

function WorkflowCanvas({
  steps,
  onStepUpdate,
  onStepDelete,
}: {
  steps: WorkflowStep[]
  onStepUpdate: (step: WorkflowStep) => void
  onStepDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "workflow-canvas",
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        relative min-h-96 p-6 border-2 border-dashed rounded-xl transition-all duration-200
        ${isOver ? "border-purple-400 bg-purple-50" : "border-gray-300 bg-gray-50"}
      `}
    >
      {steps.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Build Your Workflow</h3>
          <p className="text-gray-600">Drag triggers and actions from the panels to create your automation</p>
        </div>
      ) : (
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4">
              <DraggableWorkflowBlock step={step} onEdit={onStepUpdate} onDelete={onStepDelete} />
              {index < steps.length - 1 && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function VisualWorkflowBuilder() {
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null)

  const addTrigger = (triggerType: string) => {
    const newStep: WorkflowStep = {
      id: `trigger_${Date.now()}`,
      type: "trigger",
      data: {
        id: `trigger_${Date.now()}`,
        type: triggerType as any,
        operator: "equals",
        value: "",
        label: triggerTypes.find((t) => t.type === triggerType)?.label || "New Trigger",
      },
      position: { x: 0, y: 0 },
    }
    setSteps([...steps, newStep])
  }

  const addAction = (actionType: string) => {
    const newStep: WorkflowStep = {
      id: `action_${Date.now()}`,
      type: "action",
      data: {
        id: `action_${Date.now()}`,
        type: actionType as any,
        label: actionTypes.find((a) => a.type === actionType)?.label || "New Action",
        config: {},
      },
      position: { x: 0, y: 0 },
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (updatedStep: WorkflowStep) => {
    setSteps(steps.map((step) => (step.id === updatedStep.id ? updatedStep : step)))
    setSelectedStep(null)
  }

  const deleteStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId))
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
      {/* Triggers Panel */}
      <div className="col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
              Triggers (IF)
            </CardTitle>
            <p className="text-sm text-gray-600">When should this workflow run?</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {triggerTypes.map((trigger) => (
                <Button
                  key={trigger.type}
                  variant="outline"
                  className="w-full justify-start p-4 h-auto bg-transparent"
                  onClick={() => addTrigger(trigger.type)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <trigger.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{trigger.label}</p>
                      <p className="text-xs text-gray-500">{trigger.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Canvas */}
      <div className="col-span-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Workflow Flow</CardTitle>
            <p className="text-sm text-gray-600">Drag and arrange your workflow steps</p>
          </CardHeader>
          <CardContent>
            <DndContext>
              <WorkflowCanvas steps={steps} onStepUpdate={updateStep} onStepDelete={deleteStep} />
            </DndContext>
          </CardContent>
        </Card>
      </div>

      {/* Actions Panel */}
      <div className="col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Zap className="w-5 h-5 mr-2 text-green-600" />
              Actions (THEN)
            </CardTitle>
            <p className="text-sm text-gray-600">What should happen?</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionTypes.map((action) => (
                <Button
                  key={action.type}
                  variant="outline"
                  className="w-full justify-start p-4 h-auto bg-transparent"
                  onClick={() => addAction(action.type)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <action.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
