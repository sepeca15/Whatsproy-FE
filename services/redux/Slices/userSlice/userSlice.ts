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
      console.log(payload);
    },
    onAddUserData: (state, { payload }) => {
      state.user = payload;
    },
    onUpdateKeys: (state, { payload }) => {
      const { data } = payload;

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
    onApiConfigured: (state) => {
      state.user.apiConfigured = true;
    },
    onUserConfigured: (state, { payload }) => {
      state.user.nombre = payload.nombre;
      state.user.apellido = payload.apellido;
      state.user.userConfigured = true;
    },
    greenApiConfigured: (state) => {
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
} = userSlice.actions;
export const selectUser = (state: { user: IUser }) => state.user;

export default userSlice;
