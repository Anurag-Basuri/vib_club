import { Routes, Route } from 'react-router-dom';
import protectedRoutes from './protectedRoutes.jsx';
import Home from '../pages/home.jsx';
import Event from '../pages/event.jsx';
import Team from '../pages/team.jsx';
import Social from '../pages/socials.jsx';
import Contact from '../pages/contact.jsx';
import MemberProfile from '../pages/member.jsx';
import Auth from '../pages/auth.jsx';
import Current from '../components/upcomingEvent.jsx';
import PaymentSuccess from '../pages/payment-success.jsx';
import Terms from '../pages/terms.jsx';
import Refund from '../pages/refund.jsx';
import CookiePolicy from '../pages/cookie.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/*" element={<Auth />} />

            <Route path="/" element={<Home />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/event" element={<Current />} />
            <Route path="/team" element={<Team />} />
            <Route path='/social-page' element={<Social />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/policy/terms" element={<Terms />} />
            <Route path="/policy/refund-policy" element={<Refund />} />
            <Route path="/policy/cookie" element={<CookiePolicy />} />

            {/* <Route path="/member" element={<MemberProfile />} /> */}
        </Routes>
    )
}

export default AppRoutes;