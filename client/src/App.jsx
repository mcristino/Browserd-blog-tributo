import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
				<Route path='/projects' element={<Projects />} />
				<Route path='/signin' element={<SignIn />} />
				<Route path='/signup' element={<SignUp />} />
				<Route element={<PrivateRoute />}>
					<Route path='/dashboard' element={<Dashboard />} />
				</Route>
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}
