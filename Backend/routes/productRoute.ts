import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductBySellerId } from "../controllers/productController";

const router=Router();

router.post("/create-product",authenticateUser,multerMiddleware,createProduct)
router.get("/get-all-product",getAllProducts)
router.get("/get-product-by-Id/:id",authenticateUser,getProductById)
router.delete("/delete-product/:productId",authenticateUser,deleteProduct)
router.get("/get-product-by-sellerId/:sellerId",authenticateUser,getProductBySellerId)


export default router;