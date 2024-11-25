import express from "express";
import { register, updateUser, deleteUser, login, refreshToken } from "../controllers/userController.js";
import { authUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refreshToken);
router.route("/").put(authUser, updateUser);
router.route('/').delete(authUser, deleteUser);

export default router;