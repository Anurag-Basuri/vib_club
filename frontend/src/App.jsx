import './App.css';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ReactLenis } from 'lenis/react';
import AppRoutes from './routes/AppRoutes.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
    const location = useLocation();

    // Hide navbar for specific routes
    const hideNavbar =
        location.pathname.startsWith('/auth') ||
        location.pathname.startsWith('/admin/auth') ||
        location.pathname.startsWith('/admin/dashboard') ||
        location.pathname.startsWith('/member/dashboard') ||
        location.pathname.startsWith('/terms') ||
        location.pathname.startsWith('/refund') ||
        location.pathname.startsWith('/policy') ||
        location.pathname.startsWith('/privacy') ||
        location.pathname.startsWith('/cookie');

    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    
                    // Show navbar at top or when scrolling up
                    if (currentScrollY <= 10) {
                        setShowNavbar(true);
                    } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                        // Hide when scrolling down past 100px
                        setShowNavbar(false);
                    } else if (currentScrollY < lastScrollY.current - 5) {
                        // Show when scrolling up (with threshold to avoid flicker)
                        setShowNavbar(true);
                    }
                    
                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        if (!hideNavbar) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [hideNavbar]);

    return (
        <ReactLenis 
            root
            options={{ 
                lerp: 0.1,              // Slightly faster interpolation
                duration: 1.2,          // Animation duration
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical', // Only vertical scrolling
                gestureOrientation: 'vertical',
                smoothWheel: true,      // Enable smooth wheel scrolling
                wheelMultiplier: 1,     // Wheel sensitivity
                touchMultiplier: 2,     // Touch sensitivity
                syncTouch: true,        // Sync touch scrolling
                touchInertiaMultiplier: 35,
                infinite: false,        // Disable infinite scroll
            }}
        >
            {!hideNavbar && (
                <div
                    className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out"
                    style={{
                        transform: showNavbar ? 'translateY(0)' : 'translateY(-100%)',
                        opacity: showNavbar ? 1 : 0,
                        pointerEvents: showNavbar ? 'auto' : 'none',
                    }}
                >
                    <Navbar />
                </div>
            )}
            <div className={!hideNavbar ? 'pt-20' : ''}>
                <AppRoutes />
            </div>
        </ReactLenis>
    );
}

export default App;
