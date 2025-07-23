import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home.jsx';
import Event from '../pages/event.jsx';
import Team from '../pages/team.jsx';
import Social from '../pages/socials.jsx';
import Contact from '../pages/contact.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<Event />} />
            <Route path="/team" element={<Team />} />
            <Route path='/social-page' element={<Social />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    )
}

export default AppRoutes;