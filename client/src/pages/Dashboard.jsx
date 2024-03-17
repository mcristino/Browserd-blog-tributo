import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';

export default function Dashboard() {
	const location = useLocation();
	const [tab, setTab] = useState('');

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	return (
		<div className='flex flex-col md:flex-row min-h-screen'>
			<div className='md:w-56'>
				{/* Barra Lateral */}
				<DashSidebar /> {/* Componente da barra lateral */}
			</div>
			{/* Perfil */}
			{tab === 'profile' && <DashProfile />} {/* Componente-página do Perfil */}
			{/* Publicações */}
			{tab === 'posts' && <DashPosts />} {/* Componente-página das Publicações */}
		</div>
	);
}
