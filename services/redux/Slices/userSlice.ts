import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:"userSlice",
    initialState:{
        user:{},
    },
    reducers:{
        mostrarMensaje:(state,{payload})=> {
            console.log(payload);
        }
    }
    
})

export const {mostrarMensaje} = userSlice.actions

export default userSlice;