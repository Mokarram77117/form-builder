import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { FormData, FormField } from "../../types"

interface FormBuilderState {
  currentForm: FormData | null
  loading: boolean
  saving: boolean
  error: string | null
  selectedField: FormField | null
  isDirty: boolean
  previewMode: "desktop" | "mobile"
  activeTab: "build" | "preview" | "settings"
}

const initialState: FormBuilderState = {
  currentForm: null,
  loading: false,
  saving: false,
  error: null,
  selectedField: null,
  isDirty: false,
  previewMode: "desktop",
  activeTab: "build",
}

export const loadForm = createAsyncThunk("formBuilder/loadForm", async (formId: string, { getState }) => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get form from the forms slice
  const state = getState() as any
  const form = state.forms.forms.find((f: FormData) => f.id === formId)

  if (!form) {
    throw new Error("Form not found")
  }

  return form
})

export const saveForm = createAsyncThunk("formBuilder/saveForm", async (formData: FormData, { dispatch }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Update the form in the forms slice
  dispatch({
    type: "forms/updateForm/fulfilled",
    payload: {
      id: formData.id,
      updates: formData,
    },
  })

  return formData
})

export const createNewForm = createAsyncThunk(
  "formBuilder/createNewForm",
  async (formData: { name: string; description: string; templateId?: string; fields?: any[] }, { dispatch }) => {
    const newForm: FormData = {
      id: `form_${Date.now()}`,
      title: formData.name,
      name: formData.name,
      description: formData.description,
      fields: formData.fields || [],
      settings: {
        theme: {
          primaryColor: "#8B5CF6",
          backgroundColor: "#FFFFFF",
          fontFamily: "Inter",
        },
        notifications: {},
        allowMultipleSubmissions: true,
        requireAuth: false,
        showProgressBar: false,
      },
      status: "draft",
      submissions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to forms slice
    dispatch({
      type: "forms/createForm/fulfilled",
      payload: newForm,
    })

    return newForm
  },
)

const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<FormData>) => {
      state.currentForm = action.payload
      state.isDirty = false
    },
    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload)
        state.isDirty = true
      }
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex((field) => field.id === action.payload.id)
        if (fieldIndex !== -1) {
          state.currentForm.fields[fieldIndex] = {
            ...state.currentForm.fields[fieldIndex],
            ...action.payload.updates,
          }
          state.isDirty = true

          // Update selected field if it's the one being updated
          if (state.selectedField?.id === action.payload.id) {
            state.selectedField = {
              ...state.selectedField,
              ...action.payload.updates,
            }
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
        const [moved] = fields.splice(oldIndex, 1)
        fields.splice(newIndex, 0, moved)
        state.currentForm.fields = fields
        state.isDirty = true
      }
    },
    setSelectedField: (state, action: PayloadAction<FormField | null>) => {
      state.selectedField = action.payload
    },
    updateFormSettings: (state, action: PayloadAction<Partial<FormData["settings"]>>) => {
      if (state.currentForm) {
        state.currentForm.settings = {
          ...state.currentForm.settings,
          ...action.payload,
        }
        state.isDirty = true
      }
    },
    updateFormTitle: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.title = action.payload
        state.currentForm.name = action.payload
        state.isDirty = true
      }
    },
    updateFormDescription: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.description = action.payload
        state.isDirty = true
      }
    },
    updateFormInfo: (state, action: PayloadAction<{ name?: string; description?: string }>) => {
      if (state.currentForm) {
        if (action.payload.name !== undefined) {
          state.currentForm.name = action.payload.name
          state.currentForm.title = action.payload.name
        }
        if (action.payload.description !== undefined) {
          state.currentForm.description = action.payload.description
        }
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
      state.activeTab = "build"
      state.previewMode = "desktop"
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(saveForm.pending, (state) => {
        state.saving = true
      })
      .addCase(saveForm.fulfilled, (state) => {
        state.saving = false
        state.isDirty = false
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.saving = false
        state.error = action.error.message || "Failed to save form"
      })
      .addCase(createNewForm.fulfilled, (state, action) => {
        state.currentForm = action.payload
        state.isDirty = false
        state.selectedField = null
      })
  },
})

export const {
  setCurrentForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  setSelectedField,
  updateFormSettings,
  updateFormInfo,
  updateFormTitle,
  updateFormDescription,
  setPreviewMode,
  setActiveTab,
  clearForm,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
