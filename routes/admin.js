import express from "express"
import { getMe } from "../controllers/userCtrl.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.route("/admin").get(protect,getMe)

export default router;