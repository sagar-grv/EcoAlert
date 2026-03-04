import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CreatePost from './components/CreatePost';
import Toast from './components/Toast';
import Spinner from './components/Spinner';

// ── Lazy-loaded page components (code splitting) ──────────
const Home = lazy(() => import('./pages/Home'));
const Explore = lazy(() => import('./pages/Explore'));
const NearMe = lazy(() => import('./pages/NearMe'));
const Analysis = lazy(() => import('./pages/Analysis'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ── Per-route error boundary ──────────────────────────────
class RouteErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error('Route error:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    color: 'var(--text-sub)',
                    maxWidth: '500px',
                    margin: '0 auto',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Something went wrong</h2>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        {this.state.error?.message || 'An unexpected error occurred on this page.'}
                    </p>
                    <button
                        className="post-btn"
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.href = '/';
                        }}
                    >
                        Go Home
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// Helper: wrap a page in error boundary + suspense
function SafeRoute({ children }) {
    return (
        <RouteErrorBoundary>
            <Suspense fallback={<Spinner />}>
                {children}
            </Suspense>
        </RouteErrorBoundary>
    );
}

/* Authenticated shell */
function AppShell() {
    const [showCreate, setShowCreate] = useState(false);
    const { toast } = useApp();
    return (
        <>
            <Navbar onCreatePost={() => setShowCreate(true)} />
            <div className="app-body">
                <Routes>
                    <Route path="/" element={<SafeRoute><Home /></SafeRoute>} />
                    <Route path="/explore" element={<SafeRoute><Explore /></SafeRoute>} />
                    <Route path="/near-me" element={<SafeRoute><NearMe /></SafeRoute>} />
                    <Route path="/analysis" element={<SafeRoute><Analysis /></SafeRoute>} />
                    <Route path="/profile/:id" element={<SafeRoute><ProfilePage /></SafeRoute>} />
                    <Route path="/post/:postId" element={<SafeRoute><PostDetail /></SafeRoute>} />
                    <Route path="*" element={<SafeRoute><NotFoundPage /></SafeRoute>} />
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
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route path="/welcome" element={user ? <Navigate to="/" replace /> : <LandingPage />} />
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
                <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
                <Route path="/*" element={user ? (
                    <AppProvider>
                        <AppShell />
                    </AppProvider>
                ) : <Navigate to="/welcome" replace />} />
            </Routes>
        </Suspense>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <LangProvider>
                    <RootRouter />
                </LangProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
