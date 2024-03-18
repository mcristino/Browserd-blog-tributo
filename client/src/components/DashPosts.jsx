import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Table, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { set } from 'mongoose';

export default function DashPosts() {
	const { currentUser } = useSelector(state => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMore, setShowMore] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState('');

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.posts);
					if (data.posts.length < 9) {
						setShowMore(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id]);

	// Botão para mostrar mais publicações
	const handleShowMore = async () => {
		const startIndex = userPosts.length;
		try {
			const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
			const data = await res.json();
			if (res.ok) {
				setUserPosts(prev => [...prev, ...data.posts]);
				if (data.posts.length < 9) {
					setShowMore(false);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Apagar publicação
	const handleDeletePost = async () => {
		setShowModal(false);
		try {
			const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
				method: 'DELETE',
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserPosts(prev => prev.filter(post => post._id !== postIdToDelete));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
			{currentUser.isAdmin && userPosts.length > 0 ? (
				<>
					<Table hoverable className='shadow-md'>
						<Table.Head>
							<Table.HeadCell>Data atualizada</Table.HeadCell>
							<Table.HeadCell>Imagem da publicação</Table.HeadCell>
							<Table.HeadCell>Titulo da publicação</Table.HeadCell>
							<Table.HeadCell>Categoria</Table.HeadCell>
							<Table.HeadCell>Apagar</Table.HeadCell>
							<Table.HeadCell>
								<span>Editar</span>
							</Table.HeadCell>
						</Table.Head>
						{userPosts.map(post => (
							<Table.Body className='divide-y' key={post._id}>
								<Table.Row className='bg-white dark: border-gray-700 dark:bg-gray-800 '>
									<Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${post.slug}`}>
											<img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link className='font-semibold text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
											{post.title}
										</Link>
									</Table.Cell>
									<Table.Cell>{post.category}</Table.Cell>
									<Table.Cell>
										<span
											onClick={() => {
												setShowModal(true);
												setPostIdToDelete(post._id);
											}}
											className='font-medium text-red-500 hover:underline cursor-pointer'
										>
											Apagar
										</span>
									</Table.Cell>
									<Table.Cell>
										<Link className='text-green-400 hover:underline' to={`/update-post/${post._id}`}>
											<span>Editar</span>
										</Link>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMore && (
						<button onClick={handleShowMore} className='w-full text-orange-500 self-center text-sm py-7 font-semibold'>
							Mostrar mais
						</button>
					)}
				</>
			) : (
				<p>Ainda não tens publicações</p>
			)}

			{/* Modal para mostrar o aviso de apagar publicação */}
			<Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
				<Modal.Header />
				<Modal.Body>
					<div className='text-center'>
						<HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
						<h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Tem a certeza que deseja eliminar esta publicação?</h3>
					</div>
					<div className='flex justify-center gap-4'>
						<Button color='failure' onClick={handleDeletePost}>
							Sim, tenho a certeza
						</Button>
						<Button color='gray' onClick={() => setShowModal(false)} outline>
							Não, Cancelar
						</Button>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
}
