import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./Slices/rootReduce";

export const store = configureStore({
  reducer: rootReducer,
});
