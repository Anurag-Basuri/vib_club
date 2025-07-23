import './App.css';
import AuthPage from './pages/auth';
import { useLenis } from './hooks/useLenis.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		<div className="App">
			<AuthPage />
		</div>
	);
}

export default App;
