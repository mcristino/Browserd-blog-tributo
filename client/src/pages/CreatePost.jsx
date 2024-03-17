import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
	return (
		<div className='p-3 max-w-3xl mx-auto min-h-screen'>
			<h1 className='text-center text-3xl my-7 font-semibold'>Criar uma publicação</h1>
			<form className='flex flex-col gap-4'>
				<div className='flex flex-col gap-4 sm:flex-row justify-between'>
					<TextInput type='text' placeholder='Título' required id='title' className='flex-1' />
					<Select>
						<option value='uncategorized'>Selecione uma categoria</option>
						<option value='pessoal'>Pessoal</option>
						<option value='escrita'>Escrita</option>
						<option value='entretenimento'>Entretenimento</option>
						<option value='negocios'>Negócios</option>
						<option value='tecnologia'>Tecnologia</option>
					</Select>
				</div>
                <div className='flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' />
                    <Button type='button' className='bg-gradient-to-r from-orange-500 to-red-600' size='sm' outline>Carregar imagem</Button>
                </div>
                <ReactQuill theme='snow' placeholder='Escreva algo...' className='h-72 mb-12' required />
                <Button type='submit' className='bg-gradient-to-r from-red-600 to-orange-500'>Publicar</Button>
			</form>
		</div>
	);
}
