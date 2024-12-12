import express from 'express';
import { createComment, getCommentByPost, getComment, updateComment, deleteComment } from '../controllers/commentController';
import { authUser } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(authUser,createComment);
router.route('/').get(getCommentByPost);
router.route('/:id').put(authUser,updateComment);
router.route('/:id').get(getComment);
router.route('/:id').delete(authUser,deleteComment);


export default router
