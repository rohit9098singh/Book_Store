import { CartItem } from "@/lib/types/type";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
export interface cartState{
    _id:string;
    user:string;
    items:CartItem[];
    createdAt:string;
    updateAt:string;
}

const initialState: cartState = {
    _id: "",
    user: "",
    items: [],
    createdAt: "",
    updateAt: ""
  };
  

  const cartSlice=createSlice({
      name:"cart",
      initialState,
      reducers:{
            setCart:(state,action:PayloadAction<any>)=>{
                return {...state,...action.payload}
            },
            addToCartSlice:(state,action:PayloadAction<any>)=>{
                return {...state,...action.payload}
            },
            clearCart:()=>initialState,
      }
  })
  export const {setCart,addToCartSlice,clearCart}=cartSlice.actions;
  export default cartSlice.reducer

{
    /***
     *    REDUCER – Yeh hai "kaise update hoga" ka logic
     *   ====>     Reducer ek fixed logic (template)   define karta hai jaise:
     *
     *            "Agar action ka type SET_USER hai to user ko update *karo payload se."
     * 
     * 
     * . DISPATCH – Yeh hai "set karne" ka kaam
     *             =>useState mein setUser() hota hai
     *     Redux mein dispatch() hota hai. 
     *    
     *              as difference ye hai ki dispatch() ek action object leta hai
     * 
     *  USESLECTOR - useSelector ek React-Redux hook hai 
     *               Iska kaam hai: Redux store se state nikal ke lana
     */
}
 

