import React from 'react';
import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsYoutube } from 'react-icons/bs';

export default function FooterCom() {
	return (
		<Footer container className='border-t-8 border-orange-700'>
			<div className='w-full max-w-7xl mx-auto'>
				<div className='grid w-full justify-between sm:flex md:grid-cols-1'>
					{/* Logotipo | Nome */}
					<div className='mt-5 '>
						<Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
							<span className='px-2 py-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg text-white'>Browserd's</span>
							Tribute Blog
						</Link>
					</div>
					{/* Links do Footer */}
					<div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
						<div>
							<Footer.Title title='Sobre' />
							<Footer.LinkGroup col>
								<Footer.Link href='https://browserd.com/' target='_blank' rel='noopener noreferrer'>
									O Browserd
								</Footer.Link>
								<Footer.Link href='/about'>
									Projeto de Tributo
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title='Siga-nos' />
							<Footer.LinkGroup col>
								<Footer.Link href='https://github.com/mcristino' target='_blank' rel='noopener noreferrer'>
									GitHub
								</Footer.Link>
								<Footer.Link href='discordapp.com/users/141997259167498240' target='_blank' rel='noopener noreferrer'>
									Discord
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
						<div>
							<Footer.Title title='Legal' />
							<Footer.LinkGroup col>
								<Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
									Política de privacidade
								</Footer.Link>
								<Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
									Termos e condições
								</Footer.Link>
							</Footer.LinkGroup>
						</div>
					</div>
				</div>
				<Footer.Divider />
				<div className='w-full sm:flex sm:items-center sm:justify-between'>
					<Footer.Copyright href='#' by="Browserd's Tribute Blog" year={new Date().getFullYear()} />
					<div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
						<Footer.Icon href='#' icon={BsFacebook} />
						<Footer.Icon href='#' icon={BsInstagram} />
						<Footer.Icon href='#' icon={BsTwitter} />
						<Footer.Icon href='#' icon={BsYoutube} />
						<Footer.Icon href='https://github.com/mcristino' icon={BsGithub} />
					</div>
				</div>
			</div>
		</Footer>
	);
}
