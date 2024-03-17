import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashSidebar() {
	const location = useLocation();
	const [tab, setTab] = useState('');
	const dispatch = useDispatch();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get('tab');
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	// Terminar sessão
	const handleSignOut = async () => {
		try {
			const res = await fetch('/api/user/signout', {
				method: 'POST',
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signOutSuccess());
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<Sidebar className='w-full md:w-56'>
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Link to='/dashboard?tab=profile'>
						<Sidebar.Item active={tab === 'profile'} icon={HiUser} label={'Utilizador'} labelColor='dark' as='div'>
							Perfil
						</Sidebar.Item>
					</Link>
					<Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className='cursor-pointer'>
						Terminar sessão
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
}
