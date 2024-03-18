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
