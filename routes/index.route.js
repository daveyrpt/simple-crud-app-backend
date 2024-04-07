import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.middleware.js";
import { refreshToken } from "../controllers/refreshToken.controller.js";

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout)

export default router;