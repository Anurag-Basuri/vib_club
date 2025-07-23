import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis } from '@studio-freight/react-lenis';
import Home from './pages/home.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		 <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
			<Home />
		</Lenis>
	);
}

export default App;