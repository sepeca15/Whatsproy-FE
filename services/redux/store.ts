import {configureStore} from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice/userSlice'
import orderSlice from './Slices/ordersSlice/orderSlice'

export const store = configureStore({
    reducer:{
        user: userSlice.reducer,
        orders: orderSlice.reducer
    }
})