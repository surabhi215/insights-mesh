import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: [] as Array<{ title: string; summary: string; key: string }>,
  reducers: {
    addNote: (state, action) => {
      state.push(...action.payload);
    },
  },
});

export const { addNote } = notesSlice.actions;
export default notesSlice.reducer;
