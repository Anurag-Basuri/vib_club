import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';
import Sidebar from './components/sidebar.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		<ReactLenis>
			
		</ReactLenis>
	);
}

export default App;
