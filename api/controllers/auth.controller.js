import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

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
