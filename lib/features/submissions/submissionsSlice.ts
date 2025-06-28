import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { FormSubmission } from "../../types"

interface SubmissionsState {
  submissions: FormSubmission[]
  loading: boolean
  error: string | null
  selectedFormId: string | null
}

const initialState: SubmissionsState = {
  submissions: [
    {
      id: "sub_1",
      formId: "1",
      data: {
        name: "John Doe",
        email: "john@example.com",
        rating: 5,
        feedback: "Great service!",
      },
      submittedAt: "2024-01-20T10:30:00Z",
      ipAddress: "192.168.1.1",
    },
    {
      id: "sub_2",
      formId: "1",
      data: {
        name: "Jane Smith",
        email: "jane@example.com",
        rating: 4,
        feedback: "Good experience overall",
      },
      submittedAt: "2024-01-19T14:15:00Z",
      ipAddress: "192.168.1.2",
    },
    {
      id: "sub_3",
      formId: "2",
      data: {
        name: "Mike Johnson",
        email: "mike@example.com",
        position: "Frontend Developer",
        experience: "5 years",
      },
      submittedAt: "2024-01-18T09:45:00Z",
      ipAddress: "192.168.1.3",
    },
  ],
  loading: false,
  error: null,
  selectedFormId: null,
}

export const fetchSubmissions = createAsyncThunk("submissions/fetchSubmissions", async (formId?: string) => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return formId ? initialState.submissions.filter((sub) => sub.formId === formId) : initialState.submissions
})

export const deleteSubmission = createAsyncThunk("submissions/deleteSubmission", async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return id
})

const submissionsSlice = createSlice({
  name: "submissions",
  initialState,
  reducers: {
    setSelectedFormId: (state, action) => {
      state.selectedFormId = action.payload
    },
    clearSubmissions: (state) => {
      state.submissions = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false
        state.submissions = action.payload
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch submissions"
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.submissions = state.submissions.filter((sub) => sub.id !== action.payload)
      })
  },
})

export const { setSelectedFormId, clearSubmissions } = submissionsSlice.actions
export default submissionsSlice.reducer
