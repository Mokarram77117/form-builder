import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { FormData, FormField } from "../../types"

interface FormBuilderState {
  currentForm: FormData | null
  loading: boolean
  error: string | null
  selectedFieldId: string | null
  isDirty: boolean
}

const initialState: FormBuilderState = {
  currentForm: null,
  loading: false,
  error: null,
  selectedFieldId: null,
  isDirty: false,
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

export const saveForm = createAsyncThunk("formBuilder/saveForm", async (_, { getState, dispatch }) => {
  const state = getState() as any
  const currentForm = state.formBuilder.currentForm

  if (!currentForm) {
    throw new Error("No form to save")
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  // Update the form in the forms slice
  dispatch({
    type: "forms/updateForm/fulfilled",
    payload: {
      id: currentForm.id,
      updates: currentForm,
    },
  })

  return currentForm
})

export const createNewForm = createAsyncThunk(
  "formBuilder/createNewForm",
  async (formData: { name: string; description: string }, { dispatch }) => {
    const newForm: FormData = {
      id: `form_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      fields: [],
      settings: {
        theme: {
          primaryColor: "#8B5CF6",
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
        }
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter((field) => field.id !== action.payload)
        state.isDirty = true
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
    setSelectedField: (state, action: PayloadAction<string | null>) => {
      state.selectedFieldId = action.payload
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
        }
        if (action.payload.description !== undefined) {
          state.currentForm.description = action.payload.description
        }
        state.isDirty = true
      }
    },
    clearForm: (state) => {
      state.currentForm = null
      state.selectedFieldId = null
      state.isDirty = false
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
      })
      .addCase(loadForm.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load form"
      })
      .addCase(saveForm.pending, (state) => {
        state.loading = true
      })
      .addCase(saveForm.fulfilled, (state) => {
        state.loading = false
        state.isDirty = false
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to save form"
      })
      .addCase(createNewForm.fulfilled, (state, action) => {
        state.currentForm = action.payload
        state.isDirty = false
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
  clearForm,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
