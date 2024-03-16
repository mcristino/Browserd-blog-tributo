import { Button, Label, TextInput } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
	return (
		<div className='min-h-screen mt-20'>
			<div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
				{/* Lado Esquerdo | Logotipo */}
				<div className='flex-1'>
					<Link to='/' className='font-bold dark:text-white text-4xl'>
						<span className='px-2 py-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg text-white'>Browserd's</span>
						Blog
					</Link>
					<p className='text-sm mt-5'>Este é um projeto de demonstração e de Tributo a um grande blog Português. Pode registar-se com o seu email e palavra-passe ou com o Google.</p>
				</div>
				{/* Lado Direito */}
				<div className='flex-1'>
					<form className='flex flex-col gap-4 '>
						<div>
							<Label value='O seu nome de utilizador' />
							<TextInput type='text' placeholder='Nome de Utilizador' id='username' />
						</div>
						<div>
							<Label value='O seu email' />
							<TextInput type='text' placeholder='Email' id='email' />
						</div>
						<div>
							<Label value='A sua palavra-passe' />
							<TextInput type='text' placeholder='Palavra-pass' id='password' />
						</div>
						<Button gradientDuoTone='pinkToOrange' type='submit'>
							Registar
						</Button>
					</form>
					<div className='flex gap-2 text-sm mt-5'>
						<span>Tem uma conta?</span>
						<Link to='/sign-in' className='text-blue-600'>
							Iniciar sessão
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
