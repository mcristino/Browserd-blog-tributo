import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';


//! Função em desenvolvimento :(

export default function Search() {
	const [sidebarData, setSidebarData] = useState({
		searchTerm: '',
		sort: 'desc',
		category: 'uncategorized',
	});
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get('searchTerm');
		const sortFromUrl = urlParams.get('sort');
		const categoryFromUrl = urlParams.get('category');
		if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
			setSidebarData({
				...sidebarData,
				searchTerm: searchTermFromUrl,
				sort: sortFromUrl,
				category: categoryFromUrl,
			});
		}

		const fetchPosts = async () => {
			setLoading(true);
			const searchQuery = urlParams.toString();
			const res = await fetch(`/api/post/getposts?${searchQuery}`);
			if (!res.ok) {
				setLoading(false);
				return;
			}
			if (res.ok) {
				const data = await res.json();
				setPosts(data.posts);
				setLoading(false);
				if (data.posts.length === 9) {
					setShowMore(true);
				} else {
					setShowMore(false);
				}
			}
		};
		fetchPosts();
	}, [location.search]);

	const handleShowMore = async () => {
		const numberOfPosts = posts.length;
		const startIndex = numberOfPosts;
		const urlParams = new URLSearchParams(location.search);
		urlParams.set('startIndex', startIndex);
		const searchQuery = urlParams.toString();
		const res = await fetch(`/api/post/getposts?${searchQuery}`);
		if (!res.ok) {
			return;
		}
		if (res.ok) {
			const data = await res.json();
			setPosts([...posts, ...data.posts]);
			if (data.posts.length === 9) {
				setShowMore(true);
			} else {
				setShowMore(false);
			}
		}
	};

	return (
		<div className='flex flex-col md:flex-row'>
			<div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
				<form className='flex flex-col gap-8'>
					<div className='flex   items-center gap-2'>
						<label className='whitespace-nowrap font-semibold'>Termo de Pesquisa:</label>
						<TextInput placeholder='Procurar' id='searchTerm' type='text' />
					</div>
					<div className='flex items-center gap-2'>
						<label className='font-semibold'>Ordenar:</label>
						<Select id='sort'>
							<option value='desc'>Mais novo</option>
							<option value='asc'>Mais velho</option>
						</Select>
					</div>
					<div className='flex items-center gap-2'>
						<label className='font-semibold'>Categoria:</label>
						<Select id='category'>
							<option value='uncategorized'>Selecione uma Categoria</option>
							<option value='pessoal'>Pessoal</option>
							<option value='escrita'>Escrita</option>
							<option value='entretenimento'>Entretenimento</option>
							<option value='negocios'>Negócios</option>
							<option value='tecnologia'>Tecnologia</option>
						</Select>
					</div>
					<Button type='submit' outline className='bg-gradient-to-r from-red-600 to-orange-500'>
						Aplicar Filtros
					</Button>
				</form>
			</div>
			<div className='w-full'>
				<h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>Resultados das publicações:</h1>
				<div className='p-7 flex flex-wrap gap-4'>
					{!loading && posts && posts.map(post => <PostCard key={post._id} post={post} />)}
					{showMore && (
						<button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>
							Mostrar Mais
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
