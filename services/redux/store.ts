import {configureStore} from '@reduxjs/toolkit'
import userSlice from './Slices/userSlice/userSlice'

export const store = configureStore({
    reducer:{
        user: userSlice.reducer
    }
})