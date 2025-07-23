import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis } from '@studio-freight/react-lenis';
import Home from './pages/home.jsx';
import Event from './pages/event.jsx';
import Team from './pages/team.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		 <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
			{/* <Home /> */}
			{/* <Event /> */}

			<Team />
		</Lenis>
	);
}

export default App;