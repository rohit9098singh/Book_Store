import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem extends Document{
    product:mongoose.Types.ObjectId;
    quantity:number;
    
}

export interface Icart extends Document{
    user:mongoose.Types.ObjectId;
    items: ICartItem[]

}

const cartItemSchema=new Schema<ICartItem>({
    product:{type:Schema.Types.ObjectId,ref:"Product",required:true},
    quantity:{type:Number,required:true,min:1}
})

const cartSchema=new Schema<Icart>({
    user:{type:Schema.Types.ObjectId,ref:"User",required:true},
    items:[cartItemSchema]
},{timestamps:true})

const Cart = mongoose.model<Icart>("Cart", cartSchema)
export default Cart;

