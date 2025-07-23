import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home.jsx';
import Event from '../pages/event.jsx';
import Team from '../pages/team.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<Event />} />
            <Route path="/team" element={<Team />} />
        </Routes>
    )
}

export default AppRoutes;