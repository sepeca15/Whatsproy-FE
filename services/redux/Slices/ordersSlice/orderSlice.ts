import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ordersFinished: [] as any[],
  ordersPending: [] as any[],
  ordersActive: [] as any[],
  offsetFinished: 0,
  offsetPending: 0,
  offsetActive: 0,
  totalItemsFinished: 0,
  totalItemsPending: 0,
  totalItemsActive: 0,
  loadingApi: false,
  loadingApiAction: false,
};

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {
    onLoadOrdersPending: (state, { payload }) => {
      state.ordersPending = [...state.ordersPending, ...payload.data];
      state.totalItemsPending = payload.total;
      state.loadingApi = false;
    },
    onLoadOrdersPendingFirst: (state, { payload }) => {
      state.ordersPending = [...payload.data];
      state.totalItemsPending = payload.total;
      state.loadingApi = false;
    },
    onLoadOrdersFinished: (state, { payload }) => {
      state.ordersFinished = [...state.ordersFinished, ...payload.data];
      state.totalItemsFinished = payload.total;

      state.loadingApi = false;
    },
    onLoadOrdersFinishedFirst: (state, { payload }) => {
      state.ordersFinished = [...payload.data];
      state.totalItemsFinished = payload.total;

      state.loadingApi = false;
    },
    setOffsetPending: (state, { payload }) => {
      state.offsetPending = payload;
    },
    setOffsetActive: (state, { payload }) => {
      state.offsetActive = payload;
    },
    setOffsetFinished: (state, { payload }) => {
      state.offsetFinished = payload;
    },
    odLoadOrdersActive: (state, { payload }) => {
      state.ordersActive = [...state.ordersActive, ...payload.data];
      state.totalItemsActive = payload.total;

      state.loadingApi = false;
    },
    odLoadOrdersActiveFirst: (state, { payload }) => {
      state.ordersActive = [...payload.data];
      state.totalItemsActive = payload.total;

      state.loadingApi = false;
    },
    onConfirmOrder: (state, { payload }) => {
      const newOrderConfirmed = payload;
      const newStateOrdersPending = state.ordersPending.filter(
        (order: any) => order.orderId !== newOrderConfirmed.orderId
      );
      const newStateOrdersActive = [...state.ordersActive, newOrderConfirmed];
      state.ordersPending = newStateOrdersPending;
      state.ordersActive = newStateOrdersActive;
    },
    onDeleteOrder: (state, { payload }) => {
      const { key, orderId } = payload;

      if (key === "pending") {
        const newState = state.ordersPending.filter(
          (order: any) => order.orderId !== orderId
        );
        state.ordersPending = newState;
      } else {
        const newState = state.ordersFinished.filter(
          (order: any) => order.orderId !== orderId
        );
        state.ordersFinished = newState;
      }
    },
    finishOrderActive: (state, { payload }) => {
      const newOrder = payload;
      let findOrder;

      const newStateOrdersActive = state.ordersActive.filter((order: any) => {
        if (order.orderId === newOrder.id) {
          findOrder = order;
          return;
        }
        return order;
      });
      const newStateOrdersFinished = [...state.ordersFinished, findOrder];
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
      state.loadingApiAction = false;
    },
    onFinishLoadingApi: (state) => {
      state.loadingApi = false;
    },
    onAddOrderPending: (state, { payload }) => {
      state.ordersPending = [payload, ...state.ordersPending];
      state.offsetPending = state.offsetPending + 1;
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
  finishOrderActive,
  setOffsetPending,
  onLoadOrdersPendingFirst,
  odLoadOrdersActiveFirst,
  onLoadOrdersFinishedFirst,
  setOffsetActive,
  setOffsetFinished,
} = orderSlice.actions;

export default orderSlice;
