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

// ver os comentários de um post
export const getPostComments = async (req, res) => {
	try {
		const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
		res.status(200).json(comments);
	} catch (error) {
		next(error);
	}
};

// Meter gosto num comentário
export const likeComment = async (req, res) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			return next(errorHandler(404, 'Comentário não encontrado.'));
		}
		const userIndex = comment.likes.indexOf(req.user.id);
		if (userIndex === -1) {
			comment.numberOfLikes += 1;
			comment.likes.push(req.user.id);
		} else {
			comment.numberOfLikes -= 1;
			comment.likes.splice(userIndex, 1);
		}
		await comment.save();
		res.status(200).json(comment);
	} catch (error) {
		next(error);
	}
};

// Editar comentário
export const editComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			return next(errorHandler(404, 'Comentário não encontrado.'));
		}
		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return next(errorHandler(403, 'Não tens permissão para editar este comentário.'));
		}

		const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, { content: req.body.content }, { new: true });
		res.status(200).json(editedComment);
	} catch (error) {
		next(error);
	}
};

// Apagar comentário
export const deleteComment = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.commentId);
		if (!comment) {
			return next(errorHandler(404, 'Comentário não encontrado.'));
		}
		if (comment.userId !== req.user.id && !req.user.isAdmin) {
			return next(errorHandler(403, 'Não tens permissão para apagar este comentário.'));
		}
		await Comment.findByIdAndDelete(req.params.commentId);
		res.status(200).json('Comentário apagado.');
	} catch (error) {
		next(error);
	}
};
