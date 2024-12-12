import mongoose from 'mongoose';

export interface IUser {
	name: string;
	email: string;
	password: string;
	username: string;
}

const userScheme = new mongoose.Schema<IUser>({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
});

export default mongoose.model<IUser>('User', userScheme);

export interface UserDocument extends IUser, mongoose.Document {}
