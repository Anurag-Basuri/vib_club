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

     // Hide navbar for /auth, /terms, /refund, or /policy routes
    const hideNavbar =
        location.pathname.startsWith('/auth') ||
        location.pathname.startsWith('/terms') ||
        location.pathname.startsWith('/refund') ||
        location.pathname.startsWith('/policy');

    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(window.scrollY);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    // Show if at top or scrolling up, hide if scrolling down and past 100px
                    if (currentScrollY <= 0) {
                        setShowNavbar(true);
                    } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                        setShowNavbar(false);
                    } else if (currentScrollY < lastScrollY.current - 2) {
                        // Add a small threshold to avoid flicker on minor scrolls
                        setShowNavbar(true);
                    }
                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Lenis root options={{ lerp: 0.1, smoothWheel: true }}>
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
                        pointerEvents: showNavbar ? 'auto' : 'none',
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