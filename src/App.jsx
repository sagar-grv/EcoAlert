import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CreatePost from './components/CreatePost';
import Home from './pages/Home';
import Explore from './pages/Explore';
import NearMe from './pages/NearMe';
import Analysis from './pages/Analysis';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import LandingPage from './pages/LandingPage';

function PrivateLayout() {
    const { user, loading } = useAuth();
    const [showCreate, setShowCreate] = useState(false);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-6xl animate-spin">eco</span>
            </div>
        );
    }

    if (!user) {
        if (location.pathname === '/') {
            return <LandingPage />;
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
            <Navbar onCreatePost={() => setShowCreate(true)} />
            <main className="flex-1 flex justify-center">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/near-me" element={<NearMe />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Routes>
            </main>
            <BottomNav onCreatePost={() => setShowCreate(true)} />
            {showCreate && <CreatePost onClose={() => setShowCreate(false)} />}
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/*" element={<PrivateLayout />} />
        </Routes>
    );
}
