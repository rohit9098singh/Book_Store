import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface checkoutState{
    steps:"cart" | "address" | "payment"
    orderId: string | null,
    orderAmount:number | null,

}

const initialState:checkoutState={
    steps:"cart",
    orderId:null,
    orderAmount:null
}


const checkoutSlice=createSlice({
    name:"checkout",
    initialState,
    reducers:{
        setCheckoutSteps:(state,action:PayloadAction<"cart" | "address" | "payment">)=>{
             state.steps=action.payload;
        },
        setOrderId:(state,action:PayloadAction<string | null>)=>{
               state.orderId=action.payload
        },
        setOrderAmount:(state,action:PayloadAction<number | null>)=>{
               state.orderAmount=action.payload
        },
        resetCheckout:(state)=>{
             state.steps="cart",
             state.orderAmount=null
        }
    },

})

export const {setCheckoutSteps,setOrderId,setOrderAmount,resetCheckout}=checkoutSlice.actions;
export default checkoutSlice.reducer;