import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { FormData } from "../../types"

interface FormsState {
  forms: FormData[]
  loading: boolean
  error: string | null
  searchQuery: string
  filterStatus: "all" | "draft" | "published" | "archived"
}

const initialState: FormsState = {
  forms: [
    {
      id: "1",
      name: "Customer Feedback Survey",
      description: "Collect customer satisfaction ratings and feedback",
      fields: [],
      settings: {
        theme: {
          primaryColor: "#3B82F6",
          backgroundColor: "#FFFFFF",
          fontFamily: "Inter",
        },
        notifications: {},
        allowMultipleSubmissions: true,
        requireAuth: false,
      },
      status: "published",
      submissions: 247,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    {
      id: "2",
      name: "Job Application Form",
      description: "Streamlined application process for new hires",
      fields: [],
      settings: {
        theme: {
          primaryColor: "#10B981",
          backgroundColor: "#F9FAFB",
          fontFamily: "Inter",
        },
        notifications: {},
        allowMultipleSubmissions: false,
        requireAuth: true,
      },
      status: "published",
      submissions: 89,
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-18T14:20:00Z",
    },
    {
      id: "3",
      name: "Event Registration",
      description: "Register for our upcoming product launch event",
      fields: [],
      settings: {
        theme: {
          primaryColor: "#8B5CF6",
          backgroundColor: "#FFFFFF",
          fontFamily: "Inter",
        },
        notifications: {},
        allowMultipleSubmissions: false,
        requireAuth: false,
      },
      status: "draft",
      submissions: 0,
      createdAt: "2024-01-08T11:00:00Z",
      updatedAt: "2024-01-15T16:45:00Z",
    },
  ],
  loading: false,
  error: null,
  searchQuery: "",
  filterStatus: "all",
}

export const fetchForms = createAsyncThunk("forms/fetchForms", async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return initialState.forms
})

export const createForm = createAsyncThunk(
  "forms/createForm",
  async (formData: Omit<FormData, "id" | "createdAt" | "updatedAt" | "submissions">) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newForm: FormData = {
      ...formData,
      id: `form_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissions: 0,
    }
    return newForm
  },
)

export const updateForm = createAsyncThunk(
  "forms/updateForm",
  async ({ id, updates }: { id: string; updates: Partial<FormData> }) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { id, updates: { ...updates, updatedAt: new Date().toISOString() } }
  },
)

export const deleteForm = createAsyncThunk("forms/deleteForm", async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return id
})

export const duplicateForm = createAsyncThunk("forms/duplicateForm", async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return id
})

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setFilterStatus: (state, action: PayloadAction<FormsState["filterStatus"]>) => {
      state.filterStatus = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.loading = false
        state.forms = action.payload
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch forms"
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.forms.unshift(action.payload)
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        const { id, updates } = action.payload
        const formIndex = state.forms.findIndex((form) => form.id === id)
        if (formIndex !== -1) {
          state.forms[formIndex] = { ...state.forms[formIndex], ...updates }
        }
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.forms = state.forms.filter((form) => form.id !== action.payload)
      })
      .addCase(duplicateForm.fulfilled, (state, action) => {
        const originalForm = state.forms.find((form) => form.id === action.payload)
        if (originalForm) {
          const duplicatedForm: FormData = {
            ...originalForm,
            id: `form_${Date.now()}`,
            name: `${originalForm.name} (Copy)`,
            status: "draft",
            submissions: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          state.forms.unshift(duplicatedForm)
        }
      })
  },
})

export const { setSearchQuery, setFilterStatus, clearError } = formsSlice.actions
export default formsSlice.reducer
