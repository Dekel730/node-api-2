import express from 'express';
import {
	register,
	updateUser,
	deleteUser,
	login,
	refreshToken,
	logout,
} from '../controllers/userController';
import { authUser } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/refresh').post(refreshToken);
router.route('/').put(authUser, updateUser);
router.route('/').delete(authUser, deleteUser);

export default router;
