import { Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './protectedRoutes.jsx';
import Home from '../pages/home.jsx';
import Event from '../pages/event.jsx';
import Team from '../pages/team.jsx';
import Social from '../pages/socials.jsx';
import Contact from '../pages/contact.jsx';
import MemberProfile from '../pages/member.jsx';
import Auth from '../pages/auth.jsx';
import AdminAuth from '../pages/adminAuth.jsx';
import AdminDash from '../pages/adminDash.jsx';
import Current from '../components/event/upcomingEvent.jsx';
import PaymentVerify from '../components/event/paymentVerify.jsx';
import Terms from '../pages/terms.jsx';
import Refund from '../pages/refund.jsx';
import CookiePolicy from '../pages/cookie.jsx';
import PrivacyPolicy from '../pages/privacy.jsx';
import ShowPage from '../pages/show.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/*" element={<Auth />} />
            <Route path="/admin/auth/*" element={<AdminAuth />} />

            <Route path="/home" element={<Home />} />
            <Route path="/payment/verify" element={<PaymentVerify />} />
            <Route path="/event" element={<Current />} />
            <Route path="/" element={<Current />} />
            <Route path="/team" element={<Team />} />
            <Route path='/social-page' element={<Social />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/policy/terms" element={<Terms />} />
            <Route path="/policy/refund-policy" element={<Refund />} />
            <Route path="/policy/privacy" element={<PrivacyPolicy />} />
            <Route path="/policy/cookie" element={<CookiePolicy />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoutes allowedRoles={['member']} />}>
                <Route path="/member/dashboard" element={<MemberProfile />} />
            </Route>
            <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDash />} />
                <Route path="/admin/show" element={<ShowPage />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;