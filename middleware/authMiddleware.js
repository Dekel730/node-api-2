import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const authUser = asyncHandler(async (req, res, next) => {
	const accessToken = req.headers['authorization'];
	const refreshToken = req.cookies['refreshToken'];

	if (!accessToken && !refreshToken) {
		res.status(401);
		throw new Error('Access Denied. No token provided.');
	}

	try {
		const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id).select('-password');
		next();
	} catch (error) {
		if (!refreshToken) {
			res.status(401);
			throw new Error('Access Denied. No token provided.');
		}

		try {
			const decoded = jwt.verify(
				refreshToken,
				process.env.JWT_SECRET_REFRESH
			);
			const accessToken = jwt.sign(
				{ id: decoded.id },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'strict',
			}).header('Authorization', accessToken);
			res.status(200).send({
				success: false,
				token: true,
				message: 'Access token refreshed',
			});
		} catch (error) {
			res.status(401);
			throw new Error('Access Denied. No token provided.');
		}
	}
});

export { authUser };
