import Router from "express";
import { getChat, deleteChat } from "../controllers/chatControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = Router();

router.route("/").post(validateToken, getChat);
router.route("/delete").post(validateToken, deleteChat);

export default router;
