import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";


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
})

export { register }