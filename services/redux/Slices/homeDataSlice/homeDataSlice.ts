import { createSlice } from "@reduxjs/toolkit";

interface  IinitialState {
  numberPedidos: number;
  numberClientes: number;
  numberIngresos: number;
  lastThreeOrders: any[]
  loaded: boolean
};

const initialState : IinitialState = {
  numberPedidos: 0,
  numberClientes: 0,
  numberIngresos: 0,
  lastThreeOrders: [],
  loaded: false
};

const homeDataSlice = createSlice({
  name: "homeDataSlice",
  initialState,
  reducers: {
    onAddStaticsAndData: (state, { payload }) => {
      state.numberClientes = payload.clients,
        state.numberIngresos = payload.revenue,
        state.numberPedidos = payload.orders,
        state.lastThreeOrders = payload.lastOrders
      state.loaded = true
    },
    onAddNewOrder: (state, { payload } : {payload : any}) => {
      const updatedOrders = [payload, ...state.lastThreeOrders];

      updatedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      state.lastThreeOrders = updatedOrders.slice(0, 3);
    },
    loadingData: (state ) => {
      state.loaded = false
    }
  }
});

export const {
  onAddStaticsAndData,
  onAddNewOrder,
  loadingData
} = homeDataSlice.actions;

export default homeDataSlice;
