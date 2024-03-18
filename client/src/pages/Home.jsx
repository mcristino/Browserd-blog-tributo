import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Home() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch('/api/post/getPosts');
			const data = await res.json();
			setPosts(data.posts);
		};
		fetchPosts();
	}, []);

	return (
		<div>
			<div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
				<h1 className='text-3xl font-bold lg:text-6xl'>Blog de Tributo ao Browserd</h1>
				<p className='text-gray-500 text-xs sm:text-sm'>
					Esta plataforma de blog foi criada em tributo a um dos melhores blogs de Portugal. <span className='text-orange-500'>O Browserd.</span>
				</p>
				<Link to='/search' className='text-xs sm:text-sm text-orange-500 hover:underline'>
					Ver todas as publicações
				</Link>
				<div className='flex justify-center '>
					<img className='rounded-xl' src='https://browserd.com/wp-content/images/browserd_sepia.jpg' alt='Imagem do Browserd' />
				</div>

				<div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
					{posts && posts.length > 0 && (
						<div className='flex flex-col gap-6'>
							<h2 className='text-2xl font-semibold text-center'>Publicações recentes</h2>
							<div className='flex flex-wrap gap-4 justify-center'>
								{posts.map(post => (
									<PostCard key={post._id} post={post} />
								))}
							</div>
							<Link to={'/search'} className='text-lg text-orange-500 hover:underline text-center'>Ver todas as publicações</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
