import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis } from '@studio-freight/react-lenis';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		 <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
			<AppRoutes />
		</Lenis>
	);
}

export default App;