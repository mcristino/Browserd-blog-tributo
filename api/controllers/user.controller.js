import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

// Só algo que quis testar
export const test = (req, res) => {
	res.json({ message: 'API está a funcionar!' });
};

// Atualizar utilizador
export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'Não está autorizado a atualizar este utilizador.'));
	}
	if (req.body.password) {
		if (req.body.password.length < 6) {
			return next(errorHandler(400, 'A password tem de ter no minimo 6 caracteres.'));
		}
		req.body.password = bcryptjs.hash(req.body.password, 10);
	}
	if (req.body.username) {
		if (req.body.username.length < 7 || req.body.username.length > 20) {
			return next(errorHandler(400, 'O nome de utlizador tem de ter entre 7 e 20 caracteres.'));
		}
		if (req.body.username.includes(' ')) {
			return next(errorHandler(400, 'O nome de utilizador não pode conter espaços.'));
		}
		if (req.body.username !== req.body.username.toLowerCase()) {
			return next(errorHandler(400, 'O nome de utilizador tem de estar em minúsculas.'));
		}
		if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
			return next(errorHandler(400, 'O nome de utilizador só pode conter letras e números.'));
		}
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.userId,
				{
					$set: {
						username: req.body.username,
						email: req.body.email,
						profilePicture: req.body.profilePicture,
						password: req.body.password,
					},
				},
				{ new: true },
			);
			const { password, ...rest } = updatedUser._doc;
			res.status(200).json(rest);
		} catch (error) {
			next(error);
		}
	}
};
