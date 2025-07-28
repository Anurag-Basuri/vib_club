import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useLenis from './hooks/useLenis.js';
import { Lenis } from '@studio-freight/react-lenis';
import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/Navbar.jsx';

function AppContent() {
    useLenis();
    const location = useLocation();
    const hideNavbar = location.pathname.startsWith('/auth');
    const [scrolled, setScrolled] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(window.scrollY);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY <= 0) {
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setShowNavbar(false);
            } else if (currentScrollY < lastScrollY.current) {
                setShowNavbar(true);
            }
            lastScrollY.current = currentScrollY;
            setScrolled(currentScrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
            {/* Smooth slide effect for Navbar */}
            {!hideNavbar && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 50,
                        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s',
                        transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
                        opacity: showNavbar ? 1 : 0,
                    }}
                >
                    <Navbar />
                </div>
            )}
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