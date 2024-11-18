import mongoose from 'mongoose';

const postScheme = mongoose.Schema({
	message: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

export default mongoose.model('Post', postScheme);
