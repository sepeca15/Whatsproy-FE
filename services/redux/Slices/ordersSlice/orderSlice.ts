import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ordersFinished: [] as any[],
  ordersPending: [] as any[],
  loadingApi: false,
};

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {
    onLoadOrdersPending: (state, { payload }) => {
      state.ordersPending = payload;
      state.loadingApi = false;
    },
    onLoadOrdersFinished: (state, { payload }) => {
      state.ordersFinished = payload;

      state.loadingApi = false;
    },
    onConfirmOrder: (state, { payload }) => {
      const newOrderConfirmed = payload;
      const newStateOrdersPending = state.ordersPending.filter(
        (order: any) => order.orderId !== newOrderConfirmed.orderId,
      );
      const newStateOrdersFinished = [
        ...state.ordersFinished,
        newOrderConfirmed,
      ];
      state.ordersPending = newStateOrdersPending;
      state.ordersFinished = newStateOrdersFinished;
    },
    onDeleteOrder: (state, { payload }) => {
      const { key, orderId } = payload;

      if (key === "pending") {
        const newState = state.ordersPending.filter(
          (order: any) => order.orderId !== orderId,
        );
        state.ordersPending = newState;
      } else {
        const newState = state.ordersFinished.filter(
          (order: any) => order.orderId !== orderId,
        );
        state.ordersFinished = newState;
      }
    },
    onLoadingApi: (state) => {
      state.loadingApi = true;
    },
    onFinishLoadingApi: (state) => {
      state.loadingApi = false;
    },
    onAddOrderPending: (state, { payload }) => {
      state.ordersPending = [...state.ordersPending, payload];
    },
  },
});

export const {
  onLoadOrdersPending,
  onLoadOrdersFinished,
  onConfirmOrder,
  onDeleteOrder,
  onLoadingApi,
  onFinishLoadingApi,
  onAddOrderPending,
} = orderSlice.actions;

export default orderSlice;
