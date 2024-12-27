import { Router } from "express";

import { postLecture, getLectures } from "../controllers/lectureControllers.js";
import { validateToken } from "../middleware/validateToken.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.post("/", validateToken, upload.single("file"), postLecture);
router.post("/getLectures", validateToken, getLectures);

export default router;
