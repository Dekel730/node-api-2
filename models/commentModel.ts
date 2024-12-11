import mongoose from 'mongoose';

interface IComment {
	message: string;
	post: mongoose.Schema.Types.ObjectId;
	user: mongoose.Schema.Types.ObjectId;
}

const commentScheme = new mongoose.Schema<IComment>({
	message: {
		type: String,
		required: true,
	},

	post: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Post',
	},

	user: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'user',
	},
});

export default mongoose.model<IComment>('Comment', commentScheme);

export interface CommentDocument extends IComment, mongoose.Document {}
