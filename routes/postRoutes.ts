import express from 'express';
import {
	createPost,
	getPostByUser,
	updatePost,
	getAllPosts,
	getPostById,
	deletePost,
} from '../controllers/postController';
import { authUser } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(authUser, createPost);
router.route('/').get(getPostByUser);
router.route('/all').get(getAllPosts);
router.route('/:id').put(authUser, updatePost);
router.route('/:id').get(getPostById);
router.route('/:id').delete(authUser, deletePost);

export default router;
