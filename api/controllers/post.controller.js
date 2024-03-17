import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(errorHandler(403, 'Não tens permissões para criar publicações'));
	}
	if (!req.body.title || !req.body.content) {
		return next(errorHandler(400, 'Por favor, preencha todos os campos'));
	}

	const slug = req.body.title
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, '');
	const newPost = new Post({
		...req.body,
		slug,
		userId: req.user.id,
	});
	try {
		const savedPost = await newPost.save();
		res.status(201).json(savedPost);
	} catch (error) {
		next(error);
	}
};
