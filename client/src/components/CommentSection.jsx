import { Alert, Button, Textarea } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';

export default function CommentSection({ postId }) {
	const { currentUser } = useSelector(state => state.user);
	const [comment, setComment] = useState('');
	const [commentError, setCommentError] = useState(null);
	const [comments, setComments] = useState([]);
	const navigate = useNavigate();

	console.log(comments);

	// Enviar comentário
	const handleSubmit = async e => {
		e.preventDefault();
		if (comment.length > 200) {
			return;
		}
		try {
			const res = await fetch('/api/comment/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
			});

			const data = await res.json();
			if (res.ok) {
				setComment('');
				setCommentError(null);
				setComments([data, ...comments]);
			}
		} catch (error) {
			setCommentError(error.message);
		}
	};

	// Ver comentários
	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await fetch(`/api/comment/getPostComments/${postId}`);
				if (res.ok) {
					const data = await res.json();
					setComments(data);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		getComments();
	}, [postId]);

	// Gostos no comentário
	const handleLike = async commentId => {
		try {
			if (!currentUser) {
				navigate('/signin');
				return;
			}
			const res = await fetch(`/api/comment/likeComment/${commentId}`, {
				method: 'PUT',
			});
			if (res.ok) {
				const data = await res.json();
				setComments(comments.map(comment => (comment._id === commentId ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length } : comment)));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className='max-w-2xl mx-auto w-full p-3'>
			{currentUser ? (
				<div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
					<p>Autenticado como:</p>
					<img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt='' />
					<Link className='text-xs text-orange-500 hover:underline' to={'/dashboard?tab=profile'}>
						@{currentUser.username}
					</Link>
				</div>
			) : (
				<div className='text-sm text-gray-500 my-5 flex gap-1 '>
					Tem de iniciar sessão para comentar.
					<Link className='text-orange-500 hover:underline' to={'/signin'}>
						Iniciar Sessão
					</Link>
				</div>
			)}
			{currentUser && (
				<form onSubmit={handleSubmit} className='border border-orange-600 rounded-md p-3'>
					<Textarea placeholder='Adiciona um comentário...' rows='3' maxLength='200' onChange={e => setComment(e.target.value)} value={comment} />
					<div className='flex justify-between items-center mt-5'>
						<p className='text-gray-500 text-xs'>Restam {200 - comment.length} caracteres</p>
						<Button outline className='bg-gradient-to-r from-red-600 to-orange-500' type='submit'>
							Comentar
						</Button>
					</div>
					{commentError && (
						<Alert color='failure' className='mt-5'>
							{commentError}
						</Alert>
					)}
				</form>
			)}
			{comments.length === 0 ? (
				<p className='text-sm my-5'>Sem comentários</p>
			) : (
				<>
					<div className='text-sm my-5 flex items-center gap-2'>
						<p>Comentários</p>
						<div className='border border-gray-400 py-1 px-2 rounded-sm'>
							<p>{comments.length}</p>
						</div>
					</div>
					{comments.map(comment => (
						<Comment key={comment._id} comment={comment} onLike={handleLike} />
					))}
				</>
			)}
		</div>
	);
}
