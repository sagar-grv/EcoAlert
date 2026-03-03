import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CreatePost from './components/CreatePost';
import Toast from './components/Toast';
import Home from './pages/Home';
import Explore from './pages/Explore';
import NearMe from './pages/NearMe';
import Analysis from './pages/Analysis';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

/* Loading spinner */
const Spinner = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--glass-border)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
);

/* Authenticated shell */
function AppShell() {
    const [showCreate, setShowCreate] = useState(false);
    const { toast } = useApp();
    return (
        <>
            <Navbar onCreatePost={() => setShowCreate(true)} />
            <div className="app-body">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/near-me" element={<NearMe />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <BottomNav onCreatePost={() => setShowCreate(true)} />
            {showCreate && <CreatePost onClose={() => setShowCreate(false)} />}
            <Toast toast={toast} />
        </>
    );
}

/* Decides whether to show auth or main shell */
function RootRouter() {
    const { user, loading } = useAuth();
    if (loading) return <Spinner />;
    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
            <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
            <Route path="/*" element={user ? (
                <AppProvider>
                    <AppShell />
                </AppProvider>
            ) : <Navigate to="/login" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <LangProvider>
                <RootRouter />
            </LangProvider>
        </AuthProvider>
    );
}
