import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useLenis from './hooks/useLenis.js';
import { Lenis } from '@studio-freight/react-lenis';
import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/Navbar.jsx';

function AppContent() {
    useLenis();
    const location = useLocation();
    const hideNavbar = location.pathname.startsWith('/auth');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
            {!hideNavbar && <Navbar />}
            {/* Content area with dynamic padding */}
            <div className={!hideNavbar ? "pt-20" : ""}>
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