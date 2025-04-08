import { Router } from "express";
import {
  addToCart,
  getCartByUserId,
  removeFromCart
} from "../controllers/cartController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/add-to-cart", authenticateUser, addToCart);
router.get("/:userId", authenticateUser, getCartByUserId);
router.delete("/remove/:productId", authenticateUser, removeFromCart);

export default router;
