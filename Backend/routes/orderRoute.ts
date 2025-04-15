import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import { createOrUpdateOrder, createPaymentWithRazorpay, getOrderById, getOrderOfLoggedInUser, handleRazorPayWebhook } from "../controllers/orderController";


const router = Router();

router.post("/create-order", authenticateUser,createOrUpdateOrder);
router.patch("/create-order/:id", authenticateUser, createOrUpdateOrder);

router.get("/user-order", authenticateUser,getOrderOfLoggedInUser);
router.get("/user-order/:id", authenticateUser,getOrderById);
router.post("/payment-razorpay",authenticateUser,createPaymentWithRazorpay)
router.post("/razorpay-webhook",authenticateUser,handleRazorPayWebhook)

export default router;
