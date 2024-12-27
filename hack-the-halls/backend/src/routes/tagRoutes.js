import Router from "express";
import {
  getAllTags,
  postTag,
  updateTag,
} from "../controllers/tagcontrollers.js";
import { validateToken } from "../middleware/validateToken.js";

const router = Router();


router.route("/getAllTags").post(validateToken, getAllTags);
router.route("/").post(validateToken, postTag);
router.route("/").put(validateToken, updateTag);


export default router;
