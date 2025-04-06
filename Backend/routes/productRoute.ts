import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { multerMiddleware } from "../config/cloudnaryConfig";
import { createProduct, deleteProduct, getAllProducts, getProductById, getProductBySellerId } from "../controllers/productController";

const router=Router();

router.post("/createProduct",authenticateUser,multerMiddleware,createProduct)
router.get("/getAllProduct",authenticateUser,getAllProducts)
router.get("/getProductById/:id",authenticateUser,getProductById)
router.delete("/deleteProduct/:productId",authenticateUser,deleteProduct)
router.get("/getProductBySellerId/:sellerId",authenticateUser,getProductBySellerId)


export default router;