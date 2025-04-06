import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { updateUserProfile } from "../controllers/userController";



const router = Router();

router.put("/profile/update/:userId", authenticateUser,updateUserProfile ); // put update karne ke liye isliye use kiye hai patch nhi use kiye hai kyuke patch me hame strictly sare column update karna zaruri hai but put me jo required sirf usko kar sakte hai hm


export default router;
