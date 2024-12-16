import { ObjectId } from "mongoose";
import Post, { PostDocument } from "../models/postModel";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

const createPost = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;
    const { message }: { message: string } = req.body;
    if (!message) {
        res.status(400);
        throw new Error("Please provide message and sender");
    }
    const newPost: PostDocument = await Post.create({
        message,
        user: user._id,
    });
    res.status(201);
    res.json({
        success: true,
        post: newPost,
    });
});

const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const posts: PostDocument[] = await Post.find({});
    res.json({
        success: true,
        posts,
    });
});

const getPostById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const post: PostDocument | null = await Post.findById(id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    res.json({
        success: true,
        post,
    });
});

const getPostByUser = asyncHandler(async (req: Request, res: Response) => {
    const user = req.query.user;
    const posts: PostDocument[] = await Post.find({ user });
    res.json({
        success: true,
        posts,
    });
});

const updatePost = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;
    const { id } = req.params;
    const { message }: { message: string } = req.body;
    if (!message) {
        res.status(400);
        throw new Error("Please provide message");
    }
    const post: PostDocument | null = await Post.findById(id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    if (post.user.toString() !== (user._id as ObjectId).toString()) {
        res.status(401);
        throw new Error("You are not authorized to update this post");
    }
    post.message = message;
    await post.save();
    res.json({
        success: true,
        post,
    });
});

const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;
    const { id } = req.params;
    const post: PostDocument | null = await Post.findById(id);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    if (post.user.toString() !== (user._id as ObjectId).toString()) {
        res.status(401);
        throw new Error("You are not authorized to delete this post");
    }
    await Post.findByIdAndDelete(id);
    res.json({
        success: true,
    });
});

export {
    createPost,
    getPostByUser,
    updatePost,
    getAllPosts,
    getPostById,
    deletePost,
};
