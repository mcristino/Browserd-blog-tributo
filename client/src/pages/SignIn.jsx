import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
	// Guardar os dados do formulário
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleChange = e => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};
	const handleSubmit = async e => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			return setErrorMessage('Preencha todos os campos.');
		}
		try {
			setLoading(true);
			setErrorMessage(null);
			const res = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				return setErrorMessage(data.message);
			}
			setLoading(false);
			if (res.ok) {
				navigate('/');
			}
		} catch (error) {
			setErrorMessage(error.message);
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen mt-20'>
			<div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
				{/* Lado Esquerdo | Logotipo */}
				<div className='flex-1'>
					<Link to='/' className='font-bold dark:text-white text-4xl'>
						<span className='px-2 py-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg text-white'>Browserd's</span>
						Blog
					</Link>
					<p className='text-sm mt-5'>
						Este é um projeto de demonstração e de tributo a um grande blog Português. <span className='font-bold'> Pode iniciar sessão com o seu email e palavra-passe ou com o Google.</span>
					</p>
				</div>
				{/* Lado Direito */}
				<div className='flex-1'>
					<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
						<div>
							<Label value='O seu email' />
							<TextInput type='email' placeholder='Email' id='email' onChange={handleChange} />
						</div>
						<div>
							<Label value='A sua palavra-passe' />
							<TextInput type='password' placeholder='**********' id='password' onChange={handleChange} />
						</div>
						<Button gradientDuoTone='pinkToOrange' type='submit' disabled={loading}>
							{loading ? (
								<>
									<Spinner size='sm' />,<span className='pl-3'>A carregar..</span>
								</>
							) : (
								'Iniciar Sessão'
							)}
						</Button>
					</form>
					<div className='flex gap-2 text-sm mt-5'>
						<span>Ainda não tem uma conta?</span>
						<Link to='/signup' className='text-blue-600'>
							Registar-se
						</Link>
					</div>
					{errorMessage && (
						<Alert className='mt-5' color='failure'>
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
}
