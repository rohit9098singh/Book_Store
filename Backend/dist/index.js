"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const cartRoute_1 = __importDefault(require("./routes/cartRoute"));
const wishListRoute_1 = __importDefault(require("./routes/wishListRoute"));
const addressRoute_1 = __importDefault(require("./routes/addressRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const googleStrategy_1 = __importDefault(require("./controllers/strategy/googleStrategy"));
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 8080;
const app = (0, express_1.default)();
const corsOption = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};
app.use((0, cors_1.default)(corsOption));
app.use(express_1.default.json());
app.use(googleStrategy_1.default.initialize());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", authRouter_1.default);
app.use("/api/product", productRoute_1.default);
app.use("/api/cart", cartRoute_1.default);
app.use("/api/wishlist", wishListRoute_1.default);
app.use("/api/user/address", addressRoute_1.default);
app.use("/api/user", userRoute_1.default);
app.use("/api/order", orderRoute_1.default);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConnect_1.default)();
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error(" Failed to connect to MongoDB. Server not started.", error);
        process.exit(1);
    }
});
startServer();
