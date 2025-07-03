import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice/userSlice";
import orderSlice from "./ordersSlice/orderSlice";
import salesSlice from "./salesSlice/salesSlice";
import clientSlice from "./clientsSlice/clientSlice";
import homeDataSlice from "./homeDataSlice/homeDataSlice";

const appReducer = combineReducers({
  user: userSlice.reducer,
  orders: orderSlice.reducer,
  homeData: homeDataSlice.reducer,
  clientsData: clientSlice.reducer,
  salesSlice: salesSlice.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET') {
    state = undefined; //
  }
  return appReducer(state, action);
};

export default rootReducer;
