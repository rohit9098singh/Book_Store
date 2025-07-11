
import express from "express"
import * as adminController from "../controllers/adminController"
import {authenticateUser} from "../middleware/authMiddleware"
import { IsAdmin } from "../middleware/adminMiddleWare";


 const router=express.Router();

router.get("/dashboard-stats",adminController.getDashboardStats);

// apply both middleware to all admin route
router.use(authenticateUser,IsAdmin);
// other managment route

router.get("/orders",adminController.getAllOrders);
router.put("/orders/:id",adminController.updateOrder);

// seller payment managment route
router.post("/process-seller-payment/:orderId",adminController.processSellerPayment)
router.get("/seller-payments",adminController.getSellerPayment)

export default router;
