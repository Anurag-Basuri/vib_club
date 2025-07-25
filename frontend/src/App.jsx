import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import useLenis from './hooks/useLenis.js';
import { Lenis } from '@studio-freight/react-lenis';
import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/Navbar.jsx';

function AppContent() {
    useLenis();
    const location = useLocation();
    const hideNavbar = location.pathname.startsWith('/auth');
    
    return (
        <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
            {/* Fixed navbar container with z-index */}
            {!hideNavbar && (
                <div className="fixed top-0 left-0 w-full z-50">
                    <Navbar />
                </div>
            )}
            
            {/* Content area with dynamic padding */}
            <div className={!hideNavbar ? "pt-[var(--navbar-height)]" : ""}>
                <AppRoutes />
            </div>
        </Lenis>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;