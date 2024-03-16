import { Alert, Button, TextInput } from 'flowbite-react';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
	const { currentUser } = useSelector(state => state.user);
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
	const [imageFileUploadError, setImageFileUploadError] = useState(null);
	const filePickerRef = useRef();
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

    const uploadImage = async () => {
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
			},

			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
					setImageFileUrl(downloadURL);
				});
			},
		);
	};

	return (
		<div className='max-w-lg mx-auto p-3 w-full '>
			<h1 className='my-7 text-center font-semibold text-3xl'>Perfil</h1>
			<form className='flex flex-col gap-4'>
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
