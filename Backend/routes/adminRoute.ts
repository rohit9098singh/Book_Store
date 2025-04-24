
import express from "express"
import * as adminController from "../controllers/adminController"
import {authenticateUser} from "../middleware/authMiddleware"


const router=express.Router();

router.get("/dashboard-stats",adminController.getDashboardStats);
