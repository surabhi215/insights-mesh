import { createSlice } from "@reduxjs/toolkit";

const loading = createSlice({
  name: "loading",
  initialState: false,
  reducers: {
    isLoading: (state, action) => {
      return action.payload;
    },
  },
});

export const { isLoading } = loading.actions;
export default loading.reducer;
