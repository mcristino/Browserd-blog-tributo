import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
	const [file, setFile] = useState(null);
	const [imageUploadProgress, setImageUploadProgress] = useState(null);
	const [imageUploadError, setImageUploadError] = useState(null);
	const [formData, setFormData] = useState({});
	const [publishError, setPublishError] = useState(null);
	const navigate = useNavigate();

	// Carregar Imagem
	const handleUploadImage = async () => {
		try {
			if (!file) {
				setImageUploadError('Selecione uma imagem para carregar');
				return;
			}
			setImageUploadError(null);
			const storage = getStorage(app);
			const fileName = new Date().getTime() + '-' + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				'state_changed',
				snapshot => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImageUploadProgress(progress.toFixed(0));
				},
				error => {
					setImageUploadError('Não foi possível carregar a imagem.');
					setImageUploadProgress(null);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
						setImageUploadProgress(null);
						setImageUploadError(null);
						setFormData({ ...formData, image: downloadURL });
					});
				},
			);
		} catch (error) {
			setImageUploadError('Não foi possível carregar a imagem.');
			setImageUploadProgress(null);
			console.log(error);
		}
	};

	// Enviar publicação
	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const res = await fetch('/api/post/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) {
				setPublishError(data.message);
				return;
			}
			if (res.ok) {
				setPublishError(null);
				navigate(`/post/${data.slug}`);
			}
		} catch (error) {
			setPublishError('Não foi possível publicar');
		}
	};

	return (
		<div className='p-3 max-w-3xl mx-auto min-h-screen'>
			<h1 className='text-center text-3xl my-7 font-semibold'>Criar uma publicação</h1>
			<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
				<div className='flex flex-col gap-4 sm:flex-row justify-between'>
					<TextInput type='text' placeholder='Título' required id='title' className='flex-1' onChange={e => setFormData({ ...formData, title: e.target.value })} />
					<Select onChange={e => setFormData({ ...formData, category: e.target.value })}>
						<option value='uncategorized'>Selecione uma categoria</option>
						<option value='pessoal'>Pessoal</option>
						<option value='escrita'>Escrita</option>
						<option value='entretenimento'>Entretenimento</option>
						<option value='negocios'>Negócios</option>
						<option value='tecnologia'>Tecnologia</option>
					</Select>
				</div>
				<div className='flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3'>
					<FileInput type='file' accept='image/*' onChange={e => setFile(e.target.files[0])} />
					<Button type='button' className='bg-gradient-to-r from-orange-500 to-red-600' size='sm' outline onClick={handleUploadImage} disabled={imageUploadProgress}>
						{imageUploadProgress ? (
							<div className='w-16 h-16'>
								<CircularProgressbar
									value={imageUploadProgress}
									text={`${imageUploadProgress || 0}%`}
									styles={{
										root: {
											width: '100%',
											height: '100%',
											position: 'absolute',
											top: '0',
											left: '0',
										},
										path: {
											stroke: `rgba(234, 88, 12)`,
										},
										text: {
											fill: `rgba(234, 88, 12)`,
										},
									}}
								/>
							</div>
						) : (
							'Carregar Imagem'
						)}
					</Button>
				</div>
				{imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
				{formData.image && <img src={formData.image} alt='Imagem de publicação' className='w-full h-72 object-cover' />}

				<ReactQuill
					theme='snow'
					placeholder='Escreva algo...'
					className='h-72 mb-12'
					required
					onChange={value => {
						setFormData({ ...formData, content: value });
					}}
				/>
				<Button type='submit' className='bg-gradient-to-r from-red-600 to-orange-500'>
					Publicar
				</Button>
				{publishError && (
					<Alert className='mt-5' color='failure'>
						{publishError}
					</Alert>
				)}
			</form>
		</div>
	);
}
