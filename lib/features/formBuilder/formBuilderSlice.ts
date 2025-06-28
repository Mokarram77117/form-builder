import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { FormData, FormField } from "../../types"

interface FormBuilderState {
  currentForm: FormData | null
  selectedField: FormField | null
  isDirty: boolean
  saving: boolean
  loading: boolean
  error: string | null
  previewMode: "desktop" | "mobile"
  activeTab: "build" | "preview" | "settings"
}

const initialState: FormBuilderState = {
  currentForm: null,
  selectedField: null,
  isDirty: false,
  saving: false,
  loading: false,
  error: null,
  previewMode: "desktop",
  activeTab: "build",
}

// Async thunks
export const loadForm = createAsyncThunk("formBuilder/loadForm", async (id: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (id === "new") {
    const newForm: FormData = {
      id: `form_${Date.now()}`,
      name: "Untitled Form",
      description: "Form description",
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
      status: "draft",
      submissions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newForm
  }

  // Mock existing form data with sample fields for preview
  const mockForm: FormData = {
    id,
    name: "Customer Feedback Survey",
    description: "Help us improve our services by sharing your feedback",
    fields: [
      {
        id: "field_1",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "field_2",
        type: "email",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
      },
      {
        id: "field_3",
        type: "rating",
        label: "Overall Satisfaction",
        required: true,
      },
      {
        id: "field_4",
        type: "dropdown",
        label: "How did you hear about us?",
        required: false,
        options: ["Google Search", "Social Media", "Friend Referral", "Advertisement", "Other"],
      },
    ],
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
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  }
  return mockForm
})

export const saveForm = createAsyncThunk("formBuilder/saveForm", async (form: FormData) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { ...form, updatedAt: new Date().toISOString() }
})

const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    updateFormTitle: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.title = action.payload
        state.isDirty = true
      }
    },
    updateFormDescription: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.description = action.payload
        state.isDirty = true
      }
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload)
        state.isDirty = true
      }
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const { id, updates } = action.payload
        const fieldIndex = state.currentForm.fields.findIndex((field) => field.id === id)
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = { ...state.currentForm.fields[fieldIndex], ...updates }
          state.isDirty = true

          // Update selected field if it's the one being updated
          if (state.selectedField?.id === id) {
            state.selectedField = { ...state.selectedField, ...updates }
          }
        }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter((field) => field.id !== action.payload)
        state.isDirty = true

        // Clear selected field if it was deleted
        if (state.selectedField?.id === action.payload) {
          state.selectedField = null
        }
      }
    },
    reorderFields: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      if (state.currentForm) {
        const { oldIndex, newIndex } = action.payload
        const fields = [...state.currentForm.fields]
        const [removed] = fields.splice(oldIndex, 1)
        fields.splice(newIndex, 0, removed)
        state.currentForm.fields = fields
        state.isDirty = true
      }
    },
    setSelectedField: (state, action: PayloadAction<FormField | null>) => {
      state.selectedField = action.payload
    },
    updateFormSettings: (state, action: PayloadAction<Partial<FormData["settings"]>>) => {
      if (state.currentForm) {
        state.currentForm.settings = { ...state.currentForm.settings, ...action.payload }
        state.isDirty = true
      }
    },
    setPreviewMode: (state, action: PayloadAction<"desktop" | "mobile">) => {
      state.previewMode = action.payload
    },
    setActiveTab: (state, action: PayloadAction<"build" | "preview" | "settings">) => {
      state.activeTab = action.payload
    },
    clearForm: (state) => {
      state.currentForm = null
      state.selectedField = null
      state.isDirty = false
      state.error = null
    },
    markAsSaved: (state) => {
      state.isDirty = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Load form
      .addCase(loadForm.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadForm.fulfilled, (state, action) => {
        state.loading = false
        state.currentForm = action.payload
        state.isDirty = false
        state.selectedField = null
      })
      .addCase(loadForm.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load form"
      })
      // Save form
      .addCase(saveForm.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveForm.fulfilled, (state, action) => {
        state.saving = false
        state.currentForm = action.payload
        state.isDirty = false
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.saving = false
        state.error = action.error.message || "Failed to save form"
      })
  },
})

export const {
  updateFormTitle,
  updateFormDescription,
  addField,
  updateField,
  deleteField,
  reorderFields,
  setSelectedField,
  updateFormSettings,
  setPreviewMode,
  setActiveTab,
  clearForm,
  markAsSaved,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
