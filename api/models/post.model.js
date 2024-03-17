import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		image: {
			type: String,
			default: 'https://neilpatel.com/wp-content/uploads/fly-images/47522/blog-post-image-guide-1200x675-c.jpg',
		},
		category: {
			type: String,
			dafault: 'uncategorized',
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true },
);

const Post = mongoose.model('Post', postSchema);

export default Post;
