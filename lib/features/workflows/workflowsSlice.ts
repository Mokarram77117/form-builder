import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Workflow } from "../../types"

interface WorkflowsState {
  workflows: Workflow[]
  loading: boolean
  error: string | null
  selectedWorkflow: Workflow | null
}

const initialState: WorkflowsState = {
  workflows: [
    {
      id: "wf_1",
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
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
  ],
  loading: false,
  error: null,
  selectedWorkflow: null,
}

export const fetchWorkflows = createAsyncThunk("workflows/fetchWorkflows", async (formId?: string) => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return formId ? initialState.workflows.filter((wf) => wf.formId === formId) : initialState.workflows
})

export const createWorkflow = createAsyncThunk(
  "workflows/createWorkflow",
  async (workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newWorkflow: Workflow = {
      ...workflow,
      id: `wf_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newWorkflow
  },
)

export const updateWorkflow = createAsyncThunk(
  "workflows/updateWorkflow",
  async ({ id, updates }: { id: string; updates: Partial<Workflow> }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { id, updates: { ...updates, updatedAt: new Date().toISOString() } }
  },
)

export const deleteWorkflow = createAsyncThunk("workflows/deleteWorkflow", async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return id
})

const workflowsSlice = createSlice({
  name: "workflows",
  initialState,
  reducers: {
    setSelectedWorkflow: (state, action) => {
      state.selectedWorkflow = action.payload
    },
    clearSelectedWorkflow: (state) => {
      state.selectedWorkflow = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.loading = false
        state.workflows = action.payload
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch workflows"
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.workflows.unshift(action.payload)
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        const { id, updates } = action.payload
        const workflowIndex = state.workflows.findIndex((wf) => wf.id === id)
        if (workflowIndex !== -1) {
          state.workflows[workflowIndex] = { ...state.workflows[workflowIndex], ...updates }
        }
      })
      .addCase(deleteWorkflow.fulfilled, (state, action) => {
        state.workflows = state.workflows.filter((wf) => wf.id !== action.payload)
      })
  },
})

export const { setSelectedWorkflow, clearSelectedWorkflow } = workflowsSlice.actions
export default workflowsSlice.reducer
