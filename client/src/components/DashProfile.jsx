import { Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function DashProfile() {
	const { currentUser } = useSelector(state => state.user);
	return (
		<div className='max-w-lg mx-auto p-3 w-full '>
			<h1 className='my-7 text-center font-semibold text-3xl'>Perfil</h1>
			<form className='flex flex-col gap-4'>
				<div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-3xl'>
					<img src={currentUser.profilePicture} alt='Imagem de utilizador' className='rounded-3xl w-full h-full object-cover border-8 border-[lightgray]' />
				</div>
				<TextInput type='text' id='username' placeholder='Utilizador' defaultValue={currentUser.username} />
				<TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
				<TextInput type='password' id='password' placeholder='Palavra-passe' />
				<Button type='submit' className='bg-gradient-to-r from-red-600 to-orange-500' outline>
					Atualizar
				</Button>
			</form>
			<div className='flex justify-between mt-5 font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text'>
				<span className='cursor-pointer'>Apagar Conta</span>
				<span className='cursor-pointer'>Terminar Sessão</span>
			</div>
		</div>
	);
}
