import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const authUser = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                res.status(404);
                throw new Error('User not found');
            }
            next();
        } catch(error){
            console.log(error);
            res.status(400)
            throw new Error('Token failed');
        }
    }
    if (!token) {
        res.status(400);
        throw new Error('No token');
    }
})

export { authUser };