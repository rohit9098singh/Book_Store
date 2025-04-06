import { Router } from "express";

import { authenticateUser } from "../middleware/authMiddleware";
import {
  createOrUpdateAddressByUserId,
  getAddressByUserId
} from "../controllers/addressController";

const router = Router();

router.post("/createOrUpdateAddressByUserId", authenticateUser, createOrUpdateAddressByUserId);

router.get("/getAddressByUserId", authenticateUser, getAddressByUserId);

export default router;
