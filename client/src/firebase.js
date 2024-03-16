// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'tribute-blog.firebaseapp.com',
	projectId: 'tribute-blog',
	storageBucket: 'tribute-blog.appspot.com',
	messagingSenderId: '652180005522',
	appId: '1:652180005522:web:251a6049721341d5033c4b',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

