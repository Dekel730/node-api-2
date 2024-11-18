import mongoose from 'mongoose';

const userScheme = mongoose.Schema({
	email: {
		type: String,
		required: true,
        unique: true
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
        unique: true
	},
});

export default mongoose.model('User', userScheme);