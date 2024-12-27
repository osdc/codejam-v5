import Router from "express";
import { getUserData } from "../controllers/userControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = Router();

router.route("/").get(validateToken, getUserData);

export default router;
