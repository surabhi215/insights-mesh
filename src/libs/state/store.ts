import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/theme";
import notesReducer from "./slices/notes";
import loadingReducer from "./slices/loading";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    notes: notesReducer,
    loading: loadingReducer,
  },
});

export default store;
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
