import express from "express";
import { register, updateUser, deleteUser } from "../controllers/userController.js";
import { authUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/").put(authUser, updateUser);
router.route('/').delete(authUser, deleteUser);

export default router;