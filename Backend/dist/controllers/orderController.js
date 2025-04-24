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
exports.handleRazorPayWebhook = exports.createPaymentWithRazorpay = exports.getOrderOfLoggedInUser = exports.getOrderById = exports.createOrUpdateOrder = void 0;
const CartItem_1 = __importDefault(require("../models/CartItem"));
const responseHandler_1 = require("../utils/responseHandler");
const Order_1 = __importDefault(require("../models/Order"));
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});
const createOrUpdateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { orderId, shippingAddress, paymentMethod, totalAmount, paymentDetails, } = req.body;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 400, "User not authenticated");
        }
        const cart = yield CartItem_1.default.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Your cart seems to be empty");
        }
        let order;
        if (orderId) {
            //  If orderId is sent from frontend
            order = yield Order_1.default.findById(orderId);
            if (!order) {
                return (0, responseHandler_1.response)(res, 404, "Order not found with given ID");
            }
        }
        else {
            //  If no orderId is sent, try to find a pending order for the user
            order = yield Order_1.default.findOne({ user: userId, status: "pending" });
        }
        if (order) {
            //  Update existing order
            order.items = cart.items; // in case cart has changed
            order.shippingAddress = shippingAddress || order.shippingAddress;
            order.paymentMethod = paymentMethod || order.paymentMethod;
            order.totalAmount = totalAmount || order.totalAmount;
            if (paymentDetails) {
                order.paymentDetails = paymentDetails;
                order.paymentStatus = "complete";
                order.status = "processing";
            }
            yield order.save();
            //  Clear cart if payment done
            if (paymentDetails) {
                yield CartItem_1.default.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { new: true });
            }
            return (0, responseHandler_1.response)(res, 200, "Order updated successfully", order);
        }
        //  No existing order, create a new one
        const newOrder = new Order_1.default({
            user: userId,
            items: cart.items,
            shippingAddress,
            paymentMethod,
            totalAmount,
            paymentDetails: paymentDetails || null,
            paymentStatus: paymentDetails ? "complete" : "pending",
            status: paymentDetails ? "processing" : "pending",
        });
        yield newOrder.save();
        //  Clear cart if payment done
        if (paymentDetails) {
            yield CartItem_1.default.findOneAndUpdate({ user: userId }, { $set: { items: [] } }, { new: true });
        }
        return (0, responseHandler_1.response)(res, 201, "Order created successfully", newOrder);
    }
    catch (error) {
        console.error("backend error", error);
        return (0, responseHandler_1.response)(res, 500, "Something went wrong", error);
    }
});
exports.createOrUpdateOrder = createOrUpdateOrder;
// koi bhi user ka order check krne ke liye for
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const order = yield Order_1.default.findById(orderId)
            .populate("user", "name email phoneNumber") // only name and email from User
            .populate("shippingAddress") // entire Address
            .populate({
            path: "items.product", // nested populate
            model: "Product",
        });
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order not found for this ID");
        }
        return (0, responseHandler_1.response)(res, 200, "Order fetched successfully", order);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.getOrderById = getOrderById;
const getOrderOfLoggedInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 401, "Unauthorized: User ID missing");
        }
        const orders = yield Order_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("shippingAddress")
            .populate({
            path: "items.product",
            model: "Product",
        });
        return (0, responseHandler_1.response)(res, 200, "Orders fetched successfully", orders);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal server error", error.message);
    }
});
exports.getOrderOfLoggedInUser = getOrderOfLoggedInUser;
//======================================== Razor Pay Api's =============================================
const createPaymentWithRazorpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const order = yield Order_1.default.findById(orderId);
        if (!order) {
            return (0, responseHandler_1.response)(res, 404, "Order Not Found");
        }
        const razorPayOrder = yield razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: `reciept_order_${order._id.toString()}`,
        });
        return (0, responseHandler_1.response)(res, 200, "Razorpay Order and payment  Created successfully", { order: razorPayOrder });
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Error creating Razorpay order", error.message);
    }
});
exports.createPaymentWithRazorpay = createPaymentWithRazorpay;
const handleRazorPayWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = process.env.WEBHOOK_SECRET;
        // 1️ Razorpay se aayi request asli hai ya nahi, ye verify karne ke liye HMAC signature banate hain
        const shasum = crypto_1.default.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body)); // poore body ka fingerprint banate hain
        const digest = shasum.digest("hex"); // uska hex format ka output lete hain
        // 2 Jo signature Razorpay ne bheja hai usse compare karte hain
        const signature = req.headers["x-razorpay-signature"];
        if (digest === signature) {
            // 3 Webhook se payment aur order ka data nikalte hain
            const paymentId = req.body.payload.payment.entity.id;
            const razorpayOrderId = req.body.payload.payment.entity.order_id;
            // 4️ Apne database me us order ko update karte hain jiska payment hua hai
            yield Order_1.default.findOneAndUpdate({ "paymentDetails.razorpay_order_id": razorpayOrderId }, // jiska order_id match kare
            {
                paymentStatus: "complete", // payment successful
                status: "processing", // ab order process hone laga
                "paymentDetails.razorpay_payment_id": paymentId, // payment ka ID save kar lete hain
            }, { new: true });
            return (0, responseHandler_1.response)(res, 200, "Webhook processed successfully");
        }
        else {
            // 5️ Signature match nahi hua — iska matlab request fake ho sakti hai
            return (0, responseHandler_1.response)(res, 400, "Invalid signature");
        }
    }
    catch (error) {
        console.error("Webhook Error:", error.message);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error", error.message);
    }
});
exports.handleRazorPayWebhook = handleRazorPayWebhook;
{
    /**
     *   Razor pay working
     *
     *   1)The Razorpay SDK has a built-in orders object [with a create() method.]
     *     So once you call new Razorpay(...), you get access to that structure:
     *
     *     ex:->razorpay.orders.create({...})
     *
     */
}
