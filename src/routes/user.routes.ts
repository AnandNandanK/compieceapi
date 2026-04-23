import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getUserProfile } from "../controllers/userControllers.js";



const router = Router();

router.get("/me",authMiddleware,getUserProfile );




export default router;
