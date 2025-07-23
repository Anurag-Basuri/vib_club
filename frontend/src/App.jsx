import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis } from '@studio-freight/react-lenis';
import AppRoutes from './routes/AppRoutes.jsx';
import Nav from './components/Navbar.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		 <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
			<Nav />
			<AppRoutes />
		</Lenis>
	);
}

export default App;