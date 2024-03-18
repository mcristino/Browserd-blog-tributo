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
};

// Apagar utilizador
export const deleteUser = async (req, res, next) => {
	if (!req.user.isAdmin && req.user.id !== req.params.userId) {
		return next(errorHandler(403, 'Não está autorizado a apagar este utilizador.'));
	}

	try {
		await User.findByIdAndDelete(req.params.userId);
		res.status(200).json({ message: 'Utilizador apagado com sucesso!' });
	} catch (error) {
		next(error);
	}
};

// Terminar sessão
export const signOut = (req, res, next) => {
	try {
		res.clearCookie('access_token').status(200).json('Sessão terminada com sucesso!');
	} catch (error) {
		next(error);
	}
};

// Obter utilizadores
export const getUsers = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'Não está autorizado a ver todos os utilizadores'));
	}
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.sort === 'asc' ? 1 : -1;

		const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
		const usersWihtoutPassword = users.map(user => {
			const { password, ...rest } = user._doc;
			return rest;
		});

		// Contar utilizadores
		const totalUsers = await User.countDocuments();
		const now = new Date();
		const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
		const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

		res.status(200).json({ users: usersWihtoutPassword, totalUsers, lastMonthUsers });
	} catch (error) {
		next(error);
	}
};

// Obter utilizador de forma publica para comentários
export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) {
			return next(errorHandler(404, 'Utilizador não encontrado.'));
		}
		const { password, ...rest } = user._doc;
		res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
};
