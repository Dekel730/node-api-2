import mongoose, { ObjectId } from 'mongoose';

interface IPost {
	message: string;
	user: ObjectId;
}

const postScheme = new mongoose.Schema<IPost>(
	{
		message: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model<IPost>('Post', postScheme);

export interface PostDocument extends IPost, mongoose.Document {}
