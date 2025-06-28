import { configureStore } from "@reduxjs/toolkit"
import formsReducer from "./features/forms/formsSlice"
import formBuilderReducer from "./features/formBuilder/formBuilderSlice"
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
