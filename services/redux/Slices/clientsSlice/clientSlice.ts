import { createSlice } from "@reduxjs/toolkit";

interface IinitialState {
    clientsData: any[]
    loaded: boolean,
    offset: number;
    limit: number;
    totalItems: number;
    loadingApi: boolean;

};

const initialState: IinitialState = {
    clientsData: [],
    loaded: false,
    offset: 0,
    limit: 5,
    totalItems: 0,
    loadingApi: false
};

const clientSlice = createSlice({
    name: "clientSlice",
    initialState,
    reducers: {
        onLoadData: (state, { payload }) => {
            state.clientsData = payload.reset ? payload.clients : [...state.clientsData, ...payload.clients]
            state.offset = payload.offset
            state.totalItems = payload.totalItems
            state.loaded = true
        },
        onStartLoadData: (state) => {
            state.loadingApi = true;
        },
        onEndLoadData: (state) => {
            state.loadingApi = false;
        }
    }
});

export const {
    onLoadData,
    onStartLoadData,
    onEndLoadData
} = clientSlice.actions;

export default clientSlice;
