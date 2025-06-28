import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Form, FormField, FormSettings } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"
import type { RootState } from "@/lib/store"

interface FormBuilderState {
  currentForm: Form | null
  selectedField: string | null
  isDirty: boolean
}

const initialState: FormBuilderState = {
  currentForm: null,
  selectedField: null,
  isDirty: false,
}

export const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<Form>) => {
      state.currentForm = action.payload
      state.isDirty = false
    },
    addField: (state, action: PayloadAction<{ type: string }>) => {
      if (state.currentForm) {
        const newField: FormField = {
          id: uuidv4(),
          type: action.payload.type,
          label: "New Field",
          required: false,
          options: [],
        }
        state.currentForm.fields = [...state.currentForm.fields, newField]
        state.isDirty = true
      }
    },
    updateField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.map((field) =>
          field.id === action.payload.id ? action.payload : field,
        )
        state.isDirty = true
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter((field) => field.id !== action.payload)
        state.isDirty = true
      }
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      if (state.currentForm) {
        state.currentForm.fields = action.payload
        state.isDirty = true
      }
    },
    setSelectedField: (state, action: PayloadAction<string | null>) => {
      state.selectedField = action.payload
    },
    updateFormSettings: (state, action: PayloadAction<FormSettings>) => {
      if (state.currentForm) {
        state.currentForm.settings = action.payload
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
    updateFormInfo: (state, action: PayloadAction<{ name: string; description: string }>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload.name
        state.currentForm.description = action.payload.description
        state.isDirty = true
      }
    },
    clearForm: (state) => {
      state.currentForm = null
      state.selectedField = null
      state.isDirty = false
    },
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

export const selectCurrentForm = (state: RootState) => state.formBuilder.currentForm
export const selectSelectedField = (state: RootState) => state.formBuilder.selectedField
export const selectIsDirty = (state: RootState) => state.formBuilder.isDirty

export default formBuilderSlice.reducer
