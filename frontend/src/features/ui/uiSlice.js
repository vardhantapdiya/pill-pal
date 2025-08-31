import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: { darkMode: false },
  reducers: {
    toggleDarkMode: (s) => { s.darkMode = !s.darkMode; },
    setDarkMode: (s,a) => { s.darkMode = !!a.payload; }
  }
});

export const { toggleDarkMode, setDarkMode } = slice.actions;
export default slice.reducer;