import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import {
  createOrUpdateAddressByUserId,
  getAddressByUserId
} from "../controllers/addressController";

const router = Router();

router.post("/create-or-update-address-by-userId", authenticateUser, createOrUpdateAddressByUserId);

router.get("/get-address-by-userId", authenticateUser, getAddressByUserId);

export default router;
