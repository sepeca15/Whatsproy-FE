import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ordersFinished: [] as any[],
  ordersPending: [] as any[],
  ordersActive: [] as any[],
  loadingApi: false,
  loadingApiAction: false
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
    odLoadOrdersActive: (state, { payload }) => {
      state.ordersActive = payload;
      state.loadingApi = false;
    },
    onConfirmOrder: (state, { payload }) => {
      const newOrderConfirmed = payload;
      const newStateOrdersPending = state.ordersPending.filter(
        (order: any) => order.orderId !== newOrderConfirmed.orderId,
      );
      const newStateOrdersActive = [
        ...state.ordersActive,
        newOrderConfirmed,
      ];
      state.ordersPending = newStateOrdersPending;
      state.ordersActive = newStateOrdersActive;
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
    finishOrderActive: (state, { payload }) => {
      const newOrder = payload;
      let findOrder;

      const newStateOrdersActive = state.ordersPending.filter(
        (order: any) => {
          if (order.orderId === newOrder.id) {
            findOrder = order
            return;
          }
          return order
        },
      );
      const newStateOrdersFinished = [
        ...state.ordersFinished,
        findOrder,
      ];
      state.ordersActive = newStateOrdersActive;
      state.ordersFinished = newStateOrdersFinished;

    },
    onLoadingApi: (state) => {
      state.loadingApi = true;
    },
    onLoadingApiAction: (state) => {
      state.loadingApiAction = true;
    },
    onFinishLoadingApiAction: (state) => {
      console.log('se llamo');

      state.loadingApiAction = false;
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
  odLoadOrdersActive,
  onLoadingApiAction,
  onFinishLoadingApiAction,
  finishOrderActive
} = orderSlice.actions;

export default orderSlice;
