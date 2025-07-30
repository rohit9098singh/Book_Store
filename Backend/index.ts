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
import adminRoute from "./routes/adminRoute"
import passport from "./controllers/strategy/googleStrategy"
import { CorsOptions } from "cors";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 8080;


const app=express();

const allowedOrigins = [
  "https://book-store-4do3.vercel.app",
  "http://localhost:3000"
];

const corsOption: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") // ✅ allow all Vercel URLs
    ) {
      callback(null, true);
    } else {
      callback(null, false); // ❗ don’t throw error, just block
    }
  },
  credentials: true,
};


app.use(cors(corsOption));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/product",productRoute);
app.use("/api/cart",cartRoute);
app.use("/api/wishlist",wishlistRoute);
app.use("/api/user/address",addressRoute);
app.use("/api/user",userRoute);
app.use("/api/order",orderRoute);

app.use("/api/admin",adminRoute)

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


