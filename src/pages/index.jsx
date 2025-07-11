import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Schedule from "./Schedule";

import Profile from "./Profile";

import CoachProfile from "./CoachProfile";

import SetAvailability from "./SetAvailability";

import Chats from "./Chats";

import AthleteProfile from "./AthleteProfile";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Schedule: Schedule,
    
    Profile: Profile,
    
    CoachProfile: CoachProfile,
    
    SetAvailability: SetAvailability,
    
    Chats: Chats,
    
    AthleteProfile: AthleteProfile,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Schedule" element={<Schedule />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/CoachProfile" element={<CoachProfile />} />
                
                <Route path="/SetAvailability" element={<SetAvailability />} />
                
                <Route path="/Chats" element={<Chats />} />
                
                <Route path="/AthleteProfile" element={<AthleteProfile />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}