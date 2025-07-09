import { createSlice } from "@reduxjs/toolkit"

interface ISaleByCat {
    categoryId: number;
    categoryName: string;
    totalVentas: number;
    porcentaje: number;
}

interface ISalesOverview {
    average: number,
    previous: number,
    total: number,
    variation: number,
}

interface ISalesChart {
    monthlySales: any[],
    labels: any[],
    period: string,
}

interface IResumeSales {
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
}

interface IInitialState {
    salesByCategory: ISaleByCat[];
    resumeSales: IResumeSales | null;
    salesChart: ISalesChart;
    salesOverview: ISalesOverview
    loadingApi: boolean,
    dataLoaded: boolean
}

const initialState: IInitialState = {
    salesByCategory: [],
    resumeSales: null,
    salesChart: {
        labels: [],
        monthlySales: [],
        period: 'mensual'
    },
    salesOverview: {
        average: 0,
        previous: 0,
        total: 0,
        variation: 0
    },
    loadingApi: true,
    dataLoaded: false
}

const salesSlice = createSlice({
    name: "salesSlice",
    initialState,
    reducers: {
        onLoadData: (state, { payload }) => {
            const { resumeSales, salesOverview, salesByCategory, salesChart } = payload;

            state.resumeSales = resumeSales;
            state.salesByCategory = Array.isArray(salesByCategory) ? salesByCategory : [];
            state.salesChart = {
                labels: salesChart?.labels ?? [],
                monthlySales: salesChart?.monthlySales ?? [],
                period: salesChart?.period ?? "mensual",
            };
            state.salesOverview = salesOverview
            state.dataLoaded = true
        },
        onStartLoadingApi: (state) => {
            state.loadingApi = true;
        },
        onEndLoadingApi: (state) => {
            state.loadingApi = false
        }
    }
})

export const {
    onLoadData,
    onStartLoadingApi,
    onEndLoadingApi
} = salesSlice.actions

export default salesSlice;