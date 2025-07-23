import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';
import Sidebar from './components/sidebar.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		<ReactLenis>
			<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
				

				{/* Render the sidebar */}
				<Sidebar />
			</div>
		</ReactLenis>
	);
}

export default App;
