import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDb from "./config/dbConnect"
import authRoute from "./routes/authRouter"
import productRoute from "./routes/productRoute"
import cartRoute from "./routes/cartRoute"
import wishlistRoute from "./routes/wishListRoute"
import addressRoute from "./routes/addressRoute"
import userRoute from "./routes/userRoute"
import orderRoute from "./routes/orderRoute"

dotenv.config();

const PORT: number = Number(process.env.PORT) || 8080;


const app=express();

const corsOption={
    origin:process.env.FRONTEND_URL,
    credentials: true,
}

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/cart",cartRoute);
app.use("/api/wishlist",wishlistRoute);
app.use("/api/user/address",addressRoute);
app.use("/api/user",userRoute);
app.use("/api/order",orderRoute);

const startServer = async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(" Failed to connect to MongoDB. Server not started.", error);
        process.exit(1);
    }
};

startServer();


