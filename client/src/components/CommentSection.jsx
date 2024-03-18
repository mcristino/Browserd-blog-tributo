import { Alert, Button, Textarea } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function CommentSection({ postId }) {
	const { currentUser } = useSelector(state => state.user);
	const [comment, setComment] = useState('');
	const [commentError, setCommentError] = useState(null);

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
			}
		} catch (error) {
			setCommentError(error.message);
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
		</div>
	);
}
