import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "./types";

const initialState: IUser = {
  user: {},
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    mostrarMensaje: (state, { payload }) => {
    },
    onAddUserData: (state, { payload }) => {
      console.log("onAddUserData")
      state.user = payload;
    },
    onUpdateKeys: (state, { payload }) => {
      const { data } = payload;
      console.log("onUpdateKeys")
      Object.keys(data).forEach((key) => {
        if (key in state.user) {
          // @ts-ignore
          state.user[key] = data[key];
        }
      });
    },
    onPurchasedPlan: (state) => {
      state.user.paymentMade = true;
    },
    onUpdateFcm: (state, { payload }) => {
      state.user.dispositivo = payload;
    },
    onApiConfigured: (state) => {
      state.user.apiConfigured = true;
    },
    onUserConfigured: (state, { payload }) => {
      state.user.nombre = payload.nombre;
      state.user.apellido = payload.apellido;
      state.user.userConfigured = true;
    },
    greenApiConfigured: (state) => {
      console.log("greenApiConfigured")
      state.user.greenApiConfigured = true;
      state.user.globalConfig = true;
    },
  },
});

export const {
  mostrarMensaje,
  onAddUserData,
  onUserConfigured,
  greenApiConfigured,
  onUpdateKeys,
  onApiConfigured,
  onPurchasedPlan,
  onUpdateFcm
} = userSlice.actions;
export const selectUser = (state: { user: IUser }) => state.user;

export default userSlice;
