import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';
import Home from './pages/home.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		<ReactLenis>
			<Home />
		</ReactLenis>
	);
}

export default App;