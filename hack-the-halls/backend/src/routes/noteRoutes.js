import Router from "express";
import {
  getNote,
  postNote,
  updateNote,
} from "../controllers/noteControllers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = Router();

router.route("/getNotes").post(validateToken, getNote);
router.route("/").post(validateToken, postNote);
router.route("/").put(validateToken, updateNote);


export default router;
