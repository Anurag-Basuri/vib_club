import './App.css';
import useLenis from './hooks/useLenis.js';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';
import Sidebar from './components/sidebar.jsx';

function App() {
	useLenis(); // Initialize smooth scrolling
	return (
		<ReactLenis>
			<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
				{/* Hero Section */}
				<section className="h-screen flex flex-col justify-center items-center px-4">
					<h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Student Tech Club
					</h1>
					<p className="text-lg md:text-xl text-indigo-800 max-w-2xl text-center mb-8">
						Empowering students through technology, innovation, and collaboration
					</p>
					<button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg">
						Join Our Community
					</button>
				</section>

				{/* Dummy sections for scrolling */}
				{['Events', 'Projects', 'Team', 'Resources'].map((section, index) => (
					<section
						key={section}
						id={section.toLowerCase()}
						className={`min-h-screen flex flex-col justify-center items-center px-4 ${
							index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'
						}`}
					>
						<h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-8">
							{section} Section
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
							{[1, 2, 3].map((item) => (
								<div
									key={item}
									className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100"
								>
									<div className="bg-indigo-100 h-48 rounded-xl mb-4" />
									<h3 className="text-xl font-semibold text-indigo-900 mb-2">
										{section} Item {item}
									</h3>
									<p className="text-indigo-700">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
										do eiusmod tempor incididunt.
									</p>
								</div>
							))}
						</div>
					</section>
				))}

				{/* Render the sidebar */}
				<Sidebar />
			</div>
		</ReactLenis>
	);
}

export default App;
