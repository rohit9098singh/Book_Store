import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import { addToWishList, getWishListByUserId, removeFromWishList } from "../controllers/wishListController";

const router = Router();

router.post("/addToWishlist", authenticateUser, addToWishList);
router.get("/:userId", authenticateUser, getWishListByUserId);
router.delete("/remove/:productId", authenticateUser, removeFromWishList);

export default router;
