import asyncHandler from 'express-async-handler';
import User, { UserDocument } from '../models/userModel';
import bcrypt from 'bcrypt';
import Post from '../models/postModel';
import Comment from '../models/commentModel';
import jwt, { JwtPayload } from 'jsonwebtoken';

const register = asyncHandler(async (req, res) => {
	const {
		name,
		email,
		password,
		username,
	}: { name: string; email: string; password: string; username: string } =
		req.body;
	if (!name || !email || !password || !username) {
		res.status(400);
		throw new Error('Please provide name, email, password and username');
	}
	const userExists: UserDocument | null = await User.findOne({
		$or: [{ email }, { username }],
	});
	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}
	const salt: string = await bcrypt.genSalt(10);
	const hashedPassword: string = await bcrypt.hash(password, salt);
	const newUser = await User.create({
		name,
		email,
		password: hashedPassword,
		username,
	});
	res.status(201);
	res.json({
		success: true,
		user: {
			_id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			username: newUser.username,
		},
	});
});

const updateUser = asyncHandler(async (req, res) => {
	const user = req.user!;
	const {
		name,
		email,
		username,
	}: { name: string; email: string; username: string } = req.body;
	if (!name || !email || !username) {
		res.status(400);
		throw new Error('Please provide name, email and username');
	}
	if (email !== user.email) {
		const userExists: UserDocument | null = await User.findOne({ email });
		if (userExists) {
			res.status(400);
			throw new Error('User already exists');
		}
	}
	if (username !== user.username) {
		const userExists = await User.findOne({ username });
		if (userExists) {
			res.status(400);
			throw new Error('Username already exists');
		}
	}
	const updatedUser: UserDocument | null = await User.findByIdAndUpdate(
		user._id,
		{
			name,
			email,
			username,
		},
		{ new: true }
	);
	res.json({
		success: true,
		user: {
			_id: updatedUser!._id,
			name: updatedUser!.name,
			email: updatedUser!.email,
			username: updatedUser!.username,
		},
	});
});

const deleteUser = asyncHandler(async (req, res) => {
	const user = req.user!;
	let promises: Promise<any>[] = [];
	promises.push(User.findByIdAndDelete(user._id));
	promises.push(Post.deleteMany({ user: user._id }));
	promises.push(Comment.deleteMany({ user: user._id }));
	await Promise.all(promises);
	res.json({
		success: true,
	});
});

const login = asyncHandler(async (req, res) => {
	const { email, password }: { email: string; password: string } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error('Please provide email and password');
	}
	const user = await User.findOne({ email });
	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}
	const isMatch: boolean = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		res.status(401);
		throw new Error('Invalid credentials');
	}
	const accessToken: string = jwt.sign(
		{ id: user._id },
		process.env.JWT_SECRET!,
		{
			expiresIn: '1h',
		}
	);
	const refreshToken: string = jwt.sign(
		{ id: user._id },
		process.env.JWT_SECRET_REFRESH!,
	);

	user.tokens.push(refreshToken);
	await user.save();
	res.json({
		success: true,
		user: {
			_id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
		},
		accessToken,
		refreshToken,
	});
});

const refreshToken = asyncHandler(async (req, res) => {
	const authHeader = req.headers['authorization'];
	const refreshToken = authHeader && authHeader.split(' ')[1];
	if (!refreshToken) {
		res.status(400);
		throw new Error('No refresh token provided.');
	}
	let decoded;
	try {
		decoded = jwt.verify(
			refreshToken,
			process.env.JWT_SECRET_REFRESH!
		) as JwtPayload;
	} catch (error) {
		res.status(400);
		throw new Error('Token failed');
	}

	const user = await User.findById(decoded.id);
	if (!user) {
		res.status(404);
		throw new Error('User not found');
	}
	if (!user.tokens.includes(refreshToken)) {
		user.tokens = [];
		await user.save();
		res.status(401);
		throw new Error('Invalid refresh token');
	}
	const accessToken: string = jwt.sign(
		{ id: decoded.id },
		process.env.JWT_SECRET!,
		{ expiresIn: '1h' }
	);

	const newRefreshToken: string = jwt.sign(
		{ id: decoded.id },
		process.env.JWT_SECRET_REFRESH!
	);

	user.tokens[user.tokens.indexOf(refreshToken)] = newRefreshToken;
	await user.save();

	res.json({
		success: true,
		accessToken,
		refreshToken: newRefreshToken,
	});
});

export { register, updateUser, deleteUser, login, refreshToken };
