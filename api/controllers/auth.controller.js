import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

//! Função para criar um novo utilizador
export const signup = async (req, res, next) => {
	const { username, email, password } = req.body;

	// Segurança extra caso consigam fazer bypass do modelo
	if (!username || !email || !password || username === '' || email === '' || password === '') {
		next(errorHandler(400, 'Por favor preencha todos os campos'));
	}

	// Encriptar a password com bcryptjs
	const hashedPassword = bcryptjs.hashSync(password, 10);

	const newUser = new User({
		username,
		email,
		password: hashedPassword,
	});

	try {
		await newUser.save();
		res.json('Utilizador criado com sucesso!');
	} catch (error) {
		next(error);
	}
};

//! Função para fazer login
export const signin = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password || email === '' || password === '') {
		next(errorHandler(400, 'Por favor preencha todos os campos'));
	}

	try {
		const validUser = await User.findOne({ email });
		if (!validUser) {
			return next(errorHandler(404, 'Utilizador não encontrado')); // Aqui seria melhor utilizar algo como "Email ou palavra-passe inválidos" para não dar pistas a um atacante, mas como é um projeto educativo, vamos deixar assim.
		}
		const ValidPassword = bcryptjs.compareSync(password, validUser.password);
		if (!ValidPassword) {
			return next(errorHandler(400, 'Palavra-passe inválida')); // Aqui seria melhor utilizar algo como "Email ou palavra-passe inválidos" para não dar pistas a um atacante, mas como é um projeto educativo, vamos deixar assim.
		}
		const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
		const { password: pass, ...rest } = validUser._doc;

		res
			.status(200)
			.cookie('access_token', token, {
				httpOnly: true,
			})
			.json(rest);
	} catch (error) {
		next(error);
	}
};

//! Função para autenticação google
export const google = async (req, res, next) => {
	const { email, name, googlePhotoUrl } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user) {
			const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
			const { password, ...rest } = user._doc;
			res
				.status(200)
				.cookie('access_token', token, {
					httpOnly: true,
				})
				.json(rest);
		} else {
			const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
			const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
			const newUser = new User({
				username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
				email,
				password: hashedPassword,
				profilePicture: googlePhotoUrl,
			});
			await newUser.save();
			const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
			const { password, ...rest } = newUser._doc;
			res
				.status(200)
				.cookie('access_token', token, {
					httpOnly: true,
				})
				.json(rest);
		}
	} catch (error) {
		next(error);
	}
};
