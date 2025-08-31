import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import savedReducer from "../features/saved/savedSlice";
import uiReducer from "../features/ui/uiSlice";
import { loadState, saveState } from "./persist";

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    saved: savedReducer,
    ui: uiReducer,
  },
  preloadedState,
});

store.subscribe(() => saveState(store.getState())); //runs everytime the state changes, this way we are saving
//the state in local storage.
