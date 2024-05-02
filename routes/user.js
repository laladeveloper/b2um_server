import express from 'express';
import { createUser, getMe, loginUser, userInfo } from '../controllers/userCtrl.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// /api/user/new 
router.route("/new").post(createUser);

// /api/user/login
router.route("/login").post(loginUser);

// /api/user/userinfo
router.route("/userifno").get(userInfo)

// /api/user/me
router.route("/me").get(protect ,getMe)

export default router ;

// api key from mailchemp
// 78f2b6d38db87181262d08ff4d03bb72-us18