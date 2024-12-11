import { ObjectId } from 'mongoose';
import Comment from '../models/commentModel';
import Post from '../models/postModel';
import asyncHandler from "express-async-handler";

const createComment = asyncHandler(async (req, res) => {
    const user = req.user!;
    const { message, post } = req.body;
    if (!message || !post) {
        res.status(400);
        throw new Error("Please provide message and post");
    }
    const postExists = await Post.findById(post);
    if (!postExists) {
        res.status(404);
        throw new Error("Post not found");
    }
    const newComment = await Comment.create({
        message,
        post,
        user: user._id
    })
    res.status(201);
    res.json({
        success: true,
        comment: newComment
    })
})

const getComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
        res.status(404);
        throw new Error("Comment not found");
    }
    res.json({
        success: true,
        comment
    })
})

const getCommentByPost = asyncHandler(async (req, res) => {
    const post = req.query.post;
    const comments = await Comment.find({ post });
    res.json({
        success: true,
        comments
    })
})

const updateComment = asyncHandler(async (req, res) => {
    const user = req.user!;
    const { id } = req.params;
    const { message } = req.body;
    if (!message) {
        res.status(400);
        throw new Error("Please provide message");
    }
    const comment = await Comment.findById(id);
    if (!comment) {
        res.status(404);
        throw new Error("Comment not found");
    }
    if (comment.user.toString() !== (user._id as ObjectId).toString()) {
        res.status(401);
        throw new Error("You are not authorized to update this comment");
    }
    comment.message = message;
    await comment.save();
    res.json({
        success: true,
        comment
    })
});

const deleteComment = asyncHandler(async (req, res) => {
    const user = req.user!;
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) {
        res.status(404);
        throw new Error("Comment not found");
    }
    if (comment.user.toString() !== (user._id as ObjectId).toString()) {
        res.status(401);
        throw new Error("You are not authorized to delete this comment");
    }
    await Comment.findByIdAndDelete(id);
    res.json({
        success: true
    })
});

export { createComment, getCommentByPost, getComment, updateComment, deleteComment };