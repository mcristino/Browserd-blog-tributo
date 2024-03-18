export default function About() {
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div className='max-w-2xl mx-auto p-3 text-center'>
				<div>
					<h1 className='text-3xl font font-semibold text-center my-7'>Sobre o Projeto de Tributo</h1>
					<div className='text-md text-gray-500 flex flex-col gap-6'>
						<p>
							Bem-vindo ao blog dedicado ao incrível Browserd. Este é um espaço onde celebramos a sua influência e inspiração, compartilhando conhecimento e a explorar novas ideias. Junte-se a nós
							nesta jornada de aprendizagem e descoberta!
						</p>
						<img className='rounded-xl mt-5' src='https://browserd.com/wp-content/images/browserd_sepia.jpg' alt='Imagem do Browserd' />
					</div>
				</div>
			</div>
		</div>
	);
}
