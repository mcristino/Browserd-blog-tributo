import Comment from '../models/comment.model.js';

export const createComment = async (req, res) => {
	try {
		const { content, postId, userId } = req.body;

		if (userId !== req.user.id) {
			return next(errorHandler(403, 'Não tens permissão para criar este comentário.'));
		}

		const newComment = new Comment({ content, postId, userId });
		await newComment.save();
		res.status(201).json(newComment);
	} catch (error) {
		next(error);
	}
};
