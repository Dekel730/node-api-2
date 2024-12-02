import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import jwt from "jsonwebtoken";


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
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username
        }
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

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res
    .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
    .header('Authorization', accessToken);
    res.json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        }
    })
});

const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        res.status(400);
        throw new Error('No refresh token provided.');
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.header('Authorization', accessToken);
        res.json({
            success: true
        })
    } catch (error) {
        res.status(400);
        throw new Error('Token failed');
    }
});

export { register, updateUser, deleteUser, login, refreshToken };