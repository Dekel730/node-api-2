import Post from '../models/postModel.js';
import asyncHandler from 'express-async-handler';

const createPost = asyncHandler(async (req, res) => {
	const { message } = req.body;
	if (!message) {
		res.status(400);
		throw new Error('Please provide message and sender');
	}
	const newPost = await Post.create({
		message,
		user: req.user._id,
	});
	res.status(201);
	res.json({
		success: true,
		post: newPost,
	});
});

const getAllPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find({});
	res.json({
		success: true,
		posts,
	});
});

const getPostById = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}
	res.json({
		success: true,
		post,
	});
});

const getPostByUser = asyncHandler(async (req, res) => {
	const user = req.query.user;
	const posts = await Post.find({ user });
	res.json({
		success: true,
		posts,
	});
});

const updatePost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { message } = req.body;
	if (!message) {
		res.status(400);
		throw new Error('Please provide message');
	}
	const post = await Post.findById(id);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}
	if (post.user.toString() !== req.user._id.toString()) {
		res.status(401);
		throw new Error('You are not authorized to update this post');
	}
	post.message = message;
	await post.save();
	res.json({
		success: true,
		post,
	});
});

const deletePost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	if (!post) {
		res.status(404);
		throw new Error('Post not found');
	}
	if (post.user.toString() !== req.user._id.toString()) {
		res.status(401);
		throw new Error('You are not authorized to delete this post');
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
