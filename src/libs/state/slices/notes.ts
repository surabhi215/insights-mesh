import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: [] as Array<{ title: string; summary: string; key: string }>,
  reducers: {
    addNote: (state, action) => {
      state.push(...action.payload);
    },
    updateNote: (state, action) => {
      const filteredState = state?.filter((st) => {
        return st.key !== action.payload?.[0].key;
      });
      return [...filteredState, ...action.payload];
    },
  },
});

export const { addNote, updateNote } = notesSlice.actions;
export default notesSlice.reducer;
