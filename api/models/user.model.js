import mongoose from 'mongoose';

// Definição do modelo de utilizador
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			minlength: 4,
			maxlength: 30,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			maxlength: 120,
		},
		profilePicture: {
			type: String,
			default: 'https://cdn3.iconfinder.com/data/icons/vector-icons-6/96/256-512.png',
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
