import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";


const register = asyncHandler(async (req, res) => {
    const { name, email, password, username } = req.body;
    if (!name || !email || !password || !username) {
        res.status(400);
        throw new Error("Please provide name, email, password and username");
    }
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        username
    })
    res.json({
        success: true,
        user: newUser
    })
});

const updateUser = asyncHandler(async (req, res) => {
    const { name, email, username } = req.body;
    if (!name || !email || !username) {
        res.status(400);
        throw new Error("Please provide name, email and username");
    }
    if (email !== req.user.email) {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }
    }
    if (username !== req.user.username) {
        const userExists = await User.findOne({ username });
        if (userExists) {
            res.status(400);
            throw new Error("Username already exists");
        }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        name,
        email,
        username
    }, { new: true });
    res.json({
        success: true,
        user: updatedUser
    })
});

const deleteUser = asyncHandler(async (req, res) => {
    let promises = [];
    promises.push(User.findByIdAndDelete(req.user._id));
    promises.push(Post.deleteMany({ user: req.user._id }));
    promises.push(Comment.deleteMany({ user: req.user._id }));
    await Promise.all(promises);
    res.json({
        success: true
    })
});

export { register, updateUser, deleteUser };