import { Alert, Button, TextInput } from 'flowbite-react';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import { set } from 'mongoose';

export default function DashProfile() {
	const { currentUser } = useSelector(state => state.user);
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
	const [imageFileUploadError, setImageFileUploadError] = useState(null);
	const [imageFileUploading, setImageFileUploading] = useState(false);
	const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
	const [updateUserError, setUpdateUserError] = useState(null);
	const [formData, setFormData] = useState({});
	const filePickerRef = useRef();
	const dispatch = useDispatch();
	const handleImageChange = e => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImageFileUrl(URL.createObjectURL(file));
		}
	};
	useEffect(() => {
		if (imageFile) {
			uploadImage();
		}
	}, [imageFile]);

	// Carregar imagem
	const uploadImage = async () => {
		setImageFileUploading(true);
		setImageFileUploadError(null);
		const storage = getStorage(app);
		const fileName = new Date().getTime() + imageFile.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, imageFile);
		uploadTask.on(
			'state_changed',
			snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setImageFileUploadProgress(progress.toFixed(0));
			},
			error => {
				setImageFileUploadError('Não foi possível carregar a imagem. (O ficheiro deve ter menos de 2MB)');
				setImageFileUploadProgress(null);
				setImageFileUrl(null);
				setImageFileUrl(null);
				setImageFileUploading(false);
			},

			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
					setImageFileUrl(downloadURL);
					setFormData({ ...formData, profilePicture: downloadURL });
					setImageFileUploading(false);
				});
			},
		);
	};

	const handleChange = e => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	// Atualizar perfil
	const handleSubmit = async e => {
		e.preventDefault();
		setUpdateUserError(null);
		setUpdateUserSuccess(null);
		if (Object.keys(formData).length === 0) {
			setUpdateUserError('Nada para atualizar');
			return;
		}
		if (imageFileUploading) {
			setUpdateUserError('A imagem ainda está a carregar');
			return;
		}
		try {
			dispatch(updateStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) {
				dispatch(updateFailure(data.message));
				setUpdateUserError(data.message);
			} else {
				dispatch(updateSuccess(data));
				setUpdateUserSuccess('Perfil atualizado com sucesso');
			}
		} catch (error) {
			dispatch(updateFailure(error.message));
			setUpdateUserError(error.message);
		}
	};

	return (
		<div className='max-w-lg mx-auto p-3 w-full '>
			<h1 className='my-7 text-center font-semibold text-3xl'>Perfil</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
				<div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
					{imageFileUploadProgress && (
						<CircularProgressbar
							value={imageFileUploadProgress || 0}
							text={`${imageFileUploadProgress}%`}
							strokeWidth={5}
							styles={{
								root: {
									width: '100%',
									height: '100%',
									position: 'absolute',
									top: '0',
									left: '0',
								},
								path: {
									stroke: `rgba(234, 88, 12, ${imageFileUploadProgress / 100})`,
								},
							}}
						/>
					)}
					<img
						src={imageFileUrl || currentUser.profilePicture}
						alt='Imagem de utilizador'
						className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-70'}`}
					/>
				</div>
				{imageFileUploadError && <Alert color={'failure'}>{imageFileUploadError}</Alert>}
				<TextInput type='text' id='username' placeholder='Utilizador' defaultValue={currentUser.username} onChange={handleChange} />
				<TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />
				<TextInput type='password' id='password' placeholder='Palavra-passe' onChange={handleChange} />
				<Button type='submit' className='bg-gradient-to-r from-red-600 to-orange-500' outline>
					Atualizar
				</Button>
			</form>
			<div className='flex justify-between mt-5 font-semibold bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text'>
				<span className='cursor-pointer'>Apagar Conta</span>
				<span className='cursor-pointer'>Terminar Sessão</span>
			</div>
			{updateUserSuccess && (
				<Alert color={'success'} className='mt-5'>
					{updateUserSuccess}
				</Alert>
			)}
			{updateUserError && (
				<Alert color={'failure'} className='mt-5'>
					{updateUserError}
				</Alert>
			)}
		</div>
	);
}
