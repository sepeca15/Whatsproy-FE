import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slices/userSlice/userSlice";
import orderSlice from "./Slices/ordersSlice/orderSlice";
import homeDataSlice from "./Slices/homeDataSlice/homeDataSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    orders: orderSlice.reducer,
    homeData: homeDataSlice.reducer
  },
});
