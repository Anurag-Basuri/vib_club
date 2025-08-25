import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './protectedRoutes.jsx';

// Import your page components
import Home from '../pages/home.jsx';
import AuthPage from '../pages/auth.jsx';
import AdminAuth from '../pages/adminAuth.jsx';
import AdminDash from '../pages/adminDash.jsx';
import MemberDashboard from '../pages/member.jsx';
import Event from '../pages/event.jsx';
import Team from '../pages/team.jsx';
import Contact from '../pages/contact.jsx';
import QrScanner from '../components/QrScanner.jsx';
import Show from '../pages/show.jsx';
import Socials from '../pages/socials.jsx';
import Cookie from '../pages/cookie.jsx';
import Privacy from '../pages/privacy.jsx';
import Terms from '../pages/terms.jsx';
import Refund from '../pages/refund.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<Event />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/show" element={<Show />} />
            <Route path="/socials" element={<Socials />} />
            <Route path="/cookie" element={<Cookie />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            
            {/* Auth routes - redirect if already authenticated */}
            <Route 
                path="/auth" 
                element={
                    <PublicRoute>
                        <AuthPage />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/admin/auth" 
                element={
                    <PublicRoute>
                        <AdminAuth />
                    </PublicRoute>
                } 
            />

            {/* Protected member routes */}
            <Route 
                path="/member/dashboard" 
                element={
                    <ProtectedRoute requireAuth={true}>
                        <MemberDashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Protected admin routes */}
            <Route 
                path="/admin/dashboard" 
                element={
                    <ProtectedRoute requireAuth={true} adminOnly={true}>
                        <AdminDash />
                    </ProtectedRoute>
                } 
            />

            {/* QR Scanner - accessible to both authenticated users */}
            <Route 
                path="/vib/qrscanner" 
                element={
                    <ProtectedRoute requireAuth={true}>
                        <QrScanner />
                    </ProtectedRoute>
                } 
            />

            {/* Catch all route */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;
