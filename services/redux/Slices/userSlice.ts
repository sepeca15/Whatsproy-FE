import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:"userSlice",
    initialState:{
        user:{},
        isConfig:true
    },
    reducers:{
        mostrarMensaje:(state,{payload})=> {
            console.log(payload);
        }
    }
    
})

export const {mostrarMensaje} = userSlice.actions

export default userSlice;