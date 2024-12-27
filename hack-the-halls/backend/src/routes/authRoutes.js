import { Router } from "express";

import { registerUser, loginUser } from "../controllers/authControllers.js";

const router = Router();

router.post("/signUp", registerUser);

router.post("/login", loginUser);

export default router;
