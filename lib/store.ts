import { configureStore } from "@reduxjs/toolkit"
import formsReducer from "./features/forms/formsSlice"
// Explicit extension avoids ambiguity when both .ts and .tsx once existed.
import formBuilderReducer from "./features/formBuilder/formBuilderSlice.ts"
import submissionsReducer from "./features/submissions/submissionsSlice"
import workflowsReducer from "./features/workflows/workflowsSlice"
import themeReducer from "./features/theme/themeSlice"

export const store = configureStore({
  reducer: {
    forms: formsReducer,
    formBuilder: formBuilderReducer,
    submissions: submissionsReducer,
    workflows: workflowsReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
