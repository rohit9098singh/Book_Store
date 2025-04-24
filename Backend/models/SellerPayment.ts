import mongoose, { Document, Schema } from "mongoose";

export interface ISellerPayment extends Document{
    seller:mongoose.Types.ObjectId;
    order:mongoose.Types.ObjectId;
    product:mongoose.Types.ObjectId;
    amount:number;
    paymentMethod:string;
    paymentStatus:"pending" | "completed" | "failed";
    processedBy:mongoose.Types.ObjectId;
    notes?:string;
}

const sellerpaymentSchema=new Schema<ISellerPayment>(
    {
        seller:{type:Schema.Types.ObjectId,ref:"User",required:true},// Yeh field us seller ka ID store karti hai jise payment mila.
        order:{type:Schema.Types.ObjectId,ref:"Order",required:true},// Kis order ke liye payment hua — uska ID store karta hai.
        product:{type:Schema.Types.ObjectId,ref:"Product",required:true},// Kaunsa product sell hua jispe payment mila — uska ID.
        amount:{type:Number,required:true},// Kitna paisa seller ko diya gaya 
        paymentMethod:{type:String,required:true}, // e.g., Bank, UPI, Wallet, etc.
        paymentStatus:{type:String,enum:["pending","completed","failed"],default:"pending"},// Payment complete hua, fail hua ya abhi pending hai — uska status
        processedBy:{type:Schema.Types.ObjectId,ref:"User",required:true}, // Kis user/admin ne ye payment process kiya — uska ID store hota hai.
        notes:{type:String}// Additional info or comments
    },
    {
        timestamps:true
    }
)

export default mongoose.model<ISellerPayment>("Sellerpayment",sellerpaymentSchema)