import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AppTheme } from "../../types"

interface ThemeState {
  currentTheme: AppTheme
  presets: AppTheme[]
}

const initialState: ThemeState = {
  currentTheme: {
    primaryColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter",
  },
  presets: [
    {
      primaryColor: "#3B82F6",
      backgroundColor: "#FFFFFF",
      fontFamily: "Inter",
    },
    {
      primaryColor: "#10B981",
      backgroundColor: "#F9FAFB",
      fontFamily: "Inter",
    },
    {
      primaryColor: "#8B5CF6",
      backgroundColor: "#FFFFFF",
      fontFamily: "Roboto",
    },
    {
      primaryColor: "#F59E0B",
      backgroundColor: "#FFFBEB",
      fontFamily: "Open Sans",
    },
  ],
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.currentTheme = action.payload
    },
    updateThemeProperty: (state, action: PayloadAction<{ key: keyof AppTheme; value: string }>) => {
      const { key, value } = action.payload
      state.currentTheme[key] = value
    },
    resetTheme: (state) => {
      state.currentTheme = initialState.currentTheme
    },
  },
})

export const { setTheme, updateThemeProperty, resetTheme } = themeSlice.actions
export default themeSlice.reducer
