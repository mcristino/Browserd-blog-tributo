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
	},
	{ timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
